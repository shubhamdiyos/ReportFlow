# Multi-stage build for Spring Boot application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY report_backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy source code
COPY report_backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use JRE for runtime
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/reportflow-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
