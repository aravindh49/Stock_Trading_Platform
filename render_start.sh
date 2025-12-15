#!/bin/bash
set -e

echo "Applying database migrations..."
python manage.py migrate

echo "Seeding initial stock data..."
python manage.py seed_stocks

echo "Creating superuser 'admin' if not exists..."
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin')"

echo "Starting Gunicorn..."
gunicorn stock_platform.wsgi:application
