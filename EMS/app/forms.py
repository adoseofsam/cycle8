from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, SelectField,BooleanField,RadioField,TextAreaField,TextField
from wtforms.validators import InputRequired,DataRequired, Email, EqualTo


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[InputRequired(),Email()])
    password = PasswordField('Password', validators=[InputRequired()])

class SignUpForm(FlaskForm):
    
    role = SelectField('Role', choices = [('Admin','Admin'),('Regular','Regular')]) 
    FullName = StringField('FullName',validators = [DataRequired()])
    email = StringField('Email',validators = [DataRequired(),Email()])
    Profile_Photo = FileField('Profile_photo', validators = [FileRequired(), FileAllowed(['jpg','jpeg','png','Images only!'])])
    password = PasswordField('Password', validators=[InputRequired(), EqualTo('confirm', message = 'Password must match')])
    confirm = PasswordField('Password Confirmation')

class EventForm(FlaskForm):
    title = StringField('Event Title', validators=[DataRequired()])
    start_date = StringField('Start Date', validators=[DataRequired()])
    end_date = StringField('End Date', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    Photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['jpg','jpeg', 'png', 'Images only!'])])
    website_url = StringField('URL', validators=[DataRequired()])
    status = SelectField('Status', [DataRequired()], choices=["Pending", "Published"])
    date = StringField('Date created', validators=[DataRequired()])
 

