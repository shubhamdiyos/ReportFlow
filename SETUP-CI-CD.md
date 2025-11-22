# CI/CD Setup for ReportFlow

## 🚀 Automatic Deployment Setup

### **GitHub Actions CI/CD Pipeline**

Your CI/CD pipeline is configured in `.github/workflows/deploy-aws.yml`

**Triggers:**
- ✅ Push to `main` branch → Auto-deploy
- ✅ Push to `develop` branch → Test only
- ✅ Pull Request → Test only

### **Required GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions → Add repository secrets:

```
EC2_HOST=13.232.117.123
EC2_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
[Your SSH private key content]
-----END OPENSSH PRIVATE KEY-----

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

### **Pipeline Stages**

1. **Test Stage**
   - Build application
   - Run unit tests
   - Package JAR file

2. **Deploy Stage** (main branch only)
   - Upload JAR to EC2
   - Stop existing application
   - Start new version
   - Health check

3. **Notify Stage**
   - Success/failure notification
   - Deployment URL

## 🐳 Docker Production Setup

The `docker-compose-production.yml` provides complete isolation:

**Services:**
- 🐘 **PostgreSQL**: Port 5433 (isolated)
- ☕ **Spring Boot**: Port 8080 (direct)
- 🌐 **Nginx**: Port 8081 (proxy)

**Benefits:**
- ✅ **Isolation**: Separate from other projects
- ✅ **Auto-restart**: Services restart automatically
- ✅ **Health checks**: Monitor service health
- ✅ **Easy updates**: Just update JAR file

## 🔧 Quick Deployment Commands

### **Manual Deployment**
```bash
# Build and upload JAR
cd report_backend
mvn clean package -DskipTests

# Upload to EC2
scp -i ~/.ssh/ssh.pem target/reportflow-backend-1.0.0.jar ec2-user@13.232.117.123:~/reportflow/

# Deploy via Docker
ssh -i ~/.ssh/ssh.pem ec2-user@13.232.117.123
cd ~/reportflow
docker-compose -f docker-compose-production.yml up -d
```

### **Service Management**
```bash
# Check status
docker-compose -f docker-compose-production.yml ps

# View logs
docker-compose -f docker-compose-production.yml logs -f reportflow-backend

# Restart services
docker-compose -f docker-compose-production.yml restart

# Stop services
docker-compose -f docker-compose-production.yml down
```

## 📊 Monitoring

### **Health Checks**
```bash
# Direct backend
curl http://13.232.117.123:8080/actuator/health

# Via Nginx proxy
curl http://13.232.117.123:8081/actuator/health

# Database connection
docker exec reportflow-postgres pg_isready -U reportflow_user -d reportflow
```

### **Logs**
```bash
# Application logs
docker-compose -f docker-compose-production.yml logs reportflow-backend

# Database logs
docker-compose -f docker-compose-production.yml logs reportflow-postgres

# Nginx logs
docker-compose -f docker-compose-production.yml logs reportflow-nginx
```

## 🔄 CI/CD Workflow

### **Development Flow**
1. **Feature Branch**: `git checkout -b feature/new-api`
2. **Push Changes**: `git push origin feature/new-api`
3. **Create PR**: Pull Request to `main`
4. **Auto Test**: CI runs tests
5. **Merge**: Merge to `main`
6. **Auto Deploy**: CD deploys to production

### **Emergency Rollback**
```bash
# Stop current version
docker-compose -f docker-compose-production.yml stop reportflow-backend

# Restore backup
cp ~/reportflow/reportflow-backend-1.0.0.jar.backup ~/reportflow/reportflow-backend-1.0.0.jar

# Restart
docker-compose -f docker-compose-production.yml start reportflow-backend
```

## 🌐 URLs

**Production URLs:**
- 🐘 **PostgreSQL**: `localhost:5433` (internal)
- ☕ **Backend API**: `http://13.232.117.123:8080`
- 🌐 **Nginx Proxy**: `http://13.232.117.123:8081`

**GitHub OAuth Callback:**
```
http://13.232.117.123:8080/api/auth/github/callback
```

## 📋 Setup Checklist

- [ ] Add GitHub secrets
- [ ] Update GitHub OAuth callback URL
- [ ] Test manual deployment
- [ ] Push to main branch (auto-deploy)
- [ ] Verify health checks
- [ ] Set up monitoring alerts

## 🚨 Troubleshooting

### **Common Issues**
1. **SSH Connection Failed**: Check SSH key in GitHub secrets
2. **Build Failed**: Check Maven dependencies
3. **Deploy Failed**: Check application logs
4. **Health Check Failed**: Check database connection

### **Debug Commands**
```bash
# Check GitHub Actions logs
# Go to repository → Actions → Select workflow run

# Check EC2 deployment
ssh -i ~/.ssh/ssh.pem ec2-user@13.232.117.123
cd ~/reportflow
cat app.log

# Check Docker status
docker ps
docker-compose -f docker-compose-production.yml ps
```
