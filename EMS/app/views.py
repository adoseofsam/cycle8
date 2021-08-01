"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
import datetime
from app import app, db, login_manager
from app.forms import *
from app.models import *
from flask import render_template, request, redirect, url_for, flash, session, abort
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash

roles = {'admin' : "Admin", 'regular': "Regular"}



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

    db.session.add(admin)
    db.session.commit()




@app.route('/')
def home():
    """Render website's home page."""
    define_db()
    return render_template('home.html')


@app.route('/event')
def event():
    """Render website's home page."""
    return render_template('event.html')


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
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
), 'danger')

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
