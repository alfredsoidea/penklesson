import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

// Function to get profile picture URL
async function getProfilePicture(instanceId, waId, accessToken) {
    const url = `https://api.your-whatsapp-api-provider.com/api/v2/instance/${instanceId}/chat/profile-picture?id=${waId}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.profileUrl; // The URL of the profile picture
    } catch (error) {
        console.error('Error fetching profile picture:', error.response?.data || error.message);
        throw error;
    }
}

// Main event handler for the webhook
export default defineEventHandler(async (event) => {
    const { method } = event.node.req;
    
    // Handle verification request (GET)
    if (method === 'GET') {
        const query = event.node.req.url.split('?')[1];
        const params = new URLSearchParams(query);
        const verifyToken = params.get('hub.verify_token');
        const challenge = params.get('hub.challenge');
        
        // Ensure this matches what you set in the WhatsApp dashboard
        if (verifyToken === 'YOUR_VERIFY_TOKEN') { // Replace with your actual verify token
            return challenge; // Respond with the challenge token
        }
    }

    // Handle incoming messages (POST request)
    if (method === 'POST') {
        const body = await readBody(event);
        console.log('Received body:', JSON.stringify(body));

        const url2 = `https://graph.facebook.com/v12.0/oauth/access_token`;
        
        try {
            const response = await axios.get(url2, {
                params: {
                    grant_type: 'fb_exchange_token',
                    client_id: '3920783614858323',
                    client_secret: '2b363f2362dac1a1d15e7e21cb7dd7d1',
                    fb_exchange_token: 'EAA3t7pKa1FMBO2oZB9bSDXBtRikeeBvFVi5kciRZCmc9CJkA7irVvZCxNr7dh0Kbp95NY3zNJAisK2xrGwcQnZAsIh0wEZByZBQLswacnpEGp0YIHgVSrbHnb2WNHtu2SREUoyXiCb81lho8ZAYkY5cBdwW2jR0SuX8AT8sdXLMukO5pcuEXMyoGOifOdnS14YPS0pSZAOy43Y0cD6M0EUEWO6cCzJL9yo7HxuAZD'
                }
            });
            
            let accesstoken = response.data.access_token
            console.log(accesstoken)
        } catch (error) {
            console.error('Error fetching long-lived access token:', error.response?.data || error.message);
            throw error;
        }
        
        const contact = body.entry[0].changes[0].value.contacts[0];
        const profileName = contact.profile.name;
        const waId = contact.wa_id;

        // Log extracted information
        console.log('Profile Name:', profileName);
        console.log('WhatsApp ID:', waId);

        try {
            const profileUrl = await getProfilePicture(instanceId, waId, accessToken); // Ensure instanceId and accessToken are defined
            console.log('Profile Picture URL:', profileUrl);
        } catch (err) {
            console.error('Failed to retrieve profile picture:', err);
        }
        
        // Process incoming messages here

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Webhook received" })
        };
    }

    return {
        statusCode: 405,
        body: 'Method Not Allowed'
    };
});
