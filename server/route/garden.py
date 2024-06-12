from flask import Blueprint
from flask_restful import Api
from controller import MultiGardenAPI, SingleGardenAPI

garden_api = Blueprint('garden_api', __name__)
api = Api(garden_api)

api.add_resource(MultiGardenAPI, '/api/v1/garden')
api.add_resource(SingleGardenAPI, '/api/v1/garden/<garden_id>')