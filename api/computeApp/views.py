from rest_framework.views import APIView
from rest_framework import response

import os
import operator


class ComputePower(APIView):

    def get(self, request, format=None):
        message = {}
        footprint = request.query_params.get('house_footprint', 0)
        return response.Response(message)


