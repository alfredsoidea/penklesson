
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

    //console.log(getsheets)
    console.log("==========")
    console.log(getsheets.data.sheets)
    let element = getsheets.data.sheets[0]
    // use only first sheet
    console.log(await element.title +": "+element.sheet_id)
    console.log(await "column_count -> "+element.grid_properties.column_count)
    console.log(await "row_count -> "+element.grid_properties.row_count)

    let range = await element.sheet_id + `!A1:D${element.grid_properties.row_count}`;
    let sheetData = await $fetch(`https://open.larksuite.com/open-apis/sheets/v2/spreadsheets/${sheettoken}/values_batch_get?ranges=${range}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${thistoken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 30000
    });
    console.log(await "sheetData => "+JSON.stringify(sheetData))
    console.log(await sheetData.data.valueRanges)
    let allcell = sheetData.data.valueRanges[0].values
    let allcellcount = await allcell.length
    console.log("allcellcount: "+allcellcount)
    let counter = 0
    // run timer
    let intervals = setInterval(() => {
        if (counter >= allcellcount) {
            console.log("stoping")
            clearInterval(intervals);
        } else {
            console.log("process : "+counter)
            console.log(allcell[counter])
            $fetch('/api/savegooglesheet', {
                method: 'POST',
                body: {
                    'celldata': allcell[counter],
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
            counter = counter + 1
        }
    }, 1000);

    // Return all cell data as JSON
    return {
        statusCode: 200
    };
});
