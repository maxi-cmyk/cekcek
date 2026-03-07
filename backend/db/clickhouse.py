import clickhouse_connect
from functools import lru_cache
from config import settings

@lru_cache(maxsize=1)
def get_client():
    return clickhouse_connect.get_client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
        username=settings.clickhouse_user,
        password=settings.clickhouse_password,
        database=settings.clickhouse_database,
        secure=True  # required for ClickHouse Cloud
    )

def query(sql: str, params: dict = None):
    client = get_client()
    result = client.query(sql, parameters=params)
    return result.named_results()  # returns list of dicts

if __name__ == "__main__":
    client = get_client()
    result = client.query("SELECT 1")
    print("ClickHouse connected:", result.result_rows)
