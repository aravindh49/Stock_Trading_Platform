from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=50000.00)

    def __str__(self):
        return self.username
