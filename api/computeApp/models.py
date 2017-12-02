from django.db import models
import uuid


class Devices(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package_name = models.CharField(max_length=255, default="")
    efficiency = models.FloatField(null=True)
    length = models.FloatField(null=True)
    width = models.FloatField(null=True)
    height = models.FloatField(null=True)
    rated_power = models.FloatField(null=True)
    price = models.FloatField(null=True)
    website = models.TextField(null=True)
    remarks = models.TextField(null=True)
    company = models.CharField(max_length=255, default="")

    def __str__(self):
        return str(self.id)
