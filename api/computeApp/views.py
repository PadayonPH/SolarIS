from rest_framework.views import APIView
from rest_framework import response

import numpy as np
import os
import operator
import json


class ComputePower(APIView):

    def get(self, request, format=None):
        try:
            footprint = json.loads(request.data['house_footprint'])
            power_value = extract_area_power(footprint)
            message = {'details': 'has input footprint', "data": power_value }
        except Exception:
            footprint = {}
            footprint['features'] = []
            footprint['features'].append({})
            footprint['features'][0]['geometry'] = []
            message = {'details': 'no input footprint'}

        return response.Response(message)


def extract_area_power(footprint):
    RAS_DIR = "data/NCR_GHI_ANN_10_X.tif"
    na = np.array(footprint['features'][0]['geometry']['coordinates'])

    latlon=[]
    pixel_value=[]
    for i in range((len(na[0,:]))-1):
        latlon.append(na[0][i])

    x=[p[0] for p in latlon]
    y=[p[1] for p in latlon]
    centroid = [(sum(x) / len(latlon)),(sum(y) / len(latlon))]
    latlon.append(centroid)

    for j in range(len(latlon)):
        pixel_value.append(float(os.popen("gdallocationinfo -valonly -wgs84  {}  {} {}".format(RAS_DIR, latlon[j][0], latlon[j][1])).read().replace('\n','')))

    return (sum(pixel_value)/len(pixel_value))
