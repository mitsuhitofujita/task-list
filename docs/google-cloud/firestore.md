# Firestore Setup for Task Management Application

## Overview
This document outlines the Firestore collections and gcloud commands needed to set up the database structure for storing Google account information and linking tasks to users.

## Collection Structure

### Users Collection (`users`)
Stores Google account information for authenticated users.

**Document ID**: Google User ID (`sub` from JWT)

**Fields**:
- `googleId` (string): Google user ID from OAuth
- `email` (string): User's email address
- `name` (string): User's display name
- `picture` (string, optional): Profile picture URL
- `createdAt` (timestamp): Account creation timestamp
- `lastSignIn` (timestamp): Last sign-in timestamp
- `isActive` (boolean): Account status

### Tasks Collection (`tasks`)
Stores task information linked to users.

**Document ID**: Auto-generated

**Fields**:
- `userId` (string): Reference to user document ID (Google ID)
- `title` (string): Task title
- `description` (string, optional): Task description
- `completed` (boolean): Task completion status
- `dueDate` (timestamp, optional): Due date
- `createdAt` (timestamp): Task creation timestamp
- `updatedAt` (timestamp): Last update timestamp
- `order` (number): Display order for drag-and-drop

### Subtasks Collection (`subtasks`)
Stores subtask information as subcollection of tasks.

**Document ID**: Auto-generated
**Parent Collection**: `tasks/{taskId}/subtasks`

**Fields**:
- `title` (string): Subtask title
- `description` (string, optional): Subtask description
- `completed` (boolean): Subtask completion status
- `createdAt` (timestamp): Subtask creation timestamp
- `updatedAt` (timestamp): Last update timestamp
- `order` (number): Display order within parent task

## gcloud Commands

### 1. Set Project and Enable Firestore
```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Create Firestore database in native mode
gcloud firestore databases create --region=asia-northeast1 --type=firestore-native
```

### 2. Create Firestore Security Rules
```bash
# Create security rules file
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Users can read and write subtasks of their own tasks
      match /subtasks/{subtaskId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/tasks/$(taskId)).data.userId;
      }
    }
  }
}
EOF

# Deploy security rules
gcloud firestore databases update --security-rules-file=firestore.rules
```

### 3. Create Composite Indexes
```bash
# Create indexes for efficient querying
cat > firestore.indexes.json << 'EOF'
{
  "indexes": [
    {
      "collectionGroup": "tasks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "tasks",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "completed",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "subtasks",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
EOF

# Deploy composite indexes
gcloud firestore indexes composite create --index-config=firestore.indexes.json
```

### 4. Set up Authentication
```bash
# Enable Authentication API
gcloud services enable identitytoolkit.googleapis.com

# Configure Google OAuth provider (replace with your domain)
gcloud alpha iap oauth-brands create \
  --application_title="Task Manager" \
  --support_email="your-support-email@yourdomain.com"

# Create OAuth client ID for web application
gcloud alpha iap oauth-clients create \
  --brand="your-brand-id" \
  --display_name="Task Manager Web Client"
```

### 5. Create Service Account for Backend
```bash
# Create service account
gcloud iam service-accounts create task-manager-backend \
  --display-name="Task Manager Backend Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:task-manager-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

# Create and download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=task-manager-backend@$PROJECT_ID.iam.gserviceaccount.com
```

### 6. Verify Setup
```bash
# List databases
gcloud firestore databases list

# Check security rules
gcloud firestore databases describe --database="(default)"

# List composite indexes
gcloud firestore indexes composite list
```

## Environment Variables
After running the above commands, update your environment variables:

```bash
# Backend environment variables
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
FIRESTORE_DATABASE_ID=(default)

# Frontend environment variables
VITE_GOOGLE_CLIENT_ID=your-oauth-client-id
```

## Notes
- Replace `your-project-id` with your actual Google Cloud project ID
- Replace `your-support-email@yourdomain.com` with your actual support email
- The security rules ensure users can only access their own data
- Composite indexes optimize queries for task ordering and filtering
- Service account key should be stored securely and not committed to version control