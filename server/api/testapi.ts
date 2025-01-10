
export default defineEventHandler(async (event) => {
    return {
        statusCode: 200,
        body: 'Test Message'
    };
});
