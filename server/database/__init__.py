import config
from database.database import Database
from database.document import Device, User, Garden, Room

iot_database = Database(config.database.DB_KEY)