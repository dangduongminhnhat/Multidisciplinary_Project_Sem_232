from enum import IntEnum
from flask import make_response
from error import *

class ServerError():
    BAD_REQUEST = {
        "code": 400,
        "message": "Bad Request"
    }

    UNAUTHORIZED = {
        "code": 401,
        "message": "Unauthorized"
    }

    ACCESS_FORBIDDEN =  {
        "code": 403,
        "message": "Access Forbidden"
    }

    INTERNAL_SERVER_ERROR = {
        "code": 500,
        "message": "Internal Server Error"
    }

class SuccessfulResponse():
    OK = {
        "code": 200,
        "message": "OK"
    }

    CREATED = {
        "code": 201,
        "message": "Created Resource"
    }

    @staticmethod
    def get_message(code):
        if code == 200:
            return SuccessfulResponse.OK["message"]
        if code == 201:
            SuccessfulResponse.CREATED["message"]

bad_request_errors = [
    RecordNotFound,
    LackRequestData
]

def get_status_code(err):
    if type(err) in bad_request_errors:
        return ServerError.BAD_REQUEST["code"], ServerError.BAD_REQUEST["message"]
    if type(err) == Unauthorized:
        return ServerError.UNAUTHORIZED["code"], ServerError.UNAUTHORIZED["message"]
    if type(err) == AccessForbidden:
        return ServerError.ACCESS_FORBIDDEN["code"], ServerError.ACCESS_FORBIDDEN["message"]
    return ServerError.INTERNAL_SERVER_ERROR["code"], ServerError.INTERNAL_SERVER_ERROR["message"]

def get_response(data, error=None, code=200, token=None):
    if error:
        err_dict = {
            "type": error.type,
            "message": error.message
        }
        status, message = get_status_code(error)
    else:
        err_dict = {}
        status = code
        message = SuccessfulResponse.get_message(code)
    
    response = {
        "status": status,
        "data": data,
        "errors": err_dict,
        "message": message,
        "access-token": token
    }
    return response, status

def create_response(data, error=None, code=200, token=None):
    data, code = get_response(data, error, code, token)
    response = make_response(data, code)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response