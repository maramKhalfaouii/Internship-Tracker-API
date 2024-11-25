# Internship Tracker API

The **Internship Tracker API** is a personal project designed to simplify and automate the process of applying for end-of-studies internships. The API tracks job applications, extracts job details using Diffbot, and stores them in Google Sheets for easy monitoring. If the Diffbot API fails, the application can manually extract job details. Additionally, it features a notification system that reminds you when application deadlines are approaching, ensuring no opportunities are missed.

## Features

- **Automated Application Tracking**: Add and track job applications with ease.
- **Diffbot Integration**: Fetch job details automatically from job listing pages.
- **Manual Data Entry**: Fallback mechanism for manual job detail extraction.
- **Google Sheets Integration**: Store and manage your applications in Google Sheets.
- **Deadline Notifications**: Get reminders about upcoming application deadlines.
- **Serverless Backend**: Built using Azure Functions, Logic Apps, and other Azure services.

## Technologies Used

- **Azure Functions**: Serverless compute for backend processing.
- **Azure Logic Apps**: Orchestrates workflows for automated tasks.
- **Diffbot API**: Scrapes and extracts structured job data from websites.
- **Google Sheets API**: Stores job application data in Google Sheets.
- **Node.js & TypeScript**: Backend development and scripting.

## Installation

To set up and run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/maramKhalfaouii/Internship-Tracker-API.git
cd Internship-Tracker-API
```

### 2. Run the setup script

The `setup.sh` script will install dependencies and set up the environment variables.

```bash
chmod +x setup.sh
./setup.sh
```

This script will install the necessary dependencies and guide you through setting up the required environment variables for your local development.

### 3. Set up environment variables

If you prefer to manually set up the environment variables, create a `.env` file in the root directory and add the following variables:

```env
GOOGLE_SHEETS_CREDENTIALS=path/to/your/credentials.json
GOOGLE_SHEET_ID=your-google-sheet-id
DIFFBOT_API_TOKEN=your-diffbot-api-token
```

- **GOOGLE_SHEETS_CREDENTIALS**: The path to your Google Sheets API credentials JSON file.
- **GOOGLE_SHEET_ID**: The ID of your Google Sheets document to store job application data.
- **DIFFBOT_API_TOKEN**: Your Diffbot API token for job listing scraping.

### 4. Set up your Google Sheets API credentials

Follow the [Google Sheets API guide](https://developers.google.com/sheets/api/quickstart) to create credentials and obtain the `credentials.json` file. Store the `credentials.json` file in the path specified in your `.env` file.

### 5. Set up Diffbot API credentials

Obtain a Diffbot API key from [Diffbot's website](https://www.diffbot.com/). Add your Diffbot API token in the `.env` file.

## Usage

### Add a Job Application

To add a job application, send a POST request to the `/addApplication` endpoint with the following JSON body:

```json
{
  "link": "http://example.com/job-posting",
  "applied": false
}
```

- The system will attempt to fetch the job details using Diffbot.
- If Diffbot fails, the system will fall back to manual extraction.

### Notifications

The Logic App periodically checks for job deadlines and sends notifications for applications that are nearing their deadlines.

## Project Structure

- `src/`: Contains the backend code for the API, including Azure Function and service integration.
- `shared/`: Contains utility classes and services like Google Sheets and Diffbot integration.
- `.env`: Stores environment variables (credentials and API keys).
- `README.md`: Project documentation.
- `setup.sh`: Bash script to automate setup and install dependencies.
