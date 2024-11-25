#!/bin/bash

# Exit on any error
set -e

echo "Starting installation process..."

# Step 1: Install Node.js dependencies
echo "Installing dependencies..."
npm install

# Step 2: Update the .env file with your credentials (user will need to manually add their credentials)
echo "Please update the .env file with your Google Sheets credentials, Diffbot API token, and email credentials."
echo "The file is located at ./Internship-Tracker-API/.env"

# Step 3: Install necessary npm packages for Google Sheets, Diffbot, etc.
echo "Installing necessary npm packages..."
npm install googleapis dotenv @azure/functions

# Step 4: Verify if Google Sheets credentials are present
if [ ! -f "$GOOGLE_SHEETS_CREDENTIALS" ]; then
  echo "ERROR: Google Sheets credentials file not found. Please add the credentials to the .env file."
  exit 1
fi

# Step 5: Check for Google Cloud SDK
if ! command -v gcloud &> /dev/null
then
  echo "Google Cloud SDK not found. Installing..."
  curl -sSL https://sdk.cloud.google.com | bash
  exec -l $SHELL
  gcloud init
else
  echo "Google Cloud SDK is already installed."
fi

# Step 6: Check for Azure Functions Core Tools
if ! command -v func &> /dev/null
then
  echo "Azure Functions Core Tools not found. Installing..."
  curl -sL https://aka.ms/InstallAzureFuncCoreTools | sudo bash
else
  echo "Azure Functions Core Tools are already installed."
fi

# Step 7: Final Instructions
echo "Installation completed. Please follow these steps to get started:"
echo "1. Update the .env file with your credentials."
echo "2. Authenticate with Google API by running 'gcloud auth application-default login'."
echo "3. Run the API locally using 'func start' (for Azure Functions)."
echo "4. Deploy the functions to Azure if desired."

echo "Done! Good luck with your internship search!"