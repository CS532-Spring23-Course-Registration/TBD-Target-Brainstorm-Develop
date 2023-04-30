import os
import secrets
from datetime import timedelta
from os import path

from flask import Flask
from flask_caching import Cache
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

from .report_routing import reports
from .views.db_secrets import db_secrets

from app.models.app import db

DB_NAME = 'database/registration.db'


def create_app():
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///' + os.path.join(basedir, DB_NAME)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = secrets.token_hex(16)  # Secret key used to sign session cookies
    cache = Cache(app, config={'CACHE_TYPE': 'flask_caching.backends.SimpleCache'})  # Initialize Flask-Caching
    
    db.init_app(app)

    app.register_blueprint(db_secrets, url_prefix='/')
    app.register_blueprint(reports, url_prefix='/')

    with app.app_context():
        if not path.exists('app/' + DB_NAME):
            db.create_all()
            print('Created Database!')

    return app, cache, db
