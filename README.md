## Event Calendar

A web app implementation of event calendar app.

### Features:
- Frontend written in Reactjs (Vite) compatible with a Django-based REST API
- Basic user authentication with JWT
- Create/Edit/Delete events with details (Title, Description, Start/End Time)
- Intuitive UI with shadcn/ui
- Calendar toggles between Monthly/Weekly views
- Events stored in self-contained cross-platform SQLite database
- Privacy focused: no event data leaks!

## Dev

- Clone this project to your local machine using `git`

  ```bash
  git clone https://github.com/SamIsTheFBI/event-calendar-assignment/
  cd event-calendar-assignment
  ```
- Use your favorite Python package manager to start a new environment install the required packages for backend:
  
  ```bash
  uv venv
  source .venv/bin/activate # For Linux machines
  uv pip install -r requirements.txt
  ```
- Start the Django backend:

  ```bash
  cd django-backend
  python manage.py migrate events
  python manage.py migrate
  python manage.py runserver
  ```
- In a new terminal instance, make a `.env` file as per given template & use your Javascript runtime to run the frontend (requires Nodejs 18+):

  ```bash
  cd - # go to root directory
  echo "VITE_BACKEND_HOST_URL=http://127.0.0.1:8000" > .env
  bun install
  bun dev
  ```
