import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

// localStorage.getItem();


export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      
      try {
        // const places = await fetchAvailablePlaces();

        const response = await fetch('http://localhost:3000/places');
        const resData = await response.json();

        if (!response.ok) {
            // 如果响应不是ok状态，抛出错误
            throw new Error(resData.message || 'Failed to fetch places.');
        }

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            resData.places, 
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);

          setIsFetching(false);
        });

        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({message: error.message || 'Could not fetch places'});
        setIsFetching(false);
      }
    }
    // fetch('http://localhost:3000/places')
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((resData) => {
    //     setAvailablePlaces(resData.places);
    //   });
    // 另一种方法

    fetchPlaces();
  }, []);
  // fetchPlaces()，当组件加载时执行一次，获取可用地点数据
  // 当正在请求后段数据时，isFetching为true，显示加载文本
  // const response是从后端获取的可用地点数据，resData.places是解析后的地点数组
  // setAvailablePlaces(resData.places)将地点数据存储在availablePlaces状态
  // 当数据加载完成后，isFetching为false，显示可用地点列表
  
  if (error) {
    return <Error title="An error occured" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isloading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
