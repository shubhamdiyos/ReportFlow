# Complete Docker PostgreSQL Setup for ReportFlow

## 🚀 Quick Setup Guide

### Step 1: Connect to Your EC2 Instance
```bash
ssh -i your-key.pem ec2-user@65.0.109.47
```

### Step 2: Setup PostgreSQL with Docker
```bash
# Copy the setup script to EC2 (from your local machine)
scp -i your-key.pem docker-postgres-setup.sh ec2-user@65.0.109.47:~/

# On EC2: Run the PostgreSQL setup
chmod +x docker-postgres-setup.sh
./docker-postgres-setup.sh
```

### Step 3: Update Application Configuration
```bash
# Copy the config script to EC2 (from your local machine)
scp -i your-key.pem update-app-config.sh ec2-user@65.0.109.47:~/

# On EC2: Run the config update
chmod +x update-app-config.sh
./update-app-config.sh
```

### Step 4: Deploy Your Application
```bash
# Copy your JAR file to EC2 (from your local machine)
scp -i your-key.pem report_backend/target/reportflow-backend-1.0.0.jar ec2-user@65.0.109.47:/opt/reportflow-backend/

# On EC2: Create systemd service
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

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable reportflow-backend
sudo systemctl start reportflow-backend
sudo systemctl status reportflow-backend
```

### Step 5: Test Everything
```bash
# Test PostgreSQL connection
docker exec -it reportflow-postgres psql -U reportflow_user -d reportflow

# Test application health
curl http://65.0.109.47:8080/actuator/health

# Check application logs
sudo journalctl -u reportflow-backend -f
```

## 🐘 PostgreSQL Details

**Connection Info:**
- Host: `localhost`
- Port: `5432`
- Database: `reportflow`
- Username: `reportflow_user`
- Password: `reportflow_password`
- JDBC URL: `jdbc:postgresql://localhost:5432/reportflow`

## 🔧 Useful Commands

### Docker Commands
```bash
# Check PostgreSQL status
docker-compose ps

# View logs
docker-compose logs postgres

# Stop database
docker-compose down

# Start database
docker-compose up -d

# Connect to database
docker exec -it reportflow-postgres psql -U reportflow_user -d reportflow
```

### Application Commands
```bash
# Check application status
sudo systemctl status reportflow-backend

# Restart application
sudo systemctl restart reportflow-backend

# View application logs
sudo journalctl -u reportflow-backend -f

# Check port connectivity
curl http://65.0.109.47:8080/actuator/health
```

## 🔍 Troubleshooting

### If PostgreSQL doesn't start
```bash
# Check Docker logs
docker-compose logs postgres

# Check if port is available
sudo netstat -tlnp | grep 5432

# Restart Docker services
sudo systemctl restart docker
docker-compose down
docker-compose up -d
```

### If application can't connect to database
```bash
# Test connection from EC2
docker exec -it reportflow-postgres psql -U reportflow_user -d reportflow

# Check if application is running
sudo systemctl status reportflow-backend

# Check application logs for database errors
sudo journalctl -u reportflow-backend -f | grep -i database
```

### If application returns 403 errors
```bash
# Check application logs
sudo journalctl -u reportflow-backend -f

# Verify GitHub OAuth credentials
cat /opt/reportflow-backend/.env

# Test health endpoint
curl -v http://65.0.109.47:8080/actuator/health
```

## 🎯 Expected Result

After completing this setup:
1. ✅ PostgreSQL will be running in Docker
2. ✅ Spring Boot app will connect to database
3. ✅ Health check will return `UP` status
4. ✅ API endpoints will be accessible

**Final URL:** `http://65.0.109.47:8080`

## 📋 Checklist

- [ ] SSH key access to EC2 instance
- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL container running
- [ ] Application JAR file copied
- [ ] Systemd service created
- [ ] GitHub OAuth credentials updated
- [ ] Health check returns UP status
- [ ] API endpoints accessible
