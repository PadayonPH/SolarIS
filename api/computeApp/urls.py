from django.conf.urls import url
from computeApp import views


urlpatterns = [
    url(r'^compute/$', views.ComputePower.as_view()),
]
