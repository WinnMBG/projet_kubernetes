import React, { useState, useEffect } from 'react';
import axios from 'axios'

function MyComponent() {
  const [datas, setData] = useState([]);

  const fetchData = async () => {
    try {
      const {data} = await axios.get('http://4.225.74.169:801/all')
      if (!data) {
        throw new Error('Network response was not ok');
      }
      setData(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to my react app !</h1>
      <h4>Datas</h4>
      <ul>
        {datas.map(post => (
          <>
          <li key={post.id}>{post.name}</li>
          <p>{post.description}</p>
          </>
        ))}
      </ul>
    </div>
  );
}

export default MyComponent;
