-- Initialize PostgreSQL database for ReportFlow
-- This script runs automatically when the PostgreSQL container starts

-- Create database if it doesn't exist (handled by environment variables)
-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up default schema
-- The actual tables will be created automatically by Spring Boot JPA
-- due to the ddl-auto=update setting
