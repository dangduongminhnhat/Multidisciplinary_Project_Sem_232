from flask import Blueprint
from flask_restful import Api
from flask_cors import CORS
from controller import LoginAPI, UserAPI, SignupAPI

login_api = Blueprint('login_api', __name__)
CORS(login_api)
api = Api(login_api)

api.add_resource(LoginAPI, '/api/login')
api.add_resource(SignupAPI, '/api/signup')
api.add_resource(UserAPI, '/api/v1/user/<user_id>')