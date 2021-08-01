from app import db
from werkzeug.security import generate_password_hash



class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120))
    email = db.Column(db.String(64), unique=True, index=True)
    password = db.Column(db.String(120))
    profile_photo = db.Column(db.String(80))
    role = db.Column(db.String(20))
    created_at = db.Column(db.DateTime())

    def __init__(self, full_name, email, password, photo, role, date):
        self.full_name = full_name
        self.email = email
        self.password = generate_password_hash(password, method = 'pbkdf2:sha256')
        self.profile_photo = photo
        self.role = role
        self.created_at = date

    def is_authenticated(self):
        return True

    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)

