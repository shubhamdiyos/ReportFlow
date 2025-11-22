#!/bin/bash

# Update ReportFlow Application Configuration for Docker PostgreSQL
# Run this script on your EC2 instance after setting up PostgreSQL

set -e

echo "🔧 Updating ReportFlow application configuration..."

# Create application directory if it doesn't exist
sudo mkdir -p /opt/reportflow-backend
cd /opt/reportflow-backend

# Create/update application-aws.properties with Docker PostgreSQL settings
cat > application-aws.properties << 'EOF'
# AWS Production Configuration with Docker PostgreSQL

# Server Configuration
server.port=8080

# Database Configuration (Docker PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/reportflow
spring.datasource.username=reportflow_user
spring.datasource.password=reportflow_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# JWT Configuration
app.jwt.secret=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==
app.jwt.expiration=86400000

# GitHub OAuth Configuration
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.scope=read:user,user:email,read:org,repo
spring.security.oauth2.client.registration.github.redirect-uri=http://65.0.109.47:8080/api/auth/github/callback

# GitHub API Configuration
github.api.base-url=https://api.github.com
github.oauth.base-url=https://github.com/login/oauth

# CORS Configuration
app.cors.allowed-origins=http://localhost:*,http://127.0.0.1:*,https://reportflow-c6lz.onrender.com,http://65.0.109.47:3000,http://65.0.109.47:5000
app.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true

# Logging Configuration
logging.level.com.reportflow=INFO
logging.level.org.springframework.security=WARN
logging.level.org.springframework.web=WARN

# Application Configuration
spring.application.name=ReportFlow
app.frontend.url=http://65.0.109.47:3000
app.name=ReportFlow
app.version=1.0.0

# JSON Configuration
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=UTC
spring.jackson.date-format=yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
EOF

# Create environment file
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/reportflow
DB_USERNAME=reportflow_user
DB_PASSWORD=reportflow_password

# JWT Configuration
JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==

# Application URLs
AWS_BACKEND_URL=http://65.0.109.47:8080
FRONTEND_URL=http://65.0.109.47:3000

# GitHub OAuth (replace with your actual values)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Port Configuration
PORT=8080
EOF

echo "✅ Configuration files created!"
echo ""
echo "📁 Files created:"
echo "   /opt/reportflow-backend/application-aws.properties"
echo "   /opt/reportflow-backend/.env"
echo ""
echo "📝 Next steps:"
echo "1. Copy your JAR file to /opt/reportflow-backend/"
echo "2. Update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env"
echo "3. Create/restart the systemd service"
echo ""
echo "🔧 To create/update systemd service:"
echo "   sudo tee /etc/systemd/system/reportflow-backend.service > /dev/null << 'EOS'"
echo "[Unit]"
echo "Description=ReportFlow Backend Service"
echo "After=network.target"
echo ""
echo "[Service]"
echo "Type=simple"
echo "User=ec2-user"
echo "WorkingDirectory=/opt/reportflow-backend"
echo "ExecStart=/usr/bin/java -jar reportflow-backend-1.0.0.jar --spring.profiles.active=aws"
echo "Restart=always"
echo "RestartSec=10"
echo "StandardOutput=syslog"
echo "StandardError=syslog"
echo "SyslogIdentifier=reportflow-backend"
echo "Environment=PORT=8080"
echo "EnvironmentFile=/opt/reportflow-backend/.env"
echo ""
echo "[Install]"
echo "WantedBy=multi-user.target"
echo "EOS"
