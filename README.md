# MoinsC-estBien

## Requirements
To run the project locally, you'll only need Docker Desktop. Docker will handle all dependencies, including the database and Python environment.

## Getting Started

Follow these steps to get the application running on your local machine with Docker.

- Clone the repository via SSH from Github 
Tip: To clone using SSH, you need to configure your SSH key. If you don't have one set up yet, follow this guide: [How to create and add an SSH key to your GitHub account.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

- Install Docker Desktop
- Update your .env file 
- Build and start the application with Docker: ```docker-compose up --build```
- Once the containers are built and running, the backend application will be accessible at http://127.0.0.1:5174/


## Additional Setup
### Visualize the Database (Optional)
- Install PgAdmin (or any PostgreSQL client) to visualize and manage the PostgreSQL database running inside the Docker container. 
- After installing PgAdmin, connect to the database using the following credentials (configured in the .env file):
    - Host: localhost
    - Port: 5432
    - Username: your_db_user
    - Password: your_db_password
    - Database: your_db_name

### IDE and Linter Configuration
We recommend using PyCharm or VSCode for development.

Additionally, we recommend setting up the following linters:
- Black for Python: To automatically format Python code, install Black and configure your IDE to run it on file save.
- ESLint for JavaScript, JSX, TypeScript, and TSX files: Install ESLint and configure it in your editor.

### Setup Database Migrations
- To create migrations: ```docker-compose exec backend python manage.py makemigrations```
- To apply the migrations to the database: ```docker-compose exec backend python manage.py migrate```

### Running Tests 
- To run tests inside the Docker container, use the following command: ```docker-compose exec backend pytest --cov=.```

### Populate Database 
- To populate the local database with test users, use: ```docker-compose exec backend python manage.py populate_users 10```

### Reset Local Database 
- To reset the local database, use: ```docker-compose exec backend python manage.py reset_db```