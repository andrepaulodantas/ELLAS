import axios from 'axios';

const BASE_URL = 'http://44.212.115.153:7200/repositories/EllasV2';

export const fetchInitiatives = async (query: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query: query,
      },
      headers: {
        'Accept': 'application/sparql-results+json',
        'Authorization': 'Basic ' + btoa('integracao:Ellas@integration'), // Basic Auth if required
      },
      withCredentials: true, // Include credentials if needed
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
