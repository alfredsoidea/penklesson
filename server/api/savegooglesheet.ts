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

// async function authenticate() {
//     const auth = new google.auth.GoogleAuth({
//         credentials: {
//             type: process.env.GOOGLE_CREDENTIALS_TYPE,
//             project_id: process.env.GOOGLE_PROJECT_ID,
//             private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
//             private_key: process.env.GOOGLE_PRIVATE_KEY, // Handle newlines
//             client_email: process.env.GOOGLE_CLIENT_EMAIL,
//             client_id: process.env.GOOGLE_CLIENT_ID,
//             auth_uri: process.env.GOOGLE_AUTH_URI,
//             token_uri: process.env.GOOGLE_TOKEN_URI,
//             auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
//             client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
//         },
//         scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });
//     return await auth.getClient();
// }

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
    let range = 'Sheet1!A1'; // Specify the starting cell for writing data
    let spreadsheetId = '1Kdb97aoBOAdKDCZJCs9KmZy8J2sDytpYkeol7NfB0Vc';
    let formattedValues = [body.celldata]; // Wrap the single row in another array

    await writeData(spreadsheetId, range, formattedValues); // Pass formatted values

    return {
        statusCode: 200
    };
});
