import os
import jwt
from database import iot_database
from functools import wraps
from flask import request, jsonify
from error import *
import config 
from controller.response import create_response
from model import user_model

def token_require(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'access-token' in request.headers:
            token = request.headers['access-token']
        if not token:
            return create_response('', Unauthorized())
        try:
            data = jwt.decode(token, config.server.SECRET_KEY, algorithms=['HS256'])
        except Exception as err:
            return create_response('', Unauthorized("Invalid token"))
        
        try:
            user_id = data['public_id']
            user_list = user_model.get_user(user_id=user_id)
        except Exception as err:
            if type(err) == RecordNotFound:
                return create_response('', Unauthorized("Invalid token"))
            return create_response('', err)
            
        return f(*args, **kwargs)
  
    return decorator