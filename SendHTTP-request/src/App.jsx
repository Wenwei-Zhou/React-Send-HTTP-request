import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchuserPlaces, updateUserPlaces } from './http.js';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  // 用于存储用户选择的地点和更新地点时可能出现的错误

  const [isFetching, setIsFetching] = useState(false);
  // 用于指示是否正在获取用户地点数据
  const [error, setError] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchuserPlaces();
        // 调用fetchuserPlaces函数获取用户地点数据

        setUserPlaces(places);
        // 将获取到的地点数据存储在userPlaces状态中
      } catch (error) {
        setError({message: error.message || 'Failed to fetch user places.'})
      }

      setIsFetching(false);
    }

    fetchPlaces(); // 这里是执行function fetchPlaces()，因为上面只是在创建function

    // 当组件加载时执行一次，获取用户地点数据
    // 如果获取失败，设置错误状态
    // 如果获取成功，将地点数据存储在userPlaces状态中
    // 当数据加载完成后，isFetching为false，显示用户地点列表
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
      // 更新用户地点数据
      // 调用updateUserPlaces函数，将新选择的地点和现有地点合并后发送到后端
      // selectedPlace是用户选择的地点，userPlaces是当前已选地点的状态
    } catch (error) {
      setUserPlaces(userPlaces);
      // 如果更新失败，恢复之前的地点状态

      setErrorUpdatingPlaces({message: error.message || 'Failed to update user places.'});
      // 设置错误状态，显示更新失败的消息
    }
    
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
        await updateUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        // 调用updateUserPlaces函数，更新用户地点数据
        // userPlaces.filter是一个过滤函数
        // 它会遍历userPlaces数组，检查每个地点的ID是否与
        // selectedPlace.current.id相同
        // 如果相同，则该地点被删除
        // 如果不同，则该地点被保留
        // 这样就可以删除用户选择的地点
        // userPlaces 是原始数组
        // selectedPlace.current.id 是你想“删除”的项的 ID
        // filter() 会创建一个 新的数组 updatedPlaces，这个数组中不包含 id === selectedPlace.current.id 的那一项
      );

      setModalIsOpen(false);
    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdatingPlaces({message: error.message || 'Failed to delete'});
    }
   

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
    <Modal open={errorUpdatingPlaces} onClose={handleError}>
      {errorUpdatingPlaces && (
        <Error 
          title="An error occurred" 
          message={errorUpdatingPlaces.message}
          onConfirm={handleError}
        />
      )}
      {/* Error component 仅在errorUpdatingPlaces为true时才会呈现, */}
    </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occured!" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isloading={isFetching}
          loadingText="Fetching your places..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}
        {/* Places component 用于显示用户已选地点列表 */}
        {/* 如果发生错误，显示错误消息 */}
        {/* 如果没有错误，显示用户已选地点列表 */}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
