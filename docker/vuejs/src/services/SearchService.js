const axios = require('axios');

export async function getAllSearches() {

    const response = await axios.get('/api/searches');
    return response.data;
}

