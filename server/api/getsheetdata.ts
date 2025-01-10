
export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    let datatoken;
    try {
        datatoken = await $fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST',
            body: JSON.stringify({
                'app_id': "cli_a7f52e6905795010",
                'app_secret': "DAAaQfbXkneEmuwQ8OSlddCGYrKdJEs2"
            }),
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });
    } catch (error) {
        console.error("Error fetching tenant access token:", error);
        return { statusCode: 500, body: { error: "Failed to fetch tenant access token." } };
    }

    let thistoken = await datatoken.tenant_access_token;
    console.log("Tenant Access Token:", thistoken);

    let sheettoken = "DUeEsYMCKh9eJftiJOZlVax6gXi"; // Replace with your actual sheet token
    // Fetch all sheets metadata
    let getsheets = await $fetch(`https://open.larksuite.com/open-apis/sheets/v3/spreadsheets/${sheettoken}/sheets/query`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${thistoken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 30000
    });

    console.log(getsheets)
    console.log("==========")
    console.log(getsheets.data.sheets)

    await getsheets.data.sheets.forEach(async element => {
        console.log(element.title +": "+element.sheet_id)
        console.log("column_count -> "+element.grid_properties.column_count)
        console.log("row_count -> "+element.grid_properties.row_count)
        let range = element.sheet_id + `!A${element.grid_properties.column_count}:X${element.grid_properties.row_count}`;
        let sheetData = await $fetch(`https://open.larksuite.com/open-apis/sheets/v2/spreadsheets/${sheettoken}/values_batch_get?ranges=${range}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${thistoken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });
        console.log("sheetData => "+sheetData)
        console.log(sheetData.data.valueRanges)
    });

    // Return all cell data as JSON
    return {
        statusCode: 200
    };
});
