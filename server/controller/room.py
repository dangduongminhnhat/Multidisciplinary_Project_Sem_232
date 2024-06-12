import json
from flask import request
from flask_restful import Resource
from database import iot_database
from model import room_model
from controller.response import create_response
from middleware import token_require
from error import *

class GetRoomByGardenAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()

    @token_require
    def get(self, garden_id):
        try:
            room_list = room_model.get_room(garden_id=garden_id)
        except Exception as err:
            return create_response('', err)
        data = [room.data for room in room_list]
        return create_response(data)
    
class MultiRoomAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()

    @token_require
    def get(self):
        try:
            room_list = room_model.get_room()
        except Exception as err:
            return create_response('', err)
        data = [room.data for room in room_list]
        return create_response(data)

    @token_require
    def post(self):
        record = request.json
        try:
            room = room_model.add_room(record)
        except Exception as err:
            return create_response('', err)
    
        return create_response(room.data)
    
class SingleRoomAPI(Resource):
    def __init__(self, **kwargs) -> None:
        super(Resource, self).__init__()

    @token_require
    def get(self, room_id):
        try:
            room_list = room_model.get_room(room_id)
        except Exception as err:
            return create_response('', err)
        data = [room.data for room in room_list]
        return create_response(data)

    @token_require
    def put(self, room_id):
        try:
            room_list = room_model.get_room(room_id)
        except Exception as err:
            return create_response('', err)
        record = request.json
        try:
            room = room_model.update_room(record)
        except Exception as err:
            raise RecordUpdateError()
        return create_response(room.data)

    @token_require
    def delete(self, room_id):
        try:
            room = room_model.delete_room(room_id)
        except Exception as err:
            return create_response('', err)
        
        return create_response(room_id)
        