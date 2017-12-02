from serializers import serializers

from .models import Devices


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = "__all__"
