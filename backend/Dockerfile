FROM python:3.12
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
RUN pip install --upgrade pip
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
EXPOSE 8002
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8002