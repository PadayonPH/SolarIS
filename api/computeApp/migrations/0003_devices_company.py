# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-02 09:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('computeApp', '0002_auto_20171202_0451'),
    ]

    operations = [
        migrations.AddField(
            model_name='devices',
            name='company',
            field=models.CharField(default='', max_length=255),
        ),
    ]