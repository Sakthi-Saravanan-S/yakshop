import axios from "axios";
import { API_URL } from '../utils'

export const fetchHerd = async () => {
  try {
    const response = await axios.get(`${API_URL}/herd`);
    return response.data;
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

export const placeOrder = async (milk, wool, date, id, milkCost, woolCost, totalCost) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, {
      milk,
      wool,
      date,
      id,
      milkCost,
      woolCost,
      totalCost,
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
