import axios from 'axios';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { google } from 'googleapis'; // Use import instead of require

// Function to authenticate and get Google Sheets API client
async function authenticate() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'server/config/test-project-penk-557126c3f4a8.json', // Path to your credentials file
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return await auth.getClient();
}

async function writeData(spreadsheetId, range, values) {
    const authClient = await authenticate(); // Authenticate with Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    // Prepare the resource for the API call
    const resource = {
        values,
    };

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW', // or 'USER_ENTERED'
            resource,
        });
        console.log('Data written:', response.data);
    } catch (error) {
        console.error('Error writing data:', error);
        throw error; // Rethrow error for handling in retry logic
    }
}

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    console.log("saving google sheet") 
    console.log(body.celldata);

    let range = 'Sheet1!A1'; // Specify the starting cell for writing data
    let spreadsheetId = '1Kdb97aoBOAdKDCZJCs9KmZy8J2sDytpYkeol7NfB0Vc';

    // Format celldata into a 2D array for Google Sheets
    let formattedValues = [body.celldata]; // Wrap the single row in another array

    await writeData(spreadsheetId, range, formattedValues); // Pass formatted values

    return {
        statusCode: 200
    };
});
