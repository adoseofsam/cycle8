from app import db
from werkzeug.security import generate_password_hash

class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    start_date = db.Column(db.DateTime())
    end_date = db.Column(db.DateTime())
    description = db.Column(db.String(300))
    venue = db.Column(db.String(50))
    photo = db.Column(db.String(255))
    website_url = db.Column(db.String(100))
    status = db.Column(db.String(10))
    uid = db.Column(db.Integer)
    created_at = db.Column(db.DateTime())

    def __init__(self,id,title,start_date,end_date,description,venue,photo,website_url,status,uid,date):
        self.id = id
        self.title = title
        self.start_date = start_date
        self.end_date = end_date
        self.description = description
        self.venue = venue
        self.photo = photo
        self.website_url = website_url
        self.status = status
        self.uid = uid
        self.created_at = date

    def get_id(self):
        try:
            return unicode(self.id) 
        except NameError:
            return str(self.id)  

    def __repr__(self):
        return '<Description %r>' % self.description
        

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


class Test(db.Model):
    __tablename__ = 'Test'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120))


    def __init__(self, full_name):
        self.full_name = full_name

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
        return '<User %r>' % (self.full_name)


