import { useState, useEffect } from 'react';
import { API_PORT } from '../config';

export default function useBreeds(): string[] {
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:${API_PORT}/api/breeds`);
      const breeds = await response.json();
      setBreeds(breeds);
    }

    fetchData().catch(console.error);
  }, [])

  return breeds;
}
