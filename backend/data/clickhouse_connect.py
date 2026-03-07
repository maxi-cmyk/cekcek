import clickhouse_connect
import os
from dotenv import load_dotenv

if __name__ == '__main__':
    # Load environment variables from the .env file in the root
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
    load_dotenv(env_path)

    client = clickhouse_connect.get_client(
        host=os.getenv('CLICKHOUSE_HOST'),
        port=int(os.getenv('CLICKHOUSE_PORT', 8443)),
        username=os.getenv('CLICKHOUSE_USER', 'default'),
        password=os.getenv('CLICKHOUSE_PASSWORD'),
        secure=True
    )
    print("Result:", client.query("SELECT 1").result_set[0][0])