# AWS Migration Guide for ReportFlow Backend

## Overview
This guide helps you migrate your ReportFlow backend from Render to AWS EC2.

## Prerequisites
- AWS CLI configured with credentials
- Access to the EC2 instance (65.0.109.47)
- SSH key pair for the EC2 instance

## Current Infrastructure
- **EC2 Instance**: t3.micro running in ap-south-1b
- **Public IP**: 65.0.109.47
- **Instance ID**: i-097b7a463527ce232

## Deployment Options

### Option 1: Direct JAR Deployment (Recommended for Production)

1. **SSH Access Setup**:
   ```bash
   # You need the correct SSH key pair that was used to launch the instance
   # The key is likely named 'ssh' based on the instance metadata
   ssh -i /path/to/ssh.pem ec2-user@65.0.109.47
   ```

2. **Manual Deployment Steps**:
   ```bash
   # Connect to EC2 instance
   ssh -i your-key.pem ec2-user@65.0.109.47
   
   # Install Java 17
   sudo yum update -y
   sudo yum install -y java-17-amazon-corretto
   
   # Create application directory
   sudo mkdir -p /opt/reportflow-backend
   cd /opt/reportflow-backend
   
   # Copy the JAR file (from your local machine)
   # Exit from EC2 and run from your local:
   scp -i your-key.pem report_backend/target/reportflow-backend-1.0.0.jar ec2-user@65.0.109.47:/opt/reportflow-backend/
   
   # Back on EC2 instance:
   sudo chown ec2-user:ec2-user /opt/reportflow-backend/reportflow-backend-1.0.0.jar
   
   # Create systemd service
   sudo tee /etc/systemd/system/reportflow-backend.service > /dev/null <<EOF
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
EOF
   
   # Start the service
   sudo systemctl daemon-reload
   sudo systemctl enable reportflow-backend
   sudo systemctl start reportflow-backend
   sudo systemctl status reportflow-backend
   ```

3. **Database Setup**:
   - Option A: Use AWS RDS (requires IAM permissions)
   - Option B: Install PostgreSQL on EC2:
   ```bash
   # On EC2 instance
   sudo yum install -y postgresql postgresql-server
   sudo postgresql-setup initdb
   sudo systemctl enable postgresql
   sudo systemctl start postgresql
   
   # Create database and user
   sudo -u postgres createuser reportflow_user
   sudo -u postgres createdb reportflow
   sudo -u postgres psql -c "ALTER USER reportflow_user PASSWORD 'reportflow_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;"
   ```

### Option 2: Docker Deployment (Easier Setup)

1. **Install Docker on EC2**:
   ```bash
   ssh -i your-key.pem ec2-user@65.0.109.47
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy with Docker Compose**:
   ```bash
   # Copy files to EC2
   scp -i your-key.pem aws-docker-compose.yml ec2-user@65.0.109.47:~/
   scp -i your-key.pem nginx.conf ec2-user@65.0.109.47:~/
   scp -i your-key.pem init.sql ec2-user@65.0.109.47:~/
   
   # On EC2 instance
   mkdir -p ~/reportflow
   mv aws-docker-compose.yml ~/reportflow/docker-compose.yml
   mv nginx.conf ~/reportflow/
   mv init.sql ~/reportflow/
   
   # Create .env file for environment variables
   cat > ~/reportflow/.env <<EOF
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==
AWS_BACKEND_URL=http://65.0.109.47:8080
FRONTEND_URL=http://65.0.109.47:3000
EOF
   
   # Start the application
   cd ~/reportflow
   docker-compose up -d
   ```

## Environment Variables

Set these environment variables on the EC2 instance:

```bash
# Required for GitHub OAuth
export GITHUB_CLIENT_ID=your_github_client_id
export GITHUB_CLIENT_SECRET=your_github_client_secret

# Database configuration (if not using PostgreSQL container)
export DATABASE_URL=jdbc:postgresql://localhost:5432/reportflow
export DB_USERNAME=reportflow_user
export DB_PASSWORD=reportflow_password

# JWT Secret
export JWT_SECRET=2YrMZR3BqiU6N18gcgfRX23cIiDiusL4TRbAq912uf5+lPiTPWW6y+vu7WD8Uex7GN5aRIPYsKvpsAvAbi1qxg==

# Application URLs
export AWS_BACKEND_URL=http://65.0.109.47:8080
export FRONTEND_URL=http://65.0.109.47:3000
```

## Security Configuration

1. **Open Required Ports**:
   ```bash
   # On EC2 instance
   sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
   sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
   sudo iptables -I INPUT -p tcp --dport 5432 -j ACCEPT  # For PostgreSQL
   
   # Save iptables rules
   sudo service iptables save
   ```

2. **Configure Security Group** (via AWS Console):
   - Go to EC2 → Security Groups → launch-wizard-1
   - Add inbound rules:
     - HTTP (80) from 0.0.0.0/0
     - HTTPS (443) from 0.0.0.0/0
     - Custom TCP (8080) from 0.0.0.0/0
     - SSH (22) from your IP

## Monitoring and Logs

```bash
# Check application logs
sudo journalctl -u reportflow-backend -f

# Check Docker logs (if using Docker)
docker-compose logs -f

# Check service status
sudo systemctl status reportflow-backend
```

## Testing the Deployment

1. **Health Check**:
   ```bash
   curl http://65.0.109.47:8080/actuator/health
   ```

2. **API Test**:
   ```bash
   curl http://65.0.109.47:8080/api/public/health
   ```

## Next Steps

1. **Update GitHub OAuth Callback URL**:
   - Go to your GitHub OAuth App settings
   - Update callback URL to: `http://65.0.109.47:8080/api/auth/github/callback`

2. **Domain Setup** (Optional):
   - Point your domain to 65.0.109.47
   - Set up SSL certificate with Let's Encrypt

3. **Database Backup**:
   - Set up automated backups for PostgreSQL

## Troubleshooting

- **SSH Permission Denied**: Ensure you're using the correct SSH key pair
- **Port Not Accessible**: Check security group rules and iptables
- **Service Not Starting**: Check logs with `journalctl -u reportflow-backend`
- **Database Connection Failed**: Verify PostgreSQL is running and credentials are correct

## Files Created

- `application-aws.properties` - AWS-specific Spring Boot configuration
- `deploy-aws.sh` - Automated deployment script
- `aws-docker-compose.yml` - Docker Compose configuration
- `nginx.conf` - Nginx reverse proxy configuration
- `init.sql` - PostgreSQL initialization script
