"use client";

import React, { useState } from 'react';
import styles from "./page.module.css"
interface House {
  id: string;
  name: string;
  animal: string;
  founder: string;
  houseColours: string;
}

export default function HouseList() {
  const [houseName, setHouseName] = useState('');
  const [houseInfo, setHouseInfo] = useState<House | null>(null);
  const [error, setError] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHouseName(event.target.value);
    setError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    try {
      const response = await fetch(`http://localhost:3001/houses?name=${houseName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.length > 0) {
        setHouseInfo(data[0]);
        setError(false);
      } else {
        setHouseInfo(null);
        setError(true);
      }
      setHouseName('');
    } catch (error) {
      console.error('Error fetching house data:', error);
      setError(true);
    }
  };
  
 const getGradientColors = (colorsString: string): string => {
    const colors = colorsString.split(' and ');
    let firstColor = colors[0].charAt(0).toLowerCase() + colors[0].slice(1);
    let secondColor = colors.length > 1 ? colors[1] : 'black'; // Фолбэк для второго цвета

    
    const isValidColor = (color: string): boolean => {
        const style = new Option().style;
        style.color = color;
        return style.color !== '';
    };

    if (!isValidColor(firstColor)) {
        firstColor = 'white'; 
    }

    if (!isValidColor(secondColor)) {
        secondColor = 'black'; 
    }

    return `linear-gradient(to right, ${firstColor}, ${secondColor})`;
};

  return (
    <main className={styles.mainDiv}>
    <h1 className={styles.title}>Welcome to wizard world</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.iptBtn}>
          <input 
          className={styles.input}
            type="text"
            value={houseName}
            onChange={handleInputChange}
            placeholder="Enter house name"
          />
          <button className={styles.btn} type="submit">Search</button>
        </div>
      </form>
      {error && <p className={styles.errorMessage}>Invalid house name. Please try again.</p>}
      {houseInfo && (
        <div className={styles.card}>
          <div className={styles.nameAnimal}>
          <h2>{houseInfo.name}</h2>
          <p>{houseInfo.animal}</p>
          </div>
          <div className={styles.colorDiv}  style={{ background: getGradientColors(houseInfo.houseColours) }} ></div>
          <div className={styles.founNameDiv}>
          <p className={styles.founder}>Founder: </p>
          <h4 className={styles.founderName}>{houseInfo.founder}</h4>
          </div>
        </div>
      )}
    </main>
  );
}