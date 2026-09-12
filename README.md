# Movie Tracker

Movie Tracker is a full-stack web application designed for searching movies and writing reviews. It integrates with the TMDB (The Movie Database) API to fetch movie data and utilizes a caching layer to optimize external API request limits and response times.

## Architecture and Technology Stack

### Frontend
- **Framework:** React 19 and TypeScript (built with Vite)
- **State Management and Data Fetching:** TanStack Query v5
- **Component Library:** Material UI v9 and Emotion
- **Routing:** React Router v7
- **HTTP Client:** Axios

### Backend
- **Framework:** .NET 9 ASP.NET Core Web API
- **ORM:** Entity Framework Core 9
- **Authentication:** ASP.NET Core Identity
- **API Documentation:** OpenAPI / Swagger

### Infrastructure and Cloud
- **Database:** PostgreSQL
- **Distributed Cache:** Redis

## Key Features

- **Authentication and Security:** User registration and authentication managed by ASP.NET Core Identity. Configured with specific password policies and endpoint rate limiting.
- **Search Capabilities:** Movie search functionality powered by the TMDB API, featuring infinite scroll pagination.
- **Watchlist and Reviews:** Authorized users can add movies to their personal library, submit a numerical rating and attach text reviews.

## Architectural Decisions

- **TanStack Query Implementation:** Chosen to handle asynchronous state management. It automates client-side caching, background refetching, and stale-time invalidation, replacing complex global state boilerplate.
- **Redis Integration:** Implemented to mitigate TMDB API rate limits. By caching frequent queries (e.g., Popular Movies, Search Results) in a Redis instance, the system reduces external API dependencies and improves response latency.
- **.NET 9 Identity API:** Utilized the built-in `MapIdentityApi` endpoints to handle JWT generation and user validation natively, eliminating the need to maintain custom authentication middleware.

## Local Development Setup

### Prerequisites
- .NET 9.0 SDK
- Node.js
- PostgreSQL instance
- Redis instance
- TMDB API Key

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend/MovieTracker.Api
   ```
2. Configure your connection strings and TMDB key in `appsettings.json` or via .NET User Secrets:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=MovieTracker;Username=postgres;Password=yourpassword",
       "Redis": "localhost:6379"
     },
     "Tmdb": {
       "ApiKey": "YOUR_TMDB_API_KEY"
     }
   }
   ```
3. Apply Entity Framework migrations:
   ```bash
   dotnet ef database update
   ```
4. Start the application:
   ```bash
   dotnet run
   ```

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create a `.env.local` file in the root of the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5185/api
   ```
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

## License
This project is licensed under the MIT License.