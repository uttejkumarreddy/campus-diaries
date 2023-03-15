from django.db import models
from CollegeAdministration.apps.core.models import TimestampedModel

class Student(TimestampedModel):
    first_name = models.CharField(max_length=40, )
    middle_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    full_name = models.CharField(max_length=255)