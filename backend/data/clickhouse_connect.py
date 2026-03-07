import clickhouse_connect

if __name__ == '__main__':
    client = clickhouse_connect.get_client(
        host='oi1wtoefnd.ap-southeast-1.aws.clickhouse.cloud',
        user='default',
        password='<password>',
        secure=True
    )
    print("Result:", client.query("SELECT 1").result_set[0][0])