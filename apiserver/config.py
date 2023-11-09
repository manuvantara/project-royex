import os
import dotenv

dotenv.load_dotenv()

value = os.getenv("DATABASE_URL")

if value is None:
    raise Exception("DATABASE_URL NOT PROVIDED")

DATABASE_URL = value

value = os.getenv("AURORA_ENDPOINT")

if value is None:
    raise Exception("AURORA_ENDPOINT NOT PROVIDED")

AURORA_ENDPOINT = value
