import { useEffect, useState } from 'react';

const useLipasFetch = () => {
  const [places, setPlaces] = useState([]);

  const lon = 25.029457349196832;
  const lat = 60.22968443101802;
  const range = 1;

  const fetchPlaces = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    const ids = data.map(item => item.sportsPlaceId);
    const placeDetails = await Promise.all(ids.map(id =>
      fetch(`http://lipas.cc.jyu.fi/api/sports-places/${id}`)
        .then(response => response.json())
    ));
    setPlaces(prevPlaces => [...prevPlaces, ...placeDetails]);

    // Check if there are more pages to fetch
    const linkHeader = response.headers.get('Link');
    if (linkHeader) {
      const nextLink = linkHeader.split(', ').find(s => s.endsWith('rel="next"'));
      if (nextLink) {
        const nextUrl = nextLink.split(';')[0].slice(1, -1);
        fetchPlaces(nextUrl);
      }
    }
  };
  useEffect(() => {
    fetchPlaces(`http://lipas.cc.jyu.fi/api/sports-places?closeToLon=${lon}&closeToLat=${lat}&closeToDistanceKm=${range}`);
  }, []);

  return places;
};

export default useLipasFetch;