from kafka import KafkaConsumer
from datetime import datetime
import json
import psycopg2
import os

KAFKA_HOST = os.getenv("KAFKA_HOST", default="localhost")
POSTGRE_NAME = os.getenv("POSTGRES_NAME", default="seckill")
POSTGRE_USER = os.getenv("POSTGRES_USER", default="postgres")
POSTGRE_PASSWORD = os.getenv("POSTGRES_PASSWORD", default="example")
POSTGRE_HOST = os.getenv("POSTGRES_HOST", default="localhost")
topic = "seckill_order"

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=KAFKA_HOST,
    value_deserializer=lambda m: json.loads(m.decode("ascii")),
)


def insert_order(*params):
    SQL = f"INSERT INTO seckill_order (order_id, order_timestamp, user_id, product_id) VALUES (%s, %s, %s, %s)"
    with psycopg2.connect(
        dbname=POSTGRE_NAME, user=POSTGRE_USER, password=POSTGRE_PASSWORD , host=POSTGRE_HOST
    ) as conn:
        with conn.cursor() as curs:
            curs.execute(SQL, params)


def decr_product_quantity(product_id):
    SQL = f"UPDATE seckill_product SET quantity = quantity - 1 WHERE product_id = %s"
    with psycopg2.connect(
        dbname=POSTGRE_NAME,
        user=POSTGRE_USER,
        password=POSTGRE_PASSWORD,
        host=POSTGRE_HOST,
    ) as conn:
        with conn.cursor() as curs:
            curs.execute(SQL, (product_id,))


for msg in consumer:
    order_timestamp = datetime.fromtimestamp(msg.timestamp / 1000)
    order_id = msg.value["order_id"]
    user_id = msg.value["user_id"]
    product_id = msg.value["product_id"]
    print(msg)
    insert_order(order_id, order_timestamp, user_id, product_id)
    decr_product_quantity(product_id)
