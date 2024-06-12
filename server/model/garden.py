import config
from database import Garden
from error import *

class GardenModel():
    def __init__(self, database) -> None:
        self._database = database

    def get_garden(self, garden_id=None):
        query = {}
        if garden_id:
            query["_id"] = garden_id
        try:
            garden_list = self._database.fetch_data(config.database.DOC_GARDEN_LIST, query)
        except:
            raise RecordFindError(garden_id)
        
        if garden_id and len(garden_list) < 1:
            raise RecordNotFound(garden_id)
        
        return garden_list
    
    def add_garden(self, record):
        try:
            name = record['name']
        except:
            raise LackRequestData()

        garden = Garden(name)

        try:
            self._database.add_data(garden)
        except:
            raise RecordInsertError(record)

        return garden


    def delete_garden(self, garden_id):
        try:
            garden_list = self.get_garden(garden_id)
            if len(garden_list) < 1:
                raise RecordNotFound(garden_id)
            garden = garden_list[0]
            self._database.remove_data(garden)
        except:
            raise RecordDeleteError(garden_id)
        return garden
    
    
    def update_warning(self, garden_id, alarm):
        try:
            garden_list = self.get_garden(garden_id)
            if len(garden_list) < 1:
                raise RecordNotFound(garden_id)
            garden = garden_list[0]
            update_data = {'alarm': alarm}
            self._database.update_one_data(garden, update_data)
        except:
            raise RecordUpdateError(garden_id)
        return garden