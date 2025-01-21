import axios from 'axios';
import { fetchHerd, fetchStock, placeOrder, fetchOrderHistory } from './yakApi';

jest.mock('axios');

describe('yakApi', () => {
  const mockData = {
    herd: [{ id: 1, name: 'Yak 1' }, { id: 2, name: 'Yak 2' }],
    stock: { milk: 100, wool: 200 },
    orderResponse: { id: 123, status: 'completed' },
    orderHistory: [
      { id: 1, milk: 10, wool: 5 },
      { id: 2, milk: 15, wool: 7 },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchHerd', () => {
    it('should fetch herd data successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData.herd });

      const result = await fetchHerd();
      expect(result).toEqual(mockData.herd);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/herd');
    });

    it('should throw an error if fetching herd data fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchHerd()).rejects.toThrow('Error fetching herd data: Error: Network Error');
    });
  });

  describe('fetchStock', () => {
    it('should fetch stock data successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData.stock });

      const result = await fetchStock();
      expect(result).toEqual(mockData.stock);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/stock');
    });

    it('should throw an error if fetching stock data fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchStock()).rejects.toThrow('Error fetching stock data: Error: Network Error');
    });
  });

  describe('placeOrder', () => {
    it('should place an order successfully', async () => {
      const orderPayload = {
        milk: 10,
        wool: 5,
        date: '2025-01-21',
        id: 1,
        milkCost: 50,
        woolCost: 100,
        totalCost: 150,
        orderStatus: 'completed',
      };

      axios.post.mockResolvedValueOnce({ data: mockData.orderResponse });

      const result = await placeOrder(
        orderPayload.milk,
        orderPayload.wool,
        orderPayload.date,
        orderPayload.id,
        orderPayload.milkCost,
        orderPayload.woolCost,
        orderPayload.totalCost
      );

      expect(result).toEqual(mockData.orderResponse);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/orders', orderPayload);
    });

    it('should throw an error if placing an order fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        placeOrder(10, 5, '2025-01-21', 1, 50, 100, 150)
      ).rejects.toThrow('Failed to place order: Error: Network Error');
    });
  });

  describe('fetchOrderHistory', () => {
    it('should fetch order history successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: mockData.orderHistory });

      const result = await fetchOrderHistory();
      expect(result).toEqual(mockData.orderHistory);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/orders');
    });

    it('should throw an error if fetching order history fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchOrderHistory()).rejects.toThrow('Error fetching order history: Error: Network Error');
    });
  });
});
