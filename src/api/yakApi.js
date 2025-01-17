import axios from "axios";

// const API_URL = "http://localhost:5000";
const API_URL = "https://yakshop-db.onrender.com";

export const fetchHerd = async () => {
  try {
    const response = await axios.get(`${API_URL}/herd`);
    return response.data; // Return herd data
  } catch (error) {
    throw new Error('Error fetching herd data: ' + error)
  }
};

export const fetchStock = async () => {
  try {
    const response = await axios.get(`${API_URL}/stock`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching stock data: ' + error)
  }
};

export const placeOrder = async (milk, wool, date, id) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, {
      milk,
      wool,
      date,
      id,
      orderStatus: 'completed',
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to place order: ' + error);
  }
};

export const fetchOrderHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching order history: ' + error)
  }
};
