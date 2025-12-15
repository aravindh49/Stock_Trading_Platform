from rest_framework import serializers
from .models import Stock, Portfolio

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class PortfolioSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.ReadOnlyField(source='stock.symbol')
    stock_name = serializers.ReadOnlyField(source='stock.name')
    current_price = serializers.ReadOnlyField(source='stock.current_price')

    class Meta:
        model = Portfolio
        fields = ('id', 'stock', 'stock_symbol', 'stock_name', 'current_price', 'quantity', 'average_price')
