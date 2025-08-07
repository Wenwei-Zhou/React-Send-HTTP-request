export async function fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    if (!response.ok) {
        // 如果响应不是ok状态，抛出错误
        throw new Error(resData.message || 'Failed to fetch places.');
    }
    
    return resData.places;
}

export async function fetchUserPlaces() {
    const response = await fetch('http://localhost:3000/user-places');
    const resData = await response.json();

    if (!response.ok) {
        // 如果响应不是ok状态，抛出错误
        throw new Error(resData.message || 'Failed to fetch places.')    
    }

    return resData.places; // 返回用户地点数据
    // places是从后端获取的用户地点数据，resData.places是解析后的地点数组
    // 返回用户地点数据, 这将是后端返回的用户地点数组｡
    // 该函数将返回一个Promise, 当解析完成后, 它将解析为用户地点数组｡
}

export async function updateUserPlaces(places) {
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({places: places}), // 调用JSON字符串化位置｡ 这将把这个places数组转换成JSON格式
        headers: {
            'Content-Type' : 'application/json'
        }
        // 设置请求头，告诉服务器发送的是JSON格式的数据
        // 添加Content-Type头并将其设置为application/json, 以通知后端附加到该请求的数据将采用JSON格式｡
        // 发送PUT请求到后端的/user-places端点

        // 后端期望得到一个包含places键的对象,
        // 然后它将实际包含这个数组｡
        // 因此, 我们需要一个包装对象来包装该数组｡
        // {places: places}括号将其包装起来, 并添加一个places键, 并将我们的places作为该键的值传递｡ 
    });

    const resData = await response.json(); // 解析响应数据

    if (!response.ok) {
        throw new Error('Failed to update user data.')
    }

    return resData.message; // 返回响应消息
    // 返回响应消息, 这将是后端返回的更新成功消息｡
}