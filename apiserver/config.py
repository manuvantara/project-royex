import os
import dotenv

dotenv.load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
AURORA_ENDPOINT = os.getenv("AURORA_TESTNET_ENDPOINT")
