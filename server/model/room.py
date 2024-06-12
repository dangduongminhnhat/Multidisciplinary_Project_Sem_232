import config
from database import Room
from error import *

class RoomModel():
    def __init__(self, database) -> None:
        self._database = database

    def get_room(self, room_id=None, garden_id=None):
        query = {}
        if room_id:
            query["_id"] = room_id
        if garden_id:
            query["garden_id"] = garden_id
        
        try:
            room_list = self._database.fetch_data(config.database.DOC_ROOM_LIST, query)
        except:
            raise RecordFindError(room_id)
        
        if room_id and len(room_list) < 1:
            raise RecordNotFound(room_id)
        
        return room_list

    def add_room(self, record):
        try:
            room_name = record['name']
            garden_id = record['garden_id']
            isAutoFan = record['isAutoFan']
            threshold = record['threshold']
        except:
            raise LackRequestData()
        
        room = Room(garden_id=garden_id, name=room_name,
                    isAutoFan=isAutoFan, threshold=threshold)
        
        try:
            self._database.add_data(room)
        except:
            raise RecordInsertError(record)
        
        return room
    
    def update_room(self, record):
        try:
            room_id = record['room_id']
            isAutoFan = record['isAutoFan']
            threshold = record['threshold']
        except:
            raise LackRequestData()
        try:
            room_list = self.get_room(room_id)
        except Exception as err:
            raise RecordNotFound(room_id)
        room = room_list[0]
        room.data["isAutoFan"] = isAutoFan
        room.data["threshold"] = threshold
        update_data = {
            "isAutoFan": isAutoFan,
            "threshold": threshold
        }
        try:
            self._database.update_one_data(room, update_data)
        except:
            raise RecordUpdateError(room_id)
        return room

    def delete_room(self, room_id):
        try:
            room_list = self.get_room(room_id)
            if len(room_list) < 1:
                raise RecordNotFound(room_id)
            room = room_list[0]
            self._database.remove_data(room)
        except:
            raise RecordDeleteError(room_id)
        
        return room
    