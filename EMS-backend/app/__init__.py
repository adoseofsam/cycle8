from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


# Config Values
UPLOAD_FOLDER = './app/static/uploads/'

USERNAME = 'codeTitan'
PASSWORD = 'password'
DATABASE = 'cycle8'

# SECRET_KEY is needed for session security, the flash() method in this case stores the message in a session
SECRET_KEY = 'CodeTitiansSup3r$3cretkey'


app = Flask(__name__)

# Flask-SQLAlchemy
app.config['SECRET_KEY'] = SECRET_KEY
#app.config['SQLALCHEMY_DATABASE_URI'] = "mariadb+mariadbconnector://%s:%s@localhost/%s" % (USERNAME,PASSWORD,DATABASE)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+mysqlconnector://%s:%s@localhost/%s" % (USERNAME,PASSWORD,DATABASE)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # added just to suppress a warning

app.config['WTF_CSRF_ENABLED'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views
