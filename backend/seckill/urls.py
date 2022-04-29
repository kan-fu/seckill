from django.urls import path

from . import views

urlpatterns = [
    path('products/', views.products, name='products'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('<int:product_id>/', views.detail, name='detail'),
    path('order/<int:product_id>', views.order_detail, name='order_detail'),
    path('reset/', views.reset, name='reset'),
]