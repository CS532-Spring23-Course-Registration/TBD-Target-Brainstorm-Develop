import os
from dotenv import load_dotenv

load_dotenv()

def _get_db_secret():
    tmp = os.getenv('DB_SECRET')
    
    # check if db_secret is loaded from Github actions
    if tmp == 'None':
        return None
    return tmp

