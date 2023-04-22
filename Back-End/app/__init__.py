import secrets
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

from os import path

db = SQLAlchemy()
DB_NAME = 'database.db'

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    cache = Cache(app, config={'CACHE_TYPE': 'simple'}) # Initialize Flask-Caching

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = secrets.token_hex(16) # Secret key used to sign session cookies
    cache = Cache(app, config={'CACHE_TYPE': 'flask_caching.backends.SimpleCache'}) # Initialize Flask-Caching

    
    db.init_app(app)
    
    from .views.db_secrets import db_secrets
    
    app.register_blueprint(db_secrets, url_prefix='/')
    
    # with app.app_context():
    #     db.create_all()
    
    return (app, cache, db)


def create_database(app):
    if not path.exists('app/' + DB_NAME):
        db.create_all(app=app)
        print('Created Database!')