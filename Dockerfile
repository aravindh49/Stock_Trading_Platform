FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
# Create requirements.txt first or just install manually in docker if not present
# But better to create it.
# For now, I'll use a direct pip install command in Dockerfile or copy .
# Let's assume I will create requirements.txt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
RUN pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary gunicorn

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "stock_platform.wsgi:application"]
