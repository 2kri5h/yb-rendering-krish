from django.db import models

# Create your models here.
class idData(models.Model):
    yearbookId=models.CharField(default="", max_length=10)
    otherSelectedPeople=models.JSONField(default=list, blank=True)