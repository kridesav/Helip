import { useEffect, useState } from 'react';
const useLipasFetch = (token) => {
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async (lat, lon) => {
    if (lat !== null && lon !== null) {
      const url = `https://helip-631bdf12c542.herokuapp.com/api/places`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setPlaces(data);
      } else {
        console.error('Unexpected data: ', data);
      }
    }
  };

  return { places, fetchPlaces };
};

export default useLipasFetch;