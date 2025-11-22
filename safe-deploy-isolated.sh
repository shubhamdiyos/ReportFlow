#!/bin/bash

# SAFE DEPLOYMENT - Complete Isolation for ReportFlow
# This script ensures existing projects are NOT affected

set -e

echo "🛡️ SAFE DEPLOYMENT - ReportFlow Isolated Setup"
echo "⚠️  This will NOT affect existing projects"

# Configuration with ISOLATED ports
REPORTFLOW_POSTGRES_PORT=5434  # Different from existing
REPORTFLOW_APP_PORT=8082      # Different from existing  
REPORTFLOW_NGINX_PORT=8083    # Different from existing

echo "📋 Using ISOLATED ports:"
echo "   PostgreSQL: $REPORTFLOW_POSTGRES_PORT"
echo "   Backend: $REPORTFLOW_APP_PORT"  
echo "   Nginx: $REPORTFLOW_NGINX_PORT"

# Create isolated directory
mkdir -p ~/reportflow-isolated
cd ~/reportflow-isolated

# Stop any ReportFlow containers (NOT other projects)
echo "🛑 Stopping only ReportFlow containers..."
docker stop reportflow-postgres reportflow-backend reportflow-nginx 2>/dev/null || true
docker rm reportflow-postgres reportflow-backend reportflow-nginx 2>/dev/null || true

# Create isolated docker-compose
cat > docker-compose-isolated.yml << EOF
version: '3.8'

services:
  # ReportFlow PostgreSQL (ISOLATED)
  reportflow-postgres:
    image: postgres:15-alpine
    container_name: reportflow-postgres
    environment:
      POSTGRES_DB: reportflow
      POSTGRES_USER: reportflow_user
      POSTGRES_PASSWORD: reportflow_password
    ports:
      - "$REPORTFLOW_POSTGRES_PORT:5432"  # ISOLATED PORT
    volumes:
      - reportflow_isolated_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - reportflow-isolated-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U reportflow_user -d reportflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ReportFlow Backend (ISOLATED)
  reportflow-backend:
    image: eclipse-temurin:17-jre-alpine
    container_name: reportflow-backend
    working_dir: /app
    command: ["java", "-jar", "reportflow-backend-1.0.0.jar"]
    environment:
      - SPRING_PROFILES_ACTIVE=aws
      - DATABASE_URL=jdbc:postgresql://reportflow-postgres:5432/reportflow
      - DB_USERNAME=reportflow_user
      - DB_PASSWORD=reportflow_password
      - JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==
      - AWS_BACKEND_URL=http://13.232.117.123:$REPORTFLOW_APP_PORT
      - GITHUB_CLIENT_ID=test_client_id
      - GITHUB_CLIENT_SECRET=test_client_secret
      - FRONTEND_URL=http://13.232.117.123:$REPORTFLOW_NGINX_PORT
    ports:
      - "$REPORTFLOW_APP_PORT:8080"  # ISOLATED PORT
    volumes:
      - ./reportflow-backend-1.0.0.jar:/app/reportflow-backend-1.0.0.jar
    depends_on:
      reportflow-postgres:
        condition: service_healthy
    networks:
      - reportflow-isolated-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  reportflow_isolated_data:

networks:
  reportflow-isolated-network:
    driver: bridge
EOF

# Create init.sql
cat > init.sql << 'EOF'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;
EOF

echo "🐳 Starting ReportFlow in ISOLATED mode..."
docker-compose -f docker-compose-isolated.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "📊 Service Status:"
docker-compose -f docker-compose-isolated.yml ps

echo ""
echo "✅ ReportFlow deployed SAFELY!"
echo ""
echo "🌐 ISOLATED URLs (won't affect existing projects):"
echo "   PostgreSQL: localhost:$REPORTFLOW_POSTGRES_PORT"
echo "   Backend: http://13.232.117.123:$REPORTFLOW_APP_PORT"
echo "   Health: http://13.232.117.123:$REPORTFLOW_APP_PORT/actuator/health"
echo ""
echo "🔧 Management:"
echo "   Stop: docker-compose -f docker-compose-isolated.yml down"
echo "   Logs: docker-compose -f docker-compose-isolated.yml logs -f"
echo ""
echo "⚠️  Existing projects are NOT affected!"
