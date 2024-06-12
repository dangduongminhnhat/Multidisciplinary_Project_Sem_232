import config
from model import AdafruitMQTT
from flask import Flask, request, Response
from flask_cors import CORS
from route import device_api, garden_api, login_api, room_api

app = Flask(__name__)
CORS(app)
CORS(device_api)
CORS(garden_api)
CORS(login_api)
CORS(room_api)

app.register_blueprint(device_api)
app.register_blueprint(garden_api)
app.register_blueprint(login_api)
app.register_blueprint(room_api)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res

if __name__=='__main__':
    # mqtt_client = AdafruitMQTT(username=config.server.ADA_USER, key=config.server.ADA_KEY)
    # mqtt_client.connect()
    app.run(config.server.SERVER_HOST, config.server.SERVER_PORT)