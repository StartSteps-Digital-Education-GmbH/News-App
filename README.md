# News Aggregator Backend

This is the **backend** of the **Personalized News Aggregator App**, built using **TypeScript**, **Express.js**, and containerized with **Docker**. It provides REST APIs for fetching, managing, and interacting with news articles and user data.

---

## Features

- Modular architecture for scalability and maintainability.
- API endpoints for:
  - User authentication and management.
  - Fetching and storing news articles.
  - Bookmarking and commenting on articles.
- Validation with **JOI** for robust data handling.
- Unit and integration tests with **Jest**.
- Dockerized setup for easy deployment.

---

## Tech Stack

- **TypeScript**: Strongly typed programming for scalable backend development.
- **Express.js**: Lightweight and fast web framework for Node.js.
- **Docker**: Containerization for consistent environments.
- **JOI**: Schema-based data validation.
- **Jest**: Comprehensive testing framework for the backend.

---

## Prerequisites

Ensure the following are installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/news-aggregator-backend.git
cd news-aggregator-backend
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```plaintext
NODE_ENV=development
PORT=4000
NEWS_API_KEY=your_news_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

---

## Using Docker

This project includes a `Dockerfile` and `docker-compose.yml` for easy containerization.

### 1. Build and Run the Container
```bash
docker-compose up --build
```

### 2. Access the Application
- The backend will be accessible at `http://localhost:4000`.

### 3. Stop the Container
```bash
docker-compose down
```

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login with email and password.

### News
- **GET** `/api/news`: Fetch all news articles.
- **POST** `/api/news/bookmark`: Bookmark a news article.
- **POST** `/api/news/comment`: Add a comment to a news article.

### Users
- **GET** `/api/users/me`: Fetch user profile.
- **PUT** `/api/users/update`: Update user profile.

---

## Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Run Production Server**:
  ```bash
  npm start
  ```
- **Run Tests**:
  ```bash
  npm test
  ```
- **Lint and Fix Code**:
  ```bash
  npm run lint
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```

---

## Testing

Run tests with:
```bash
npm test
```
This project uses **Jest** for testing. Integration and unit tests are located in the `tests/` directory.

![Lint and Test](https://github.com/StartSteps-Digital-Education-GmbH/News-App/actions/workflows/backend-ci.yml/badge.svg)
![Docker Build](https://github.com//StartSteps-Digital-Education-GmbH/News-App/actions/workflows/backend-ci.yml/badge.svg)

---

## Contributing

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature-name"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request
