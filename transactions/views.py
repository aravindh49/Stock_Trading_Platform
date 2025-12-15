from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Transaction
from .serializers import TransactionSerializer, TradeSerializer
from stocks.models import Stock, Portfolio

class BuyStockView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = TradeSerializer(data=request.data)
        if serializer.is_valid():
            stock_symbol = serializer.validated_data['stock_symbol']
            quantity = serializer.validated_data['quantity']
            user = request.user

            stock = get_object_or_404(Stock, symbol=stock_symbol)
            total_cost = stock.current_price * quantity

            if user.wallet_balance < total_cost:
                return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                with transaction.atomic():
                    # Deduct balance
                    user.wallet_balance -= total_cost
                    user.save()

                    # Update Portfolio
                    portfolio, created = Portfolio.objects.get_or_create(user=user, stock=stock, defaults={'average_price': 0})
                    
                    # Calculate new average price
                    total_value = (portfolio.quantity * portfolio.average_price) + total_cost
                    new_quantity = portfolio.quantity + quantity
                    portfolio.average_price = total_value / new_quantity
                    portfolio.quantity = new_quantity
                    portfolio.save()

                    # Create Transaction
                    Transaction.objects.create(
                        user=user,
                        stock=stock,
                        transaction_type='BUY',
                        quantity=quantity,
                        price=stock.current_price
                    )

                return Response({
                    "status": "success",
                    "message": "Stock purchased successfully",
                    "updated_balance": user.wallet_balance
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellStockView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = TradeSerializer(data=request.data)
        if serializer.is_valid():
            stock_symbol = serializer.validated_data['stock_symbol']
            quantity = serializer.validated_data['quantity']
            user = request.user

            stock = get_object_or_404(Stock, symbol=stock_symbol)

            try:
                portfolio = Portfolio.objects.get(user=user, stock=stock)
            except Portfolio.DoesNotExist:
                return Response({"error": "You do not own this stock"}, status=status.HTTP_400_BAD_REQUEST)

            if portfolio.quantity < quantity:
                return Response({"error": "Insufficient stock quantity"}, status=status.HTTP_400_BAD_REQUEST)

            total_credit = stock.current_price * quantity

            try:
                with transaction.atomic():
                    # Credit balance
                    user.wallet_balance += total_credit
                    user.save()

                    # Update Portfolio
                    portfolio.quantity -= quantity
                    if portfolio.quantity == 0:
                        portfolio.delete()
                    else:
                        portfolio.save()

                    # Create Transaction
                    Transaction.objects.create(
                        user=user,
                        stock=stock,
                        transaction_type='SELL',
                        quantity=quantity,
                        price=stock.current_price
                    )

                return Response({
                    "status": "success",
                    "message": "Stock sold successfully",
                    "updated_balance": user.wallet_balance
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-timestamp')
