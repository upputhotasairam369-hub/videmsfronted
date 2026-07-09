import { useState, useEffect } from 'react';
import { bestSellerAPI } from '../services/api';

export const useBestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await bestSellerAPI.list();
        setBestSellers(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch best sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { bestSellers, loading, error };
};
