from django.contrib import admin
from .models import Club, Court, Booking, Profile

admin.site.register(Club)
admin.site.register(Court)
admin.site.register(Booking)
admin.site.register(Profile)