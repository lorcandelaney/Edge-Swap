FROM python:2.7-slim

RUN apt-get update \
    && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app/django_cache
RUN mkdir -p /usr/src/app/logs
RUN mkdir -p /usr/src/app/versatileimagefield_cache
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
# RUN pip install --upgrade pip
COPY . .

EXPOSE 8000
CMD ["bash","start-django.sh"]
