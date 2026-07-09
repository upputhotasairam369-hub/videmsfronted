import { useState, useEffect } from 'react';
import { combinationAPI } from '../services/api';

export const useCombinations = () => {
  const [combinations, setCombinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        setLoading(true);
        const response = await combinationAPI.list();
        setCombinations(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch combinations');
      } finally {
        setLoading(false);
      }
    };

    fetchCombinations();
  }, []);

  return { combinations, loading, error };
};
