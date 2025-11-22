#!/bin/bash

# Simple AWS Deployment Script for ReportFlow Backend
# This script prepares the deployment files and provides instructions

set -e

echo "🚀 Preparing AWS deployment for ReportFlow Backend..."

# Build the application
echo "📦 Building the application..."
cd report_backend
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Create deployment package
echo "📦 Creating deployment package..."
cd ..
mkdir -p aws-deployment
cp report_backend/target/reportflow-backend-1.0.0.jar aws-deployment/
cp report_backend/src/main/resources/application-aws.properties aws-deployment/
cp deploy-aws.sh aws-deployment/
cp aws-docker-compose.yml aws-deployment/
cp nginx.conf aws-deployment/
cp init.sql aws-deployment/
cp AWS-SETUP-GUIDE.md aws-deployment/

# Create environment file template
cat > aws-deployment/.env.template <<EOF
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/reportflow
DB_USERNAME=reportflow_user
DB_PASSWORD=reportflow_password

# JWT Configuration
JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==

# Application URLs
AWS_BACKEND_URL=http://65.0.109.47:8080
FRONTEND_URL=http://65.0.109.47:3000

# Port Configuration
PORT=8080
EOF

# Create deployment instructions
cat > aws-deployment/DEPLOY-INSTRUCTIONS.txt <<EOF
AWS Deployment Instructions for ReportFlow Backend
===============================================

Your EC2 Instance Details:
- Public IP: 65.0.109.47
- Instance ID: i-097b7a463527ce232
- Region: ap-south-1

Prerequisites:
1. You need the SSH key pair that was used to launch this instance
2. The key is likely named 'ssh' based on AWS metadata

Quick Deployment Steps:

1. Connect to EC2 instance:
   ssh -i /path/to/ssh.pem ec2-user@65.0.109.47

2. Install Java 17:
   sudo yum update -y
   sudo yum install -y java-17-amazon-corretto

3. Create application directory:
   sudo mkdir -p /opt/reportflow-backend
   cd /opt/reportflow-backend

4. Copy files to EC2 (from your local machine):
   scp -i /path/to/ssh.pem reportflow-backend-1.0.0.jar ec2-user@65.0.109.47:/opt/reportflow-backend/
   scp -i /path/to/ssh.pem application-aws.properties ec2-user@65.0.109.47:/opt/reportflow-backend/

5. Set up environment variables:
   cp .env.template .env
   # Edit .env with your actual GitHub OAuth credentials

6. Create systemd service:
   sudo tee /etc/systemd/system/reportflow-backend.service > /dev/null << 'EOS'
[Unit]
Description=ReportFlow Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/reportflow-backend
ExecStart=/usr/bin/java -jar reportflow-backend-1.0.0.jar --spring.profiles.active=aws
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=reportflow-backend
Environment=PORT=8080
EnvironmentFile=/opt/reportflow-backend/.env

[Install]
WantedBy=multi-user.target
EOS

7. Start the service:
   sudo systemctl daemon-reload
   sudo systemctl enable reportflow-backend
   sudo systemctl start reportflow-backend
   sudo systemctl status reportflow-backend

8. Open port 8080:
   sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

9. Test the deployment:
   curl http://65.0.109.47:8080/actuator/health

Database Setup Option A - PostgreSQL on EC2:
sudo yum install -y postgresql postgresql-server
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo -u postgres createuser reportflow_user
sudo -u postgres createdb reportflow
sudo -u postgres psql -c "ALTER USER reportflow_user PASSWORD 'reportflow_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;"

Database Setup Option B - Docker (easier):
# Install Docker first, then use the provided docker-compose.yml

For detailed instructions, see AWS-SETUP-GUIDE.md
EOF

# Create deployment package
cd aws-deployment
tar -czf reportflow-aws-deployment.tar.gz *

echo "✅ Deployment package created successfully!"
echo ""
echo "📦 Files ready in 'aws-deployment' directory:"
echo "   - reportflow-backend-1.0.0.jar (application JAR)"
echo "   - application-aws.properties (AWS configuration)"
echo "   - deploy-aws.sh (deployment script)"
echo "   - aws-docker-compose.yml (Docker setup)"
echo "   - nginx.conf (Nginx configuration)"
echo "   - init.sql (PostgreSQL init script)"
echo "   - AWS-SETUP-GUIDE.md (detailed guide)"
echo "   - DEPLOY-INSTRUCTIONS.txt (quick steps)"
echo "   - .env.template (environment variables)"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the aws-deployment directory to your EC2 instance"
echo "2. Follow DEPLOY-INSTRUCTIONS.txt for deployment"
echo "3. Update GitHub OAuth callback URL to: http://65.0.109.47:8080/api/auth/github/callback"
echo "4. Test the deployment at: http://65.0.109.47:8080"
echo ""
echo "🌐 Your application will be available at: http://65.0.109.47:8080"
