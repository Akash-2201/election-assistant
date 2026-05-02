#!/bin/bash

# Configuration
PROJECT_ID="election-assistant-494805"
SERVICE_NAME="voterquest-live"
REGION="us-central1"

echo "🚀 Starting Deployment for $SERVICE_NAME..."

# Build and Deploy to Cloud Run
# We pass the VITE keys at build time (if needed by Vite) and runtime for the backend
gcloud run deploy $SERVICE_NAME \
  --source . \
  --project $PROJECT_ID \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GOOGLE_PROJECT_ID=$PROJECT_ID,PORT=3001" \
  --update-env-vars="VITE_GOOGLE_MAPS_MAIN=REPLACE_WITH_YOUR_MAPS_KEY"

echo "✅ Deployment Complete!"
echo "🔗 Service URL: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')"
