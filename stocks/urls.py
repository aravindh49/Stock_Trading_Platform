from django.urls import path
from .views import StockListView, PortfolioListView

urlpatterns = [
    path('stocks/', StockListView.as_view(), name='stock_list'),
    path('portfolio/', PortfolioListView.as_view(), name='portfolio_list'),
]
