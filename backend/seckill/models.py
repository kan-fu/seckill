from django.db import models
import uuid

# Create your models here.


class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_timestamp = models.DateTimeField()
    user_id = models.CharField(max_length=20)
    product_id = models.CharField(max_length=20)

    def __str__(self):
        return f"user {self.user_id} - product {self.product_id}"


class Product(models.Model):
    product_id = models.CharField(primary_key=True, max_length=20)
    quantity = models.IntegerField()

    def __str__(self):
        return f"product {self.product_id} - quantity {self.quantity}"
