import sys
from Adafruit_IO import Client, Feed, Group, MQTTClient
from database import iot_database
from model.device import DeviceModel
from error import *

class Adafruit():
    def __init__(self, username, key):
        self._ada_client = Client(username=username, key=key)

    def get_group(self, group_key=None):
        return self._ada_client.groups(group=group_key)

    def add_group(self, group_name, group_key):
        group = Group(name=group_name, key=group_key)
        return self._ada_client.create_group(group=group)

    def delete_group(self, group_key):
        self._ada_client.delete_group(group=group_key)

    def get_feed(self, feed_key=None):
        return self._ada_client.feeds(feed=feed_key)

    def add_feed(self, feed_name, feed_key, group_key=None):
        feed = Feed(name=feed_name, key=feed_key)
        return self._ada_client.create_feed(feed=feed, group_key=group_key)

    def delete_feed(self, feed_key):
        self._ada_client.delete_feed(feed=feed_key)

    def get_feed_data(self, feed_key):
        return self._ada_client.data(feed_key)

    def send_data(self, feed_key, data):
        self._ada_client.send_data(feed=feed_key, value=data)


class AdafruitMQTT():
    """Handle streaming data from Adafruit Server and save to Database
    """
    def __init__(self, username, key):
        self._mqtt_client = MQTTClient(username=username, key=key)
        self._ada_client = Client(username=username, key=key)
        self._database_handler = MQTTDataHandler(iot_database)
        
        self._set_feed_keys()
        self._set_callback()

    def _set_callback(self):
        self._mqtt_client.on_connect = self._connected
        self._mqtt_client.on_disconnect = self._disconnected
        self._mqtt_client.on_message = self._message
        self._mqtt_client.on_subscribe = self._subcribe
        self._mqtt_client._client.on_unsubscribe = self._unsubscribe

    def _connected(self, client):
        for feed in self._feed_keys:
            client.subscribe(feed)

    def _subcribe(self, client, userdata, mid, granted_qos):
        print("Subscribed to {0} with QOS level {1}".format(mid, granted_qos))

    def _unsubscribe(self, client, userdata, mid):
        print("Unsubscribed from {0}".format(mid))

    def _disconnected(self, client, userdata, rc):
        print("Disconnected from Adafruit Server")
        sys.exit(1)

    def _message(self, client, userdata, payload):
        print('Feed {0} received new value: {1}'.format(userdata, payload))
        self._database_handler.save(userdata, payload)

    def _set_feed_keys(self):
        self._feed_keys = self._get_feed_keys()

    def _get_feed_keys(self):
        return [feed.key for feed in self._ada_client.feeds()]
    
    def _update_feed_keys(self):
        current_feeds = self._get_feed_keys()
        
        current_feeds_set = set(current_feeds)
        old_feeds_set = set(self._feed_keys)
        
        new_feeds = list(current_feeds_set - old_feeds_set)
        old_feeds = list(old_feeds_set - current_feeds_set)    

        self._feed_keys = current_feeds

        for feed in old_feeds:
            self._mqtt_client.unsubscribe(feed)
        
        for feed in new_feeds:
            self._mqtt_client.subscribe(feed)

    def connect(self):
        self._mqtt_client.connect()
        self._mqtt_client.loop_background()

    def run(self):
        self._mqtt_client.connect()
        self._mqtt_client.loop_background()
        while True:
            self._update_feed_keys()


class MQTTDataHandler():
    def __init__(self, database):
        self._device_model = DeviceModel(database)

    def _feed_parse(self, userdata):
        meta_data = userdata.split('.')
        garden_id = meta_data[0]
        device_id = meta_data[1]
        return garden_id, device_id
    
    def save(self, userdata, payload):
        garden_id, device_id = self._feed_parse(userdata)
        data = str(payload)
        return self._device_model.update_device_data(device_id, data)

