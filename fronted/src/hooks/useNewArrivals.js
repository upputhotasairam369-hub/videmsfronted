import { useState, useEffect } from 'react';
import { newArrivalAPI } from '../services/api';

export const useNewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await newArrivalAPI.list();
        setNewArrivals(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch new arrivals');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return { newArrivals, loading, error };
};
