from django.conf.urls import url
from rest_framework import routers
from computeApp import views

urlpatterns = [
    url(r'^compute/$', views.ComputePower.as_view()),

]

router = routers.SimpleRouter()
router.register(r'devices', views.DevicesViewSet, base_name='devices')
urlpatterns += router.urls
