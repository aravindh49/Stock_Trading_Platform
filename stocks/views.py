from rest_framework import generics, permissions
from .models import Stock, Portfolio
from .serializers import StockSerializer, PortfolioSerializer

class StockListView(generics.ListAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = (permissions.IsAuthenticated,)

class PortfolioListView(generics.ListAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
