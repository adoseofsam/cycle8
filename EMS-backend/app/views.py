"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
# Using JWT
import jwt
from flask import _request_ctx_stack
from functools import wraps


import os
import datetime
from app import app, db, login_manager
from app.forms import *
from app.models import *
from flask import render_template, request, redirect, url_for, flash, jsonify, g, send_from_directory,session, abort, make_response
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash
from sqlalchemy import Date, cast

roles = {'admin' : "Admin", 'regular': "Regular"}


# ----------------- CORS SETUP ------------------
'''
@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = "http://localhost:8100"
    response.headers['Access-Control-Allow-Headers'] = "*"
    response.headers['Access-Control-Methods'] = "GET,POST,PUT,PATCH,DELETE"
    response.headers['Access-Control-Allow-Credentials'] = "true"

    return response
'''
# --------------- JWT FUNCTIONS ---------------------

# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):
  @wraps(f)
  def obtainedToken(*args, **kwargs):
    global secret_key
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, secret_key)

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return obtainedToken



# This route is just used to demonstrate a JWT being generated.
@app.route('/token')
def generate_token():
    global secret_key
    # Under normal circumstances you would generate this token when a user
    # logs into your web application and you send it back to the frontend
    # where it can be stored in localStorage for any subsequent API requests.
    payload = {'sub': '12345', 'name': 'John Doe'}
    token = jwt.encode(payload, secret_key, algorithm='HS256').decode('utf-8')

    return jsonify(error=None, data={'token': token}, message="Token Generated")


def get_token():
    global secret_key
    # Under normal circumstances you would generate this token when a user
    # logs into your web application and you send it back to the frontend
    # where it can be stored in localStorage for any subsequent API requests.
    payload = {'sub': '12345', 'name': 'John Doe'}
    token = jwt.encode(payload, secret_key, algorithm='HS256').decode('utf-8')

    return token


# --------------- END OF JWT FUNCTIONS ---------------------


# --------------- APIs FUNCTIONS/ROUTES ---------------------

@app.route("/api/logout", methods = ['GET'])
#@login_required
def api_logout():
    errors = []
    message = ""
    try:

        logout_user()
        session.pop('is_authenticated',None)
        flash('You have been logged out.', 'danger')
        message = "You have been logged out."
        return make_response(jsonify(errors= errors, message=message),200)


    except Exception as e:
        print(e)
        message = "Something went wrong"
        errors.append(e)
        return make_response(jsonify(errors= errors, message=message),404)

@app.route("/api/login", methods = ['POST'])
def api_login():
    errors = []
    print(current_user.is_authenticated)
    if current_user.is_authenticated:
        token = get_token()
        #print("Token", token)
        data = [
            {
                # 'id' : user.get_id(),
                # 'role': user.role,
                'photo': current_user.get_photo(),
                'token' : token


        }]
        message = 'User already logged in'

        #return jsonify(data=data, message = message)
        return make_response(jsonify(error = None,data=data, message=message),200)


    form = LoginForm()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        #if form.username.data:
        
        if form.validate_on_submit():

            email = request.form['email']
            password = form.password.data
            
            
            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.



            user = User.query.filter_by(email=email).first()

            if user is not None and check_password_hash(user.password,password):
                
                # get user id, load into session
                login_user(user)
                # remember to flash a message to the user
                
                session['is_authenticated'] = True #current_user.is_authenticated
                token = get_token()
                print("Token", token)

                data = [
                    {
                        'id' : user.get_id(),
                        'role': user.role,
                        'photo': user.get_photo(),
                        'token' : token

                }]
                message = 'Login successful!'

                #return jsonify(data=data, message = message)
                return make_response(jsonify(error = None,data=data, message=message),200)
                
            else:
                errors.append('Invalid credentials.')

    message = 'Login failed!'
    #return jsonify(errors=form_errors(form) + errors) 
    return make_response(jsonify(errors=form_errors(form) + errors, message=message),404)



@app.route('/api/signup', methods = ['POST'])
def api_signup():
    errors = []
    signupForm = SignUpForm()

    if request.method == "POST":
        print("here")
        try:

        
            role = signupForm.role.data
            FullName = signupForm.FullName.data
            email = signupForm.email.data
            password = signupForm.password.data
            Profile_Photo = signupForm.Profile_Photo.data
            filename = secure_filename(Profile_Photo.filename)
            Profile_Photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))

            date = datetime.datetime.now()
            user = User(FullName,email,password,filename,role,date)


        
            db.session.add(user)
            db.session.commit()

            message = 'Account created successfully!'
            return make_response(jsonify(errors= errors, message=message),200)

        except Exception as e:

            message = 'Account was not created successfully.'
            print(e)
            errors.append(e)
            return make_response(jsonify(errors= errors, message=message),404)

    message = "Access denied!"
    return make_response(jsonify(errors= errors, message=message),403)


# This route requires a JWT in order to work. Note the @requires_auth

@app.route("/api/events", methods=['POST'])
@requires_auth
def create():
    form = EventForm()
    errors = []
    print("Creating new events")
    if request.method == 'POST':
        if form.validate_on_submit():

            title = form.title.data

            start_date = form.start_date.data
            s = datetime.datetime.strptime(start_date, '%Y-%m-%d')
            end_date = form.end_date.data
            e = datetime.datetime.strptime(end_date, '%Y-%m-%d')
           
            description = form.description.data
            venue = form.venue.data
            photo = form.photo.data
            website_url = form.website_url.data
            status = "Pending" #placeholder until further notice
            date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            filename = secure_filename(photo.filename)

            
            event1 = Events.query.filter_by(title=title).first()
           
            if event1 is None:
                
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                newEvent = Events(title = title, start_date=s,end_date=e,description=description,venue=venue,photo=filename,website_url=website_url,status=status,uid = current_user.get_id(),date=date)
                
                db.session.add(newEvent)
                db.session.commit()
                                
                event = Events.query.filter_by(title=title).first()
                
                data = [
                    {
                        'id' : event.id,
                        'title' : title,
                        'start_date' : start_date,
                        'end_date' : end_date,
                        'description': description,
                        'venue' : venue,
                        'photo' : filename,
                        'url' : website_url,
                        'status' : status,
                        'uid' : current_user.get_id(),
                        'created_at' : date
                }]
                message = 'Event successfully created!'

                return jsonify(data=data, message = message)
            else:
                errors.append("Title already exists")
    return jsonify(errors=form_errors(form) + errors)
    



secret_key = "CodeTitiansSup3r$3cretkey"   


@app.route('/api/events', methods=['GET'])
@requires_auth
def api_events():
    # This data was retrieved from the payload of the JSON Web Token
    # take a look at the requires_auth decorator code to see how we decoded
    # the information from the JWT.

    '''
    jwt token for postman -
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM
    '''
    events = Events.query.all()
    event_lst = []
    print(events[0].title)

    for e in events:
        event = {
            'id' : e.id,
            "title": e.title,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "description": e.description,
            "venue": e.venue,
            "photo": e.photo,
            "url": e.website_url,
            "status": e.status,
            "uid": e.uid,
            "created_at": e.created_at
        }

        event_lst.append(event)

    return make_response(jsonify(error = None,data={"events": event_lst}, message="Success"),200)



@app.route('/api/events/<int:uid>', methods=['GET'])
@requires_auth
def api_events_by_uid(uid):
    # This data was retrieved from the payload of the JSON Web Token
    # take a look at the requires_auth decorator code to see how we decoded
    # the information from the JWT.

    '''
    jwt token for postman -
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM
    '''
    
    events = Events.query.filter_by(uid = uid).all()
    event_lst = []
    # print(events[0].title)

    if events is not None and events!=[]:

        for e in events:
            event = {
                'id' : e.id,
                "title": e.title,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "description": e.description,
                "venue": e.venue,
                'photo' : e.photo,
                "url": e.website_url,
                "status": e.status,
                "uid": e.uid,
                "created_at": e.created_at
            }

            event_lst.append(event)

        return make_response(jsonify(error = None,data={"events": event_lst}, message="Success"),200)
    return make_response(jsonify(error = None,data={"events": event_lst}, message="No Event Found"),200)


@app.route('/api/events/<string:status>', methods=['GET'])
@requires_auth
def api_events_by_status(status):
    # This data was retrieved from the payload of the JSON Web Token
    # take a look at the requires_auth decorator code to see how we decoded
    # the information from the JWT.
    status = status.capitalize()

    '''
    jwt token for postman -
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSJ9.ei0eGg3aZqEoaQ7UOe6WvXodb6chhu6RnoS--fpfcMM
    '''
    
    events = Events.query.filter_by(status = status).all()
    event_lst = []

    if events is None or events ==[]:
        print("no event")
        return make_response(jsonify(error = None,data={"events": event_lst}, message="Success"),200)


    else:

        print(events[0].title)

        for e in events:
            event = {
                'id' : e.id,
                "title": e.title,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "description": e.description,
                "venue": e.venue,
                'photo' : e.photo,
                "url": e.website_url,
                "status": e.status,
                "uid": e.uid,
                "created_at": e.created_at
            }

            event_lst.append(event)

        return make_response(jsonify(error = None,data={"events": event_lst}, message="Success"),200)

"""
Search by Date API Endpoint

"""
@app.route("/api/events/search/date/<string:date>", methods=["GET"])
def dateSearch(date):
    if request.method == "GET":
        try:
            print("date was called")
            #date=request.form["date"]
            date=datetime.datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
             return make_response(jsonify(error = "Invalid Date Format ",data={"events": []}, message="Error"),400)
        results=Events.query.filter(cast(Events.start_date,Date)<=date.date()).filter(cast(Events.end_date,Date)>=date.date()).all()
        output=[]
        if results is not None and results!=[]:
            for result in results:
                event={
                        'id' : result.id,
                        'title' : result.title,
                        'start_date' : result.start_date,
                        'end_date' : result.end_date,
                        'description': result.description,
                        'venue' : result.venue,
                        'photo' : result.photo,
                        'website_url' : result.website_url,
                        'status' : result.status,
                        'uid' : result.uid,
                        'created' : result.created_at
                    }
                output.append(event)
            return make_response(jsonify(error = None,data={"events": output}, message="Success"),200)
        return  make_response(jsonify(error = None,data={"events": output}, message="No Events Found"),200)


"""
Search by Event Title API Endpoint

"""
@app.route("/api/events/search/title/<string:title>", methods=["GET"])
def titleSearch(title):
    if request.method == "GET":
        try:
            searchTitle = title #request.form["title"]            
        except ValueError:
             return jsonify(error = "Invalid Title ",data={"events": []}, message="Error")
        resultsList = Events.query.filter(Events.title.ilike(searchTitle)).all() 
        
        output=[]
        if resultsList is not None and resultsList!=[]:
            for result in resultsList:
                event={
                        'id' : result.id,
                        'title' : result.title,
                        'start_date' : result.start_date,
                        'end_date' : result.end_date,
                        'description': result.description,
                        'venue' : result.venue,
                        'photo' : result.photo,
                        'website_url' : result.website_url,
                        'status' : result.status,
                        'uid' : result.uid,
                        'created' : result.created_at
                    }
                output.append(event)
            return make_response(jsonify(error = None,data={"events": output}, message="Success"),200)
        return make_response(jsonify(error = None,data={"events": output}, message="No Events Found"),200)


@app.route("/api/events/publish/<int:id>", methods=["PUT"])
def publishEvent(id):
    if request.method == "PUT":
        try:
            event = Events.query.filter_by(id = id).first()
            if event is not None and event!=[]:
                event.status = 'Published'
                db.session.commit()
                return make_response(jsonify(error = None, message="Success"),200)

            return make_response(jsonify(error = "No ID matched", message="No Events Found"),200)
        except ValueError:
            return make_response(jsonify(error = "Invalid ID ", message="Error"),404)


@app.route("/api/events/reject/<int:id>", methods=["PUT"])
def rejectEvent(id):
    if request.method == "PUT":
        try:
            event = Events.query.filter_by(id = id).first()
            if event is not None and event!=[]:
                event.status = 'Rejected'
                db.session.commit()
                return make_response(jsonify(error = None, message="Success"),200)
            return make_response(jsonify(error = "No ID matched", message="No Events Found"),200)
        except ValueError:
            return make_response(jsonify(error = "Invalid ID ", message="Error"),404)

@app.route('/api/events/<int:id>', methods=['DELETE'])
def deleteEvent(id):
    if request.method == "DELETE":
        event = Events.query.filter_by(id = id).first()

        if not event:
            return make_response(jsonify(error = None, message="Event does not exist"), 404)

        # if current_user.get_role() != "Admin" or current_user.get_role() != "admin":
        #     return make_response(jsonify(error = None, message = "You need admin privileges to delete an event"), 401)

        db.session.delete(event)
        db.session.commit()
        return make_response(jsonify(error = None, message="Success"),200)


# --------------- END OF APIs FUNCTIONS/ROUTES ---------------------

###
# Routing for your application.
###

#default data/Users
def define_db():
    global roles
    db.drop_all()
    db.create_all()
    date = datetime.datetime.now().strftime('%Y-%m-%d')
    print("Date - ", date)
    admin = User("Admin User","Admin@example.com","Adminpassword","admin_pic.png",roles["admin"],date)
    regular = User("Regular User","Regular@example.com","Regularpassword","admin_pic.png",roles["regular"],date)

    newEvent = Events(title = "Event 1", start_date=date,end_date=date,description="description 1",venue="At home 1",photo="event_pic.png",website_url="google.com",status="Published",uid = 2,date=date)
    newEvent2 = Events(title = "Event 2", start_date=date,end_date=date,description="description 2",venue="At home 2",photo="event_pic.png",website_url="google.com",status="Pending",uid = 2,date=date)
    newEvent3 = Events(title = "Event 3", start_date=date,end_date=date,description="description 3",venue="At home 3",photo="event_pic.png",website_url="google.com",status="Pending",uid = 1,date=date)

    db.session.add(admin)
    db.session.add(regular)
    db.session.add(newEvent)
    db.session.add(newEvent2)
    db.session.add(newEvent3)

    db.session.commit()




@app.route('/')
def home():
    if not current_user.is_authenticated:
        define_db()
        return render_template('home.html')
    """Render website's home page."""
    return render_template('viewEvents.html')

@app.route('/about')
def about():
    """Render website's home page."""
    return render_template('about.html')

# @app.route('/event')
# def event():
#     """Render website's home page."""
#     return render_template('event.html')


@app.route('/viewEvents')
@login_required
def viewEvents():
    return render_template('viewEvents.html', user = current_user)

@app.route('/signup', methods = ['GET','POST'])
def signup():
    signupForm = SignUpForm()
    if request.method == "POST":
        if signupForm.validate_on_submit():
            role = signupForm.role.data
            FullName = signupForm.FullName.data
            email = signupForm.email.data
            password = signupForm.password.data
            Profile_Photo = signupForm.Profile_Photo.data
            filename = secure_filename(Profile_Photo.filename)
            Profile_Photo.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))

            date = datetime.datetime.now()
            user = User(FullName,email,password,filename,role,date)


            try:
                db.session.add(user)
                db.session.commit()

                flash('Account created successfully.','success')
                return redirect(url_for("login"))

            except Exception as e:
                flash('Account was not created successfully.','danger')
                print(e)
                return redirect(url_for("login"))


    return render_template("signup.html", form=signupForm)

@app.route('/eventForm',methods=['GET'])
def eventForm():
    form = EventForm()
    return render_template('create.html', form=form, token = get_token())


@app.route("/login", methods=["GET", "POST"])
def login():
    
    if current_user.is_authenticated:
        
        return redirect(url_for('home'))

    form = LoginForm()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        #if form.username.data:
        
        if form.validate_on_submit():

            email = request.form['email']
            password = form.password.data
            
            
            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.



            user = User.query.filter_by(email=email).first()

            if user is not None and check_password_hash(user.password,password):
                
                # get user id, load into session
                login_user(user)
                # remember to flash a message to the user
                
                session['is_authenticated'] = True #current_user.is_authenticated
                
                flash('Logged in successfully.','success')
                return redirect(url_for("home"))
            
            flash('Invalid credentials.','danger')
            

    return render_template("login.html", form=form)

@app.route("/logout")
#@login_required
def logout():
    logout_user()
    session.pop('is_authenticated',None)
    flash('You have been logged out.', 'danger')
    return redirect(url_for('login'))


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))




        

###
# The functions below should be applicable to all Flask apps.
###

# Flash errors from the form if validation fails
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)

# os.path.join(app.config['UPLOAD_FOLDER'],filename)
# r'C:\Users\Camille\OneDrive\Desktop\Info 3180 -Labs\NCB-UWI\cycle8\EMS-backend\app\static\uploads\\'

@app.route("/uploads/<path:name>")
def download_file(name):
    rootdir = os.getcwd()
    #print(rootdir)
    path = '/app/static/uploads'
    dir = rootdir + app.config['UPLOAD_FOLDER'] #path
    # print(dir)
    #print("in files - ", name)
    return send_from_directory(
        dir, filename=name, as_attachment=False
    )


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
