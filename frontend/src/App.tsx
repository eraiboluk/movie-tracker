import { useState, useEffect } from 'react';
import axios from 'axios';

interface Weather {
  date: string;
  temperatureC: number;
  summary: string;
}

function App() {
  const [data, setData] = useState<Weather[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:5185/weatherforecast')
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Movie Tracker - Backend Test</h2>
      
      {error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <strong>{item.date}</strong>: {item.temperatureC}°C - {item.summary}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;