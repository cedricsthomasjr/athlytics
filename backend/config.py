import os

class Config:
    CACHE_TYPE = "filesystem"
    CACHE_DIR = os.path.join(os.getcwd(), "flask_cache")
    CACHE_DEFAULT_TIMEOUT = 86400  # 1 day
