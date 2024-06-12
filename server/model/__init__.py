import config
from database import iot_database
from model.adafruit import Adafruit, AdafruitMQTT
from model.garden import GardenModel
from model.room import RoomModel
from model.device import DeviceModel
from model.user import UserModel

device_model = DeviceModel(iot_database)
garden_model = GardenModel(iot_database)
room_model = RoomModel(iot_database)
user_model = UserModel(iot_database)

adafruit_server = Adafruit(config.server.ADA_USER, config.server.ADA_KEY)
mqtt_client = AdafruitMQTT(username=config.server.ADA_USER, key=config.server.ADA_KEY)
mqtt_client.connect()