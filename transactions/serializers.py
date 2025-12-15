from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.ReadOnlyField(source='stock.symbol')

    class Meta:
        model = Transaction
        fields = ('id', 'stock', 'stock_symbol', 'transaction_type', 'quantity', 'price', 'timestamp')

class TradeSerializer(serializers.Serializer):
    stock_symbol = serializers.CharField(max_length=10)
    quantity = serializers.IntegerField(min_value=1)
