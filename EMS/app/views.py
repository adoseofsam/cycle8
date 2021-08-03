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


# --------------- END OF JWT FUNCTIONS ---------------------


# --------------- APIs FUNCTIONS/ROUTES ---------------------

# This route requires a JWT in order to work. Note the @requires_auth

@app.route("/api/create", methods=['POST'])
@requires_auth
def create():
    form = EventForm()
    errors = []
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
                        'website_url' : website_url,
                        'status' : status,
                        'uid' : g.current_user["id"],
                        'date' : date
                }]
                message = 'Event successfully created!'

                return jsonify(data=data, message = message)
            else:
                errors.append("Title already exists")
    return jsonify(errors=form_errors(form))
    



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
            "Title": e.title,
            "Start_date": e.start_date,
            "End_date": e.end_date,
            "Description": e.description,
            "Venue": e.venue,
            "Image": e.photo,
            "Url": e.website_url,
            "Status": e.status,
            "Uid": e.uid,
            "Created_at": e.created_at
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
    print(events[0].title)

    for e in events:
        event = {
            "Title": e.title,
            "Start_date": e.start_date,
            "End_date": e.end_date,
            "Description": e.description,
            "Venue": e.venue,
            "Image": e.photo,
            "Url": e.website_url,
            "Status": e.status,
            "Uid": e.uid,
            "Created_at": e.created_at
        }

        event_lst.append(event)

    return jsonify(error = None,data={"events": event_lst}, message="Success")

"""
Search by Date API Endpoint

"""
@app.route("/api/events/search/date", methods=["POST"])
def dateSearch():
    if request.method == "POST":
        try:
            date=request.form["date"]
            date=datetime.datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
             return jsonify(error = "Invalid Date Format ",data={"events": []}, message="Error")
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
            return jsonify(error = None,data={"events": output}, message="Success")
        return jsonify(error = None,data={"events": output}, message="No Events Found")


"""
Search by Event Title API Endpoint

"""
@app.route("/api/events/search/title", methods=["GET"])
def titleSearch():
    if request.method == "GET":
        try:
            searchTitle = request.form["title"]            
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
            return jsonify(error = None,data={"events": output}, message="Success")
        return jsonify(error = None,data={"events": output}, message="No Events Found")

# --------------- END OF APIs FUNCTIONS/ROUTES ---------------------

###
# Routing for your application.
###

#default data/Users
def define_db():
    global roles
    db.drop_all()
    db.create_all()
    date = datetime.datetime.now()
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
    print(current_user)
    print(current_user.get_id())

    if not current_user.is_authenticated:
        define_db()
    """Render website's home page."""
    return render_template('home.html')


# @app.route('/event')
# def event():
#     """Render website's home page."""
#     return render_template('event.html')


@app.route('/viewEvents')
def viewEvents():
    return render_template('viewEvents.html')

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
                return redirect(url_for("login"))


    return render_template("signup.html", form=signupForm)

@app.route('/eventForm',methods=['GET'])
def eventForm():
    form = EventForm()
    return render_template('create.html', form=form)


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
