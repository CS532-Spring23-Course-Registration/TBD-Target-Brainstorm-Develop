from flask import Flask

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = 'cs532_course_registration'
    
    from .views import secrets
    
    app.register_blueprint(secrets, url_prefix='/secrets')
    
    return app