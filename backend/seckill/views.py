from django.http import JsonResponse
import redis
from kafka import KafkaProducer
from django.views.decorators.csrf import csrf_exempt
import json
import uuid
from .models import Product, Order
import os

REDIS_HOST = os.getenv("REDIS_HOST", default="localhost")
KAFKA_HOST = os.getenv("KAFKA_HOST", default="localhost")


@csrf_exempt
def detail(request, product_id):
    r = redis.Redis(host=REDIS_HOST, port=6379, db=0)
    counter_product_key = f"counter:product:{product_id}"
    user_product_key = f"users:product:{product_id}"
    count = r.get(counter_product_key)

    if request.method == "GET":
        if not count:
            # quantity with -1 means the seckill has not yet started
            return JsonResponse({"quantity": "-1"})
        else:
            return JsonResponse({"quantity": count.decode()})
    elif request.method == "POST":
        # check if request comes from login user
        body = json.loads(request.body)
        user_id = body.get("user", "")
        if user_id == "":
            return JsonResponse(
                {"message": "You need to provide a user id", "status": False}
            )
        # check if the user already took the offer
        if r.sismember(user_product_key, user_id):
            return JsonResponse(
                {"message": "You already took the offer!", "status": False}
            )

        # check if there is stock available
        left_count = r.decr(counter_product_key)
        if left_count < 0:
            return JsonResponse(
                {"message": "Sorry, no stock available", "status": False}
            )

        r.sadd(user_product_key, user_id)
        order_id = str(uuid.uuid1())
        order_info = {
            "order_id": order_id,
            "product_id": str(product_id),
            "user_id": user_id,
        }
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_HOST,
            value_serializer=lambda m: json.dumps(m).encode("ascii"),
        )
        topic = "seckill_order"
        producer.send(topic, order_info)

        return JsonResponse(
            {"message": "Congratulations, you got the offer!", "status": True}
        )


def products(request):
    return JsonResponse({"data": list(Product.objects.values())})


def order_detail(request, product_id):
    return JsonResponse(
        {"data": list(Order.objects.filter(product_id__exact=str(product_id)).values())}
    )

@csrf_exempt
def reset(request):
    if request.method == "POST":
        Product.objects.all().delete()
        Order.objects.all().delete()
        r = redis.Redis(host=REDIS_HOST, port=6379, db=0)
        r.flushall()
        return JsonResponse({"status": True, "message":"database reset"})

@csrf_exempt
def product_detail(request, product_id):
    # POST to update database and redis cache
    if request.method == "POST":
        body = json.loads(request.body)
        quantity = body.get("quantity", "")
        if quantity == "" or quantity < 0:
            return JsonResponse(
                {
                    "message": "You need to provide quantity",
                    "status": False,
                    "data": None,
                }
            )

        product = Product(product_id=str(product_id), quantity=quantity)
        product.save()
        r = redis.Redis(host=REDIS_HOST, port=6379, db=0)

        counter_product_key = f"counter:product:{product_id}"
        user_product_key = f"users:product:{product_id}"
        r.set(counter_product_key, quantity)
        r.delete(user_product_key)
        return JsonResponse(
            {
                "message": "OK",
                "status": True,
                "data": {"product_id": str(product_id), "quantity": quantity},
            }
        )
