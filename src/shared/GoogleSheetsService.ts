import { google } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config();

export class GoogleSheetsService {
  private auth: any;
  private sheets: any;

  constructor() {
    this.authenticate();
  }

  private async authenticate() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS, 
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: await this.auth.getClient() });
  }

  public async saveApplication(application: any) {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

    const HEADER_RANGE = "'Feuille 1'!A1:Z1";
    const APPEND_RANGE = "'Feuille 1'!A2:Z";


    const headers = ['Company Name', 'Email', 'Deadline', 'Description', 'Link', 'Skills', 'City', 'Remote']; 

    try {

      // Check if headers are already set
      const headerCheck = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: HEADER_RANGE,
      });

      if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
        console.log('Setting headers in Google Sheets...');
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: HEADER_RANGE,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }

      // Append new application data
      const values = [
        [
          application.companyName,
          application.email,
          application.deadline,
          application.description,
          application.link,
          application.skills,
          application.city,
          application.remote,
        ],
      ];

      const resource = { values };

      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: APPEND_RANGE,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: resource,
      });

      console.log(`${result.data.updates?.updatedCells} cells appended.`);
    } catch (error) {
      console.error('Failed to save application:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  }
}
