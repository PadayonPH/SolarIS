sudo mkdir -p /var/log/solarApi
sudo chmod -R 777 /var/log/solarApi
python manage.py collectstatic --settings=config.settings
uwsgi --ini solarApi.ini && echo "started: solar api"
