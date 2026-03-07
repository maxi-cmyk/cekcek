from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    clickhouse_host: str
    clickhouse_port: int = 8443
    clickhouse_user: str = "default"
    clickhouse_password: str
    clickhouse_database: str = "cekcek"
    
    openai_api_key: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
