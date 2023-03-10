from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'
# Init database
db = SQLAlchemy(app)

# Create db model
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    dateOfBirth = db.Column(db.String(100), nullable=False)
    major = db.Column(db.String(100), nullable=False)
    minor = db.Column(db.String(100), nullable=True)
    misc =  db.Column(db.String(20), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
# Create function to return a string when we add something
    def __repr__(self):
        return '<Name: %r>' % self.name