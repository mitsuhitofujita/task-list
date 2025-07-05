# Google Cloud Deployment Setup for Task Management Application

## Overview
This document outlines the Google Cloud resources and commands needed to deploy the Task Management application using GitHub Actions, Artifact Registry, and Cloud Run with OIDC authentication.

## Prerequisites
- Google Cloud Project with billing enabled
- GitHub repository with the application code
- `gcloud` CLI installed and authenticated

## Environment Variables
Set these variables before running the commands:

```bash
export PROJECT_ID="your-project-id"
export REGION="asia-northeast1"
export REPOSITORY_NAME="task-manager"
export SERVICE_NAME="task-manager-app"
export GITHUB_REPO="your-github-username/task-list"
export WORKLOAD_IDENTITY_POOL_ID="github-actions-pool"
export WORKLOAD_IDENTITY_PROVIDER_ID="github-actions-provider"
export SERVICE_ACCOUNT_NAME="github-actions-sa"
```

## 1. Enable Required APIs

```bash
# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  cloudresourcemanager.googleapis.com \
  firestore.googleapis.com \
  identitytoolkit.googleapis.com
```

## 2. Create Artifact Registry Repository

```bash
# Create Docker repository in Artifact Registry
gcloud artifacts repositories create $REPOSITORY_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="Task Manager application container images"

# Configure Docker authentication
gcloud auth configure-docker $REGION-docker.pkg.dev
```

## 3. Create Service Account for GitHub Actions

```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GitHub Actions Service Account" \
  --description="Service account for GitHub Actions to deploy Task Manager"

# Grant necessary roles to the service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"

# Grant datastore access for the application
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

## 4. Set up Workload Identity Federation (OIDC)

```bash
# Create workload identity pool
gcloud iam workload-identity-pools create $WORKLOAD_IDENTITY_POOL_ID \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  --description="Pool for GitHub Actions OIDC authentication"

# Get the full pool ID
export WORKLOAD_IDENTITY_POOL_FULL_ID="projects/$PROJECT_ID/locations/global/workloadIdentityPools/$WORKLOAD_IDENTITY_POOL_ID"

# Create workload identity provider
gcloud iam workload-identity-pools providers create-oidc $WORKLOAD_IDENTITY_PROVIDER_ID \
  --location="global" \
  --workload-identity-pool=$WORKLOAD_IDENTITY_POOL_ID \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor,attribute.aud=assertion.aud" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Allow the GitHub repository to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding \
  $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/$WORKLOAD_IDENTITY_POOL_FULL_ID/attribute.repository/$GITHUB_REPO"
```

## 5. Create Cloud Run Service

```bash
# Create initial Cloud Run service (will be updated by GitHub Actions)
gcloud run deploy $SERVICE_NAME \
  --image="gcr.io/cloudrun/hello" \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --port=3000 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --service-account=$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com

# Set environment variables for the service
gcloud run services update $SERVICE_NAME \
  --region=$REGION \
  --set-env-vars="GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,NODE_ENV=production"
```

## 6. Configure Custom Domain (Optional)

```bash
# If you have a custom domain, map it to the service
# Replace 'your-domain.com' with your actual domain
export DOMAIN="your-domain.com"

# Map domain to the service
gcloud run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=$DOMAIN \
  --region=$REGION

# Get the DNS records to configure at your domain registrar
gcloud run domain-mappings describe $DOMAIN --region=$REGION
```

## 7. Create Secrets in Secret Manager

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secrets (replace with actual values)
echo -n "your-jwt-secret-here" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-google-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-

# Grant the service account access to secrets
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-client-id \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-client-secret \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 8. Output GitHub Actions Configuration

```bash
# Get the workload identity provider for GitHub Actions
export WORKLOAD_IDENTITY_PROVIDER="projects/$PROJECT_ID/locations/global/workloadIdentityPools/$WORKLOAD_IDENTITY_POOL_ID/providers/$WORKLOAD_IDENTITY_PROVIDER_ID"

echo "Add these secrets to your GitHub repository:"
echo "GCP_PROJECT_ID: $PROJECT_ID"
echo "GCP_SERVICE_ACCOUNT: $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER: $WORKLOAD_IDENTITY_PROVIDER"
echo "ARTIFACT_REGISTRY_REPO: $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME"
echo "CLOUD_RUN_SERVICE: $SERVICE_NAME"
echo "CLOUD_RUN_REGION: $REGION"
```

## 9. Verification Commands

```bash
# Check Artifact Registry repository
gcloud artifacts repositories list --location=$REGION

# Check service account
gcloud iam service-accounts list --filter="email:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# Check workload identity pool
gcloud iam workload-identity-pools list --location=global

# Check Cloud Run service
gcloud run services list --region=$REGION

# Check secrets
gcloud secrets list

# Test workload identity federation
gcloud iam workload-identity-pools providers describe $WORKLOAD_IDENTITY_PROVIDER_ID \
  --location=global \
  --workload-identity-pool=$WORKLOAD_IDENTITY_POOL_ID
```

## 10. Clean Up Commands (Use with caution)

```bash
# Delete Cloud Run service
gcloud run services delete $SERVICE_NAME --region=$REGION --quiet

# Delete Artifact Registry repository
gcloud artifacts repositories delete $REPOSITORY_NAME --location=$REGION --quiet

# Delete workload identity pool
gcloud iam workload-identity-pools delete $WORKLOAD_IDENTITY_POOL_ID --location=global --quiet

# Delete service account
gcloud iam service-accounts delete $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com --quiet

# Delete secrets
gcloud secrets delete jwt-secret --quiet
gcloud secrets delete google-client-id --quiet
gcloud secrets delete google-client-secret --quiet
```

## GitHub Actions Workflow Example

Add this to your GitHub repository secrets and create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
    - uses: actions/checkout@v4

    - id: auth
      uses: google-github-actions/auth@v2
      with:
        workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
        service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

    - name: Configure Docker
      run: gcloud auth configure-docker ${{ secrets.CLOUD_RUN_REGION }}-docker.pkg.dev

    - name: Build and Push
      run: |
        docker build -t ${{ secrets.ARTIFACT_REGISTRY_REPO }}/task-manager:${{ github.sha }} .
        docker push ${{ secrets.ARTIFACT_REGISTRY_REPO }}/task-manager:${{ github.sha }}

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy ${{ secrets.CLOUD_RUN_SERVICE }} \
          --image=${{ secrets.ARTIFACT_REGISTRY_REPO }}/task-manager:${{ github.sha }} \
          --region=${{ secrets.CLOUD_RUN_REGION }} \
          --platform=managed
```

## Notes
- Replace all placeholder values with your actual project details
- Store sensitive information in GitHub Secrets, not in the repository
- The workload identity federation eliminates the need for service account keys
- Cloud Run will automatically scale based on traffic
- Monitor costs and set up billing alerts as needed
- Consider using Cloud Build for more complex build processes