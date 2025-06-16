# Swachh Bandhu - Civic Reporting & Gamification Platform



**Swachh Bandhu** (meaning "Clean Friend" in Hindi) is a modern, full-stack web application designed to empower citizens to report civic issues (like garbage dumping, broken infrastructure) and gamify their contributions to create cleaner, more accountable communities. It provides a powerful dashboard for municipal authorities to track, manage, and resolve these issues efficiently.

This platform bridges the gap between citizens and local governance through technology, transparency, and engagement.

---

## ✨ Key Features

The platform is a feature-rich MVP with a robust and scalable architecture.

#### For Citizens:
- **📍 QR Code-Based Reporting:** Citizens can scan QR codes at specific public locations (parks, bus stands, public toilets) to instantly file a geo-tagged report.
- **📝 Multi-Step Reporting Flow:** A guided, user-friendly process to describe issues, set severity, and upload photo/video evidence.
- **🏆 Gamification & Rewards:**
    - Earn points for submitting valid reports and verifying others' reports.
    - Climb a global leaderboard and see your rank.
    - Earn badges and achievements for milestones.
    - Participate in lotteries sponsored by local businesses.
- **🔍 Peer Verification:** Help the community by verifying pending reports from other citizens, ensuring data accuracy and earning rewards.
- **📊 Personal Dashboard:** Track your points, rank, recent activity, and progress towards your next achievement badge.
- **🔔 Real-time Notifications:** Receive email updates on the status of your submitted reports.

#### For Municipalities & Admins:
- **🔐 Role-Based Access Control:** Different roles for Super Admins, Municipal Admins, and Moderators with specific permissions.
- **📈 Advanced Analytics Dashboard:** A powerful, real-time dashboard with key performance indicators (KPIs):
    - Total, pending, and resolved report counts.
    - Average issue resolution time.
    - Report trends over time (30-day view).
    - Heatmap of high-issue-density areas.
    - Breakdowns by issue category and severity.
- **📋 Report Management Queue:** A dedicated interface for admins to view, filter, and moderate incoming reports.
- **📝 Moderation Tools:** Update report statuses, add internal notes, and document actions taken.
- **🗺️ Location Management:** Admins can add, manage, and generate unique QR codes for public locations within their municipality.

---

## 🛠️ Tech Stack

This project is built with a modern, scalable, and professional technology stack.

- **Backend:**
    - **Framework:** **Django** & **Django Rest Framework (DRF)**
    - **Database:** **PostgreSQL** with **PostGIS** for geospatial data.
    - **Async Tasks:** **Celery** with **Redis** as the message broker for background tasks like sending emails and processing points.
    - **Authentication:** **Simple JWT** for secure, stateless token-based authentication.
    - **API Documentation:** **drf-spectacular** for generating OpenAPI 3.0 schemas.

- **Frontend:**
    - **Framework:** **React** (with Vite)
    - **Language:** **TypeScript**
    - **Routing:** **React Router v6**
    - **State Management:** **React Context API**
    - **Styling:** **Tailwind CSS**
    - **Animations:** **Framer Motion**
    - **API Communication:** **Axios** with interceptors for automatic token refresh.
    - **Mapping:** **React-Leaflet** for interactive maps.
    - **Charts & Data Viz:** **Recharts**

- **Deployment (Recommended):**
    - **Platform:** Docker, Azure, Vercel.
    - **Media Storage:** Azure Flexible PostgreSQL Server.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Git
- Python 3.9+
- Node.js 18+ & npm/yarn
- PostgreSQL 13+ with PostGIS extension enabled
- Redis Server

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/anurag6569201/Swachha-Bandhu.git
cd Swachha-Bandhu
```

### 2. Setup Backend
```bash
# Create and activate a venv
python -m venv venv
source venv/bin/activate 

# Get into backend directory
cd swachha_bandhu_backend

# Install Python dependencies
pip install -r requirements.txt
```
### 3. Setup GDAL and GEOS library
```bash
# install geospatial library
brew install gdal
brew install geos

# get the path from system put the path to .env
GDAL_LIBRARY_PATH = '/opt/homebrew/Cellar/gdal/3.11.0_2/lib/libgdal.dylib'
GEOS_LIBRARY_PATH = '/opt/homebrew/Cellar/geos/3.13.1/lib/libgeos_c.dylib'
```
### 4. Setup .env
#### Create a .env file ```touch .env```
```bash
SECRET_KEY='django-insecure-87v9x77w9&0e7lgrnc1^2t(bk1)72rv)vgeh*xjhb7iicpi2h9'
DEBUG=True
DATABASE_URL='postgres://postgre6569201:{password}@postgre6569201.postgres.database.azure.com:5432/development-bandhu?sslmode=require'
ALLOWED_HOSTS='127.0.0.1,localhost'

CORS_ALLOWED_ORIGINS='http://localhost:5173,http://127.0.0.1:5173'

ACCESS_TOKEN_LIFETIME=15
REFRESH_TOKEN_LIFETIME=7

FRONTEND_URL='http://localhost:5173'
PASSWORD_RESET_TIMEOUT_HOURS=1
EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL='anurag6569201@gmail.com'

MAX_VERIFICATION_DISTANCE_METERS=50
MIN_DISTANCE_BETWEEN_REPORTS_METERS=10
GOOGLE_MAPS_API_KEY="sdfsdf"

POINTS_FOR_INITIAL_REPORT=10
POINTS_FOR_PEER_VERIFICATION=5
PENALTY_FOR_FAKE_REPORT=-50

CELERY_BROKER_URL='redis://localhost:6379/0'
CELERY_RESULT_BACKEND='redis://localhost:6379/0'

GDAL_LIBRARY_PATH = '/opt/homebrew/Cellar/gdal/3.11.0_2/lib/libgdal.dylib'
GEOS_LIBRARY_PATH = '/opt/homebrew/Cellar/geos/3.13.1/lib/libgeos_c.dylib'
```

### 5. Run Backend
```bash
# Generate new migration files
python manage.py makemigrations

# Apply migrations to the database
python manage.py migrate

# Create a superuser to access the admin panel
python manage.py createsuperuser

# Start the Django development server (8000 port)
python manage.py runserver
```

### 6. Run the Celery worker
#### Open a new terminal, activate the virtual environment, and run:
```bash
celery -A swachh_bandhu_backend worker -l info
```

### 7. Frontend Setup
```bash
# Navigate to the frontend
cd swachhabandhu

# Install Node.js dependencies
npm install

# Create a .env file for frontend environment variables
touch .env

# Add this variable in env file
REACT_APP_API_URL=http://localhost:8000/api/auth

# Start the React development server
npm run dev
```

## Your application should now be running!
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/
control-panel/
- Celery: redis://localhost:6379/0

##  API Documentation
The API is documented using the OpenAPI 3.0 standard. Once the backend server is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/api/v1/schema/swagger-ui/
- ReDoc: http://localhost:8000/api/v1/schema/redoc/

These interfaces provide detailed information about all available endpoints, their required parameters, and expected responses.

## Contributing
We welcome contributions to make Swachh Bandhu even better! Please feel free to fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.
