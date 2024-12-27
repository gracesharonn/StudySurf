from dotenv import load_dotenv
import os
load_dotenv()

SERVER_URL = '127.0.0.1'
PORT = '8900'
ENV = 'dev'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
OPEN_AI_KEY = os.getenv('OPEN_AI_KEY')