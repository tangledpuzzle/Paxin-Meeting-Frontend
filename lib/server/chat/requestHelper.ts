'use server';

import axios from 'axios';

const requestHelper = async ({
  token,
  session,
  url,
  method,
  data,
}: {
  token: string;
  session?: string;
  url: string;
  method: string;
  data?: any;
}) => {
  try {
    // Prepare the headers
    const headers: { [key: string]: string } = {
      Authorization: `Bearer ${token}`,
    };

    // If a session is provided, include it in the headers
    if (session) {
      headers['Session'] = session;
    }

    // Set the content type to JSON for POST, PUT methods
    if (['POST', 'PATCH'].includes(method.toUpperCase())) {
      headers['Content-Type'] = 'application/json';
    }

    // Prepare request configuration
    const config: { [key: string]: any } = {
      method,
      url,
      headers,
    };

    // Add request body for methods that require it
    if (['POST', 'PATCH'].includes(method.toUpperCase()) && data) {
      config.data = data;
    }

    // Send the request using axios and return the response data
    const response = await axios(config);

    // Return the necessary data from the response
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default requestHelper;
