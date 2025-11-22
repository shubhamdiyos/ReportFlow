#!/bin/bash

# AWS Deployment Script for ReportFlow Backend
# This script deploys the Spring Boot application to the existing EC2 instance

set -e

# Configuration
EC2_USER="ec2-user"
EC2_HOST="65.0.109.47"
EC2_KEY_PATH="$HOME/.ssh/ssh"  # Update this path if needed
APP_NAME="reportflow-backend"
APP_DIR="/opt/$APP_NAME"
SERVICE_NAME="$APP_NAME"
JAR_FILE="$APP_NAME-1.0.0.jar"

echo "🚀 Starting AWS deployment for ReportFlow Backend..."

# Check if SSH key exists
if [ ! -f "$EC2_KEY_PATH" ]; then
    echo "❌ SSH key not found at $EC2_KEY_PATH"
    echo "Please update the EC2_KEY_PATH variable in this script"
    exit 1
fi

# Build the application
echo "📦 Building the application..."
cd report_backend
mvn clean package -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Copy JAR file to EC2 instance
echo "📤 Copying application to EC2 instance..."
scp -i "$EC2_KEY_PATH" target/$JAR_FILE $EC2_USER@$EC2_HOST:/tmp/

# Setup application on EC2 instance
echo "🔧 Setting up application on EC2 instance..."
ssh -i "$EC2_KEY_PATH" $EC2_USER@$EC2_HOST << 'EOF'

# Install Java if not present
sudo yum update -y
sudo yum install -y java-17-amazon-corretto

# Create application directory
sudo mkdir -p /opt/reportflow-backend
sudo mv /tmp/reportflow-backend-1.0.0.jar /opt/reportflow-backend/
sudo chown ec2-user:ec2-user /opt/reportflow-backend/reportflow-backend-1.0.0.jar

# Create systemd service
sudo tee /etc/systemd/system/reportflow-backend.service > /dev/null << EOL
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

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable reportflow-backend
sudo systemctl restart reportflow-backend

# Open port 8080 if not already open
sudo iptables -C INPUT -p tcp --dport 8080 -j ACCEPT || sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

echo "✅ Application setup completed on EC2 instance"

EOF

echo "🎉 Deployment completed successfully!"
echo "🌐 Application should be available at: http://$EC2_HOST:8080"
echo "📊 Check service status: ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_HOST 'sudo systemctl status reportflow-backend'"
