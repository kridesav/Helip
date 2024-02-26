import { useEffect, useState } from 'react';
const useLipasFetch = () => {
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async (lat, lon, range = 0.7) => {
    if (lat !== null && lon !== null) {
      const url = `http://lipas.cc.jyu.fi/api/sports-places?closeToLon=${lon}&closeToLat=${lat}&closeToDistanceKm=${range}`;
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        const ids = data.map(item => item.sportsPlaceId);
        const placeDetails = await Promise.all(ids.map(id =>
          fetch(`http://lipas.cc.jyu.fi/api/sports-places/${id}`)
            .then(response => response.json())
        ));
        setPlaces(placeDetails);

        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
          const nextLink = linkHeader.split(', ').find(s => s.endsWith('rel="next"'));
          if (nextLink) {
            const nextUrl = nextLink.split(';')[0].slice(1, -1);
            await fetchPlaces(nextUrl);
          }
        }
      } else {
        console.error('Unexpected data: ', data);
      }
    }
  };

  return { places, fetchPlaces };
};

export default useLipasFetch;