from django.core.management.base import BaseCommand
from stocks.models import Stock

class Command(BaseCommand):
    help = 'Seeds the database with initial stock data'

    def handle(self, *args, **kwargs):
        stocks = [
            { "symbol": "TCS", "name": "Tata Consultancy Services", "price": 3500 },
            { "symbol": "INFY", "name": "Infosys", "price": 1450 },
            { "symbol": "RELIANCE", "name": "Reliance Industries", "price": 2600 },
            { "symbol": "AAPL", "name": "Apple Inc.", "price": 15000 },
            { "symbol": "TSLA", "name": "Tesla Inc.", "price": 18000 },
            { "symbol": "GOOGL", "name": "Alphabet Inc.", "price": 11000 },
            { "symbol": "AMZN", "name": "Amazon.com Inc.", "price": 12000 }
        ]

        for stock_data in stocks:
            stock, created = Stock.objects.update_or_create(
                symbol=stock_data['symbol'],
                defaults={
                    'name': stock_data['name'],
                    'current_price': stock_data['price']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created stock {stock.symbol}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Successfully updated stock {stock.symbol}'))
