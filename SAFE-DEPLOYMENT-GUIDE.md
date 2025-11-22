# 🛡️ Safe Deployment Guide - ReportFlow Isolated Setup

## ⚠️ **CRITICAL: Protect Existing Projects**

**Current Server Issues:**
- SSH connection timing out
- Port 8080 open but not responding
- Server might be overloaded or has issues

## 🛡️ **Safe Isolation Strategy**

### **Port Isolation (Won't affect existing projects)**
```
Existing Projects:
- Port 80: Existing project
- Port 8080: Existing project (gms-server)

ReportFlow (ISOLATED):
- PostgreSQL: Port 5434 (isolated)
- Backend: Port 8082 (isolated)
- Nginx: Port 8083 (isolated)
```

### **Container Isolation**
```
Existing: gms-server containers (NOT touched)
ReportFlow: reportflow-* containers (separate)
```

### **Directory Isolation**
```
Existing: ~/gms-server, ~/other-projects
ReportFlow: ~/reportflow-isolated (completely separate)
```

## 🚀 **Safe Deployment Steps**

### **Step 1: Check Server Status**
```bash
# Check if server is responsive
curl -m 5 http://13.232.117.123/

# Check existing processes (DON'T STOP THEM)
docker ps  # See what's running
ps aux | grep java  # See Java processes
```

### **Step 2: Deploy ReportFlow Safely**
```bash
# Copy safe deployment script
scp -i ~/.ssh/ssh.pem safe-deploy-isolated.sh ec2-user@13.232.117.123:~/

# Copy JAR file
scp -i ~/.ssh/ssh.pem report_backend/target/reportflow-backend-1.0.0.jar ec2-user@13.232.117.123:~/

# Run safe deployment (WON'T affect existing projects)
ssh -i ~/.ssh/ssh.pem ec2-user@13.232.117.123
chmod +x safe-deploy-isolated.sh
./safe-deploy-isolated.sh
```

### **Step 3: Verify Isolation**
```bash
# Check existing projects still work
curl http://13.232.117.123/  # Existing project
curl http://13.232.117.123:8080/  # Existing gms-server

# Check ReportFlow (isolated)
curl http://13.232.117.123:8082/actuator/health  # ReportFlow only
```

## 🔍 **Verification Commands**

### **Check Existing Projects**
```bash
# List all containers (existing should still be running)
docker ps

# Check existing Java processes
ps aux | grep java

# Check existing ports
netstat -tlnp | grep :80
netstat -tlnp | grep :8080
```

### **Check ReportFlow Isolation**
```bash
# Check only ReportFlow containers
docker ps | grep reportflow

# Check isolated ports
netstat -tlnp | grep :8082
netstat -tlnp | grep :8083

# Check isolated database
docker exec reportflow-postgres pg_isready -U reportflow_user
```

## 🚨 **Emergency Rollback**

### **If Issues Occur**
```bash
# Stop ONLY ReportFlow (won't affect existing)
cd ~/reportflow-isolated
docker-compose -f docker-compose-isolated.yml down

# Remove ReportFlow containers only
docker rm reportflow-postgres reportflow-backend reportflow-nginx

# Existing projects remain untouched!
```

### **Verify Existing Projects Safe**
```bash
# Check existing projects still running
docker ps | grep -v reportflow
curl http://13.232.117.123/
curl http://13.232.117.123:8080/
```

## 📋 **Safety Checklist**

- [ ] Server is responsive
- [ ] Existing projects listed and documented
- [ ] Isolated ports chosen (8082, 8083, 5434)
- [ ] Safe deployment script ready
- [ ] Rollback plan prepared
- [ ] Monitoring setup for isolation

## 🔄 **CI/CD Safe Configuration**

### **GitHub Actions (Safe Mode)**
```yaml
# Uses isolated ports
- DATABASE_URL=jdbc:postgresql://localhost:5434/reportflow
- AWS_BACKEND_URL=http://13.232.117.123:8082
- FRONTEND_URL=http://13.232.117.123:8083

# Safe deployment commands
cd ~/reportflow-isolated
docker-compose -f docker-compose-isolated.yml up -d
```

### **Health Checks**
```bash
# ReportFlow health (isolated)
curl http://13.232.117.123:8082/actuator/health

# Existing projects health (verify not affected)
curl http://13.232.117.123/
curl http://13.232.117.123:8080/
```

## 🌐 **Final URLs**

**Existing Projects (UNCHANGED):**
- 🌐 http://13.232.117.123/ (existing)
- ⚙️ http://13.232.117.123:8080/ (gms-server)

**ReportFlow (ISOLATED):**
- 🗄️ PostgreSQL: `localhost:5434`
- ☕ Backend: `http://13.232.117.123:8082`
- 🌐 Nginx: `http://13.232.117.123:8083`
- 🏥 Health: `http://13.232.117.123:8082/actuator/health`

## ⚠️ **Important Notes**

1. **NEVER stop existing containers**
2. **NEVER use existing ports (80, 8080)**
3. **ALWAYS use isolated directory structure**
4. **ALWAYS verify existing projects after deployment**
5. **HAVE rollback plan ready**

**This approach ensures 100% isolation - existing projects won't be affected!** 🛡️
