from django.contrib import admin
from .models import Stock, Portfolio

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'name', 'current_price', 'updated_at')
    search_fields = ('symbol', 'name')

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'stock', 'quantity', 'average_price')
    list_filter = ('user',)
