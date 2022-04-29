# Seckill

A seckill in e-commerce platform is a scenario where rush buying occurs due to the discount of the product. The most significant characteristic of the seckill is high concurrency because there are a huge amount (hundreds or thousands more than the available number in stock) of customers who want to buy the product in the first few seconds of the seckill event. To increase the availability of the server, most of the requests should not hit the database. Kafka (decoupling between API request and database response using message queue) and Redis (high speed in-memory cache) are used to achieve this goal.

## Tech stack
- Redis: store the counter of the available quantity of the product, and a set including the user_id of customers who successfully bought the product. To avoid overselling, API requests will not pass the check if the counter falls below 0 given that the counter is initially set to the available quantity. 
- Kafka: enqueue the successful order that passed the counter check in Redis.
- Django: backend framework to provide seckill service.
- Postgres: Two tables in the database: table seckill_product to store the quantity of the product, and table seckill_order to store orders successfully placed.
- ReactJS: frontend library for UI.
- Docker: Containerize all the services.
- JMeter: pressure test. Simulate high concurrency scenario.

## How to use it

1. install docker and docker-compose
2. `docker-compose up -d`
3. visit http://localhost:3000/ and set the product id and the quantity of that product (say 100)
4. use JMeter to simulate high concurrency ot post requests (say 10000 thread in 5 seconds)
5. check the orders placed in the http://localhost:3000/order/product_id (should be 100)
