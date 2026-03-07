import clickhouse_connect
from functools import lru_cache
from config import settings

@lru_cache(maxsize=1)
def get_client():
    print(f"[clickhouse] connecting to database: {settings.clickhouse_database}")
    return clickhouse_connect.get_client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
        username=settings.clickhouse_user,
        password=settings.clickhouse_password,
        database=settings.clickhouse_database,
        secure=True,
        connect_timeout=30
    )

def query(sql: str, params: dict = None):
    client = get_client()
    result = client.query(sql, parameters=params)
    return result.named_results()  # returns list of dicts

if __name__ == "__main__":
    print(f"settings.clickhouse_database = {settings.clickhouse_database}")
    client = get_client()
    result = client.query("SELECT currentDatabase()")
    print("Active database:", result.result_rows)
    result = client.query("SELECT count() FROM CekCek.consumption")
    print("CekCek.consumption rows:", result.result_rows[0][0])
