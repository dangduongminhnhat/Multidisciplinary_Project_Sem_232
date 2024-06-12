import json
from flask import request
from flask_restful import Resource
from database import iot_database
from model import adafruit_server, garden_model
from controller.response import create_response
from middleware import token_require
from error import *

class MultiGardenAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()

    @token_require
    def get(self):
        try:
            garden_list = garden_model.get_garden()
        except Exception as err:
            return create_response('', err)
        data = [garden.data for garden in garden_list]
        return create_response(data)
        
    @token_require
    def post(self):
        record = request.json
        try:
            garden = garden_model.add_garden(record)
        except Exception as err:
            return create_response('', err)
            
        group_key = garden.data["_id"]
        group_name = garden.data["name"]
        try:
            adafruit_server.add_group(group_name=group_name, group_key=group_key)
        except:
            create_response('', AdafruitError())
        
        return create_response(garden.data)
            
class SingleGardenAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()

    @token_require
    def get(self, garden_id):
        try:
            garden_list = garden_model.get_garden(garden_id)
        except Exception as err:
            return create_response('', err)
        data = [garden.data for garden in garden_list]
        return create_response(data)

    def put(self, garden_id):
        record = request.json
        try:
            alarm_info = record['alarm']
        except:
            return create_response('', LackRequestData())
        
        try:
            garden = garden_model.update_warning(garden_id, alarm_info)
        except:
            raise RecordUpdateError()
        
        return create_response(garden.data)

    @token_require
    def delete(self, garden_id):
        try:
            garden = garden_model.delete_garden(garden_id)
        except Exception as err:
            return create_response('', err)
        
        group_key = garden.data["_id"].lower()
        try:
            adafruit_server.delete_group(group_key=group_key)
        except:
            return create_response('', AdafruitError())
        
        return create_response(garden.data)
        