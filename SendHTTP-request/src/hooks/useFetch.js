import { useState, useEffect } from 'react';

// React项目中基本上有一条规则, 即以use开头的函数被视为钩子, 
// React项目通常会寻找以use开头的函数, 并在这些函数上强制执行某些规则｡
function useFetch(fetchFn, initalValue) {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [fetchedData, setFetchedData] = useState(initalValue);

    useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        // 调用fetchFn函数获取用户地点数据
        // fetchFn()是useFetch()的参数, useFetch在其它component执行时会通过参数fetchFn传递http.js里面获取数据的function

        setFetchedData(data);
        // 将获取到的地点数据存储在userPlaces状态中
      } catch (error) {
        setError({message: error.message || 'Failed to fetch data.'})
      }

      setIsFetching(false);
    }

    fetchData(); // 这里是执行function fetchData()，因为上面只是在创建function

    // 当组件加载时执行一次，获取用户地点数据
    // 如果获取失败，设置错误状态
    // 如果获取成功，将地点数据存储在userPlaces状态中
    // 当数据加载完成后，isFetching为false，显示用户地点列表

    }, [fetchFn]); // 依赖fetchFn，只有当fetchFn变化时才重新执行

    return {
        isFetching,
        error,
        fetchedData,
        setFetchedData,
    };
}

export default useFetch;

// 当不同组建执行useFetch时，都会是新的useFetch实例，不会互相干扰
// 例如，App.jsx中传入的是fetchUserPlaces，而AvailablePlaces.jsx中传入的是fetchSortedPlaces
// 这样就可以在不同组件中复用useFetch
// useFetch会根据传入的fetchFn来获取数据，并返回相应的状态
// 这样可以避免在每个组件中重复编写数据获取逻辑，提高代码的复用性和可维护性
// useFetch函数可以在不同组件中复用