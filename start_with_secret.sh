#!/bin/bash

# ReportFlow - Start with GitHub OAuth Secret
# Replace YOUR_SECRET_HERE with your actual GitHub Client Secret

echo "🚀 Starting ReportFlow Backend with OAuth Configuration..."

cd /Users/shubhamkumar/Documents/ReportFlow/report_backend

# Set your GitHub Client Secret here (copy from GitHub settings)
export GITHUB_CLIENT_ID="Ov23li1Ic93WExWFwtgv"
export GITHUB_CLIENT_SECRET="YOUR_SECRET_HERE"  # ⚠️ REPLACE THIS

echo "✅ GitHub Client ID: $GITHUB_CLIENT_ID"
echo "✅ GitHub Client Secret: ${GITHUB_CLIENT_SECRET:0:5}..." # Show only first 5 chars

echo "🔧 Starting Spring Boot backend on port 8080..."
mvn spring-boot:run
