# 🚀 ReportFlow - GitHub Analytics Platform

## 📋 **Project Overview**
ReportFlow is a comprehensive GitHub analytics platform that provides insights into developer productivity, team performance, and repository metrics through beautiful dashboards and detailed reports.

## 🏗️ **Project Structure**

```
ReportFlow/
├── .github/workflows/    # CI/CD pipeline (builds and copies JAR to EC2)
├── docs/                 # Comprehensive documentation
├── report_backend/       # Spring Boot Backend API
│   ├── src/            # Java source code
│   ├── pom.xml         # Maven dependencies
│   └── target/         # Build output (JAR file)
└── report_frontend/    # React Frontend Application
    ├── src/            # React source code
    ├── package.json    # NPM dependencies
    └── dist/           # Build output
```

## 🔧 **Technology Stack**

### **Backend (report_backend/)**
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: GitHub OAuth + JWT
- **Security**: Spring Security
- **Build Tool**: Maven
- **Deployment**: Manual on EC2 with CI/CD support

### **Frontend (report_frontend/)**
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Build Tool**: Vite

## 🚀 **Quick Start**

### **Prerequisites**
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Git
- GitHub OAuth App

### **Backend Setup**
```bash
cd report_backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run

# Backend will run on http://localhost:8080
```

### **Frontend Setup**
```bash
cd report_frontend

# Install dependencies and run
npm install
npm run dev

# Frontend will run on http://localhost:3000
```

## 📊 **Features**

### **✅ Backend Features (Completed)**
- **GitHub OAuth Integration** - Secure user authentication
- **User Management** - Profile management and role-based access
- **Organization Management** - Multi-tenant architecture
- **Repository Analytics** - Comprehensive repo metrics
- **Developer Metrics** - Individual performance tracking
- **Team Analytics** - Team performance insights
- **KPI Dashboard** - Key performance indicators
- **Chart Data API** - Data visualization endpoints
- **Security** - JWT tokens, RBAC, CORS support

### **🔄 Frontend Features (To be implemented)**
- **Authentication Flow** - GitHub OAuth integration
- **Dashboard** - Overview of key metrics
- **Analytics Pages** - Detailed charts and reports
- **User Management** - Profile and settings
- **Organization Switching** - Multi-org support
- **Repository Management** - Repo configuration
- **Team Management** - Team insights
- **Responsive Design** - Mobile-friendly interface

## 🔐 **Configuration**

### **Environment Variables**
```bash
# Backend (.env or system environment)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DATABASE_URL=postgresql://user:password@localhost:5432/reportflow
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### **Database Setup**
```bash
# Create PostgreSQL database
createdb reportflow
createuser reportflow_user

# Grant permissions
psql -d reportflow -c "GRANT ALL PRIVILEGES ON DATABASE reportflow TO reportflow_user;"
```

## 📚 **Documentation**

### **Backend Documentation**
- **API Documentation**: `docs/backend/api/`
- **Setup Guide**: `docs/backend/deployment/`
- **Progress Tracking**: `docs/backend/progress.md`
- **Testing Results**: `docs/backend/api/`

### **Frontend Documentation**
- **Component Documentation**: `docs/frontend/components/`
- **Integration Guide**: `docs/integration/`

## 🧪 **Testing**

### **Backend Testing**
```bash
cd report_backend

# Run all API tests
./comprehensive_api_test.sh

# Test results: 19/19 APIs tested and working ✅
```

### **Frontend Testing**
```bash
cd report_frontend

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run coverage
npm run test:coverage
```

## 🚀 **Deployment**

### **CI/CD Pipeline**
- **Build**: Automatically builds on push to main branch
- **Deploy**: Copies JAR file to EC2 instance
- **Manual Deployment**: Use provided deployment script

### **Manual Deployment on EC2**
```bash
# Connect to EC2
ssh -i your_key.pem ec2-user@65.1.106.112

# Navigate to app directory
cd ~/app

# Check which port is listening and kill it
sudo ss -tlnp | grep 8080
sudo fuser -k 8080/tcp

# Deploy with nohup
export DATABASE_URL="jdbc:postgresql://localhost:5433/reportflow"
export DB_USERNAME="reportflow_user"
export DB_PASSWORD="reportflow_password"
export JWT_SECRET="your_jwt_secret"
export GITHUB_CLIENT_ID="your_client_id"
export GITHUB_CLIENT_SECRET="your_client_secret"
export FRONTEND_URL="http://localhost:3000"
export SPRING_PROFILES_ACTIVE=aws

nohup java -jar reportflow-backend-1.0.0.jar > app.log 2>&1 &
sleep 10 && tail -10 app.log
```

## 📈 **Development Status**

### **✅ Completed (Backend)**
- [x] Spring Boot application setup
- [x] Database schema and entities
- [x] GitHub OAuth integration
- [x] All 19 API endpoints
- [x] Security implementation
- [x] Comprehensive testing
- [x] CI/CD pipeline
- [x] Documentation

### **🔄 In Progress (Frontend)**
- [ ] React application setup
- [ ] Component architecture
- [ ] API integration
- [ ] Authentication flow
- [ ] Dashboard implementation
- [ ] Charts and analytics
- [ ] Responsive design

## 🤝 **Contributing**

### **Backend Development**
```bash
cd report_backend
# Follow Spring Boot best practices
# Update documentation with changes
# Run tests before committing
```

### **Frontend Development**
```bash
cd report_frontend
# Follow React/TypeScript best practices
# Update component documentation
# Run tests and linting
```

## 📞 **Support**

- **Backend Issues**: Check `docs/backend/progress.md`
- **API Documentation**: `docs/backend/api/`
- **Setup Issues**: `docs/backend/deployment/`

## 🎯 **Next Steps**

1. **Frontend Setup** - Initialize React application
2. **API Integration** - Connect frontend to backend APIs
3. **Authentication** - Implement OAuth flow
4. **Dashboard** - Create main analytics dashboard
5. **Testing** - Set up frontend testing suite
6. **Deployment** - Deploy both backend and frontend

---

**📅 Last Updated**: 2025-11-23  
**🎯 Status**: Backend Complete ✅ | Frontend Setup Required 🔄  
**🚀 Ready**: Backend production deployment approved
