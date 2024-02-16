import { useEffect, useState } from 'react';

const useLipasFetch = (lat, lon, range = 0.7) => {
  const [places, setPlaces] = useState([]);

  const fetchPlaces = async (url) => {
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
      console.error('Unexcpected data: ', data);
    }
  };

  useEffect(() => {
    if (lon !== null && lat !== null)
    fetchPlaces(`http://lipas.cc.jyu.fi/api/sports-places?closeToLon=${lon}&closeToLat=${lat}&closeToDistanceKm=${range}`);
  }, [lat, lon, range]);

  return places;
};

export default useLipasFetch;