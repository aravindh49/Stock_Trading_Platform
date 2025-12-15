from django.urls import path
from .views import BuyStockView, SellStockView, TransactionHistoryView

urlpatterns = [
    path('trade/buy/', BuyStockView.as_view(), name='buy_stock'),
    path('trade/sell/', SellStockView.as_view(), name='sell_stock'),
    path('transactions/', TransactionHistoryView.as_view(), name='transaction_history'),
]
