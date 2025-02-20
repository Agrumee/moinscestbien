# MoinsC-estBien

## Requirements
- PostGreSQL 16.3
- Python 3.12
- Django 5.0.6

## Installation

### Initialisation
- Clone the project from Github
- Go to backend/moincestbien : ```cd backend/moinscestbien```
- Create a virtual environment on your machine : ```python -3.12 -m venv venv```
- Activate the virtual env : ```source venv/bin/activate```
- Install the librairies : ```pip install -r requirements.txt```
- Create a .env file by duplicating .env.example
- Create a database with postgre SQL
- Update your .env file with your database informations

### Launch application
- Execute ```python manage.py migrate```
- Execute ```python manage.py runserver```

### Docker 
- Build ```docker-compose up --build```
- Run ```docker-compose up```
- Run Tests ```docker-compose exec backend pytest --cov=.```
- Populate local DB ```docker-compose exec backend python manage.py populate_users 10```
- Reset local DB ```docker-compose exec backend python manage.py reset_db```