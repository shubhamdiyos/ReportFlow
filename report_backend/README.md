# ReportFlow Backend

A comprehensive GitHub reporting and analytics backend API built with Spring Boot.

## Features

- **GitHub OAuth Integration** - Secure authentication via GitHub
- **Multi-tenant Architecture** - Support for multiple organizations
- **Role-based Access Control** - Admin, Manager, and Developer roles
- **Repository Management** - Track and sync GitHub repositories
- **Analytics & KPIs** - Real-time metrics and reporting
- **RESTful APIs** - Clean, well-documented endpoints

## Tech Stack

- **Spring Boot 3.2.0** - Main framework
- **PostgreSQL** - Primary database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **JPA/Hibernate** - ORM
- **GitHub API** - Repository data integration

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher
- GitHub OAuth App (for authentication)

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE reportflow;
CREATE USER reportflow_user WITH PASSWORD 'reportflow_password';
GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;
```

### 2. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Application name: `ReportFlow`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8080/api/auth/github/callback`
3. Note down the Client ID and Client Secret

### 3. Environment Configuration

Set the following environment variables:

```bash
export GITHUB_CLIENT_ID=your_github_client_id
export GITHUB_CLIENT_SECRET=your_github_client_secret
```

Or update `application.properties`:

```properties
spring.security.oauth2.client.registration.github.client-id=your_github_client_id
spring.security.oauth2.client.registration.github.client-secret=your_github_client_secret
```

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `GET /api/auth/github/url` - Get GitHub OAuth URL
- `POST /api/auth/github/callback` - Handle GitHub OAuth callback
- `GET /api/auth/health` - Health check

### Users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user (Admin only)

### Organizations
- `GET /api/organizations/user/{userId}` - Get user's organizations
- `POST /api/organizations/{id}/switch` - Switch tenant context
- `GET /api/organizations/{id}` - Get organization details

### Repositories
- `GET /api/repositories` - List repositories with filters
- `POST /api/repositories` - Add new repository
- `POST /api/repositories/{id}/sync` - Sync repository data
- `PATCH /api/repositories/{id}/toggle` - Toggle repository inclusion

### Analytics
- `GET /api/analytics/kpis` - Get KPI metrics
- `GET /api/analytics/charts/{type}` - Get chart data

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Role-based Access

- **ADMIN** - Full system access, user management
- **MANAGER** - Team management, repository operations, reports
- **DEVELOPER** - Individual metrics, limited access

## Frontend Integration

The backend is designed to work with the existing React frontend. Key integration points:

- **CORS enabled** for `localhost:3000` and `localhost:5173`
- **Response formats** match frontend expectations
- **Query patterns** align with TanStack Query usage
- **Error handling** provides meaningful HTTP status codes

## Development

### Project Structure

```
src/main/java/com/reportflow/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data transfer objects
├── entity/         # JPA entities
├── repository/     # JPA repositories
├── security/       # Security components
└── service/        # Business logic services
```

### Key Components

- **SecurityConfig** - Spring Security configuration
- **JwtUtil** - JWT token management
- **GitHubOAuthService** - GitHub integration
- **AnalyticsService** - KPI calculations
- **Multi-tenant support** - Organization-based data isolation

## Testing

Run tests with:

```bash
mvn test
```

## Production Deployment

1. Update `application.properties` for production environment
2. Set secure JWT secret key
3. Configure production database
4. Set up proper CORS origins
5. Enable HTTPS
6. Configure logging levels

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation as needed
4. Follow the established git commit format

## License

This project is licensed under the MIT License.
