import { useEffect, useState } from 'react';

const useLipasFetch = (token) => {
  const [places, setPlaces] = useState([]);

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180; 
    const dLon = (lon2 - lon1) * Math.PI / 180; 
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
  };

  const fetchPlaces = async (lat, lon) => {
    if (lat !== null && lon !== null) {
      const url = `https://helip-631bdf12c542.herokuapp.com/api/places/nearby?latitude=${lat}&longitude=${lon}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
    if (Array.isArray(data)) {
      data.forEach(item => {
        item.distance = haversine(lat, lon, item.geometry.coordinates[1], item.geometry.coordinates[0]);
      });
      data.sort(function(item1, item2){
        return item1.distance - item2.distance;
      })
      setPlaces(data);
    } else {
      console.error('Unexpected data: ', data);
      }
    }
  };

  return { places, fetchPlaces };
};

export default useLipasFetch;