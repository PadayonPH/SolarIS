from django.contrib import admin
from computeApp import models


class DevicesAdmin(admin.ModelAdmin):
    list_display = ['id', 'package_name']


admin.site.register(models.Devices, DevicesAdmin)
