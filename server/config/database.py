import os
from dotenv import load_dotenv

load_dotenv()

DB_KEY=os.getenv('DB_KEY')
DEVICE_TYPE_LIST=["temp-sensor", "humid-sensor", "light-sensor", "movement-sensor", "led", "fan", "sprinkler"]
DOCUMENT_LIST=["garden_list", "device_list", "room_list", "user_list", "usages"]
DEVICE_SENSOR_LIST=["temp-sensor", "humid-sensor", "light-sensor", "movement-sensor"]
TYPE_TEMP_SENSOR="temp-sensor"
TYPE_HUMID_SENSOR="humid-sensor"
TYPE_LIGHT_SENSOR="light-sensor"
TYPE_MOVEMENT_SENSOR="movement-sensor"
TYPE_LED="led"
TYPE_FAN="fan"
TYPE_SPRINKLER="sprinkler"
DOC_GARDEN_LIST="garden_list"
DOC_DEVICE_LIST="device_list"
DOC_ROOM_LIST="room_list"
DOC_USER_LIST="user_list"
DOC_USAGES="usages"
