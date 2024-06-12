import os
from dotenv import load_dotenv

load_dotenv()

ADA_USER = os.getenv('ADA_USER')
ADA_KEY  = os.getenv('ADA_KEY')
SERVER_HOST = os.getenv('SERVER_HOST')
SERVER_PORT = os.getenv('SERVER_PORT')
# AI_SERVER_HOST = os.getenv('AI_SERVER_HOST')
# AI_SERVER_PORT = os.getenv('AI_SERVER_PORT')
SECRET_KEY = os.getenv('SECRET_KEY')