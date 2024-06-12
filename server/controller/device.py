import json
from flask import request
from flask_restful import Resource
from database import iot_database
from model import adafruit_server, device_model
from controller.response import create_response
from middleware import token_require
from error import *
from model import mqtt_client

class GetMultiDeviceFullInfoByRoomAPI(Resource):
    @token_require
    def get(self, room_id):
        try:
            device_list = device_model.get_device(room_id=room_id, include_log=True)
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)

class GetMultiDeviceFullInfoByGardenAPI(Resource):
    @token_require
    def get(self, garden_id):
        try:
            device_list = device_model.get_device(garden_id=garden_id, include_log=True)
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)
    
class GetMultiDeviceByRoomAPI(Resource):
    @token_require
    def get(self, room_id):
        try:
            device_list = device_model.get_device(room_id=room_id)
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)

class GetMultiDeviceByGardenAPI(Resource):
    @token_require
    def get(self, garden_id):
        try:
            device_list = device_model.get_device(garden_id=garden_id)
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)

class GetSingleDeviceFullInfoAPI(Resource):
    @token_require
    def get(self, device_id):
        try:
            device_list = device_model.get_device(device_id, include_log=True)
        except Exception as err:
            return create_response('', err)
        data = [device.data for device in device_list]
        return create_response(data)
    
class GetMultiDeviceFullInfoAPI(Resource):
    @token_require
    def get(self):
        try:
            device_list = device_model.get_device(include_log=True)
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)


class MultiDeviceAPI(Resource):
    @token_require
    def get(self):
        try:
            device_list = device_model.get_device()
        except Exception as err:
            return create_response('', err)

        data = [device.data for device in device_list]
        return create_response(data)

    @token_require
    def post(self): 
        record = request.json
        try:
            device = device_model.add_device(record)
        except Exception as err:
            return create_response('', err)
        
        name = device.data["_id"]
        group_key = device.data["garden_id"]
        feed_key = device.data["_id"]
        
        try:
            adafruit_server.add_feed(feed_name=name, feed_key=feed_key, group_key=group_key)
            mqtt_client._update_feed_keys()
        except:
            return create_response('', AdafruitError())

        return create_response(device.data)


class SingleDeviceAPI(Resource):
    @token_require
    def get(self, device_id):
        try:
            device_list = device_model.get_device(device_id)
        except Exception as err:
            return create_response('', err)
        data = [device.data for device in device_list]
        return create_response(data)

    @token_require
    def put(self, device_id):
        record = request.json
        try:
            device_list = device_model.get_device(device_id)
            if len(device_list) < 1:
                return create_response('', RecordNotFound())
        except Exception as err:
            return create_response('', err)

        device = device_list[0]
        group_key = device.data["garden_id"].lower()
        feed_key = device.data["_id"].lower()

        try:
            data = record['data']
        except:
            return create_response('', LackRequestData())
        
        # try:
        #     device_model.update_device_data(device.data["_id"], data)
        # except Exception as err:
        #     return create_response('', err)
        
        try:
            adafruit_server.send_data(feed_key="{}.{}".format(group_key, feed_key), data=data)
        except:
            return create_response('', AdafruitError())
        
        try:
            device_list = device_model.get_device(device_id)
            device = device_list[0]
        except Exception as err:
            return create_response('', err)
        
        return create_response(device.data)
    
    @token_require
    def delete(self, device_id):
        try:
            device = device_model.delete_device(device_id)
        except Exception as err:
            return create_response('', err)
        
        group_key = device.data["garden_id"].lower()
        feed_key = device.data["_id"].lower()

        try:
            adafruit_server.delete_feed(feed_key="{}.{}".format(group_key, feed_key))
        except Exception as err:
            print(err)
            return create_response('', AdafruitError())
        
        return create_response(device.data)


class GatewayDeviceAPI(Resource):
    def put(self, device_id):
        record = request.json
        try:
            device_list = device_model.get_device(device_id)
            if len(device_list) < 1:
                return create_response('', RecordNotFound())
        except Exception as err:
            return create_response('', err)

        device = device_list[0]
        group_key = device.data["garden_id"]
        feed_key = device.data["_id"]

        try:
            data = record['data']
        except:
            return create_response('', LackRequestData())
        
        try:
            adafruit_server.send_data(feed_key="{}.{}".format(group_key, feed_key), data=data)
        except:
            return create_response('', AdafruitError())
        
        try:
            device_list = device_model.get_device(device_id)
            device = device_list[0]
        except Exception as err:
            return create_response('', err)
        
        return create_response(device.data)