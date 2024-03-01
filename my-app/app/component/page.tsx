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
  const [houseInfoList, setHouseInfoList] = useState<House[]>([]);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState(false); // Состояние для отслеживания ошибки ввода

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim(); 
    setHouseName(value);
    setInputError(false); 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    if (houseName === '') {
      setInputError(true); 
      return;
    }
    try {
      const response = await fetch(`https://wizard-world-api.herokuapp.com/houses`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        const filteredHouses = data.filter((house: House) => {
          const regex = new RegExp(houseName, 'i');
          return regex.test(house.name);
        });
        setHouseInfoList(filteredHouses);
        setError(filteredHouses.length === 0); 
      } else {
        setHouseInfoList([]);
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
    let secondColor = colors.length > 1 ? colors[1] : 'black'; 

    
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
            className={`${styles.input} ${inputError ? styles.error : ''}`} // Добавляем класс стиля для ошибки
            type="text"
            value={houseName}
            onChange={handleInputChange}
            placeholder="Enter house name"
          />
          <button className={styles.btn} type="submit">Search</button>
        </div>
        {inputError && <p className={styles.errorMessage}>Please enter a valid house name.</p>} {/* Отображаем ошибку ввода */}
      </form>
      {error && !inputError && <p className={styles.errorMessage}>Invalid house name. Please try again.</p>}
      {houseInfoList.map((houseInfo, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.nameAnimal}>
            <h2>{houseInfo.name}</h2>
            <p>{houseInfo.animal}</p>
          </div>
          <div className={styles.colorDiv} style={{ background: getGradientColors(houseInfo.houseColours) }} ></div>
          <div className={styles.founNameDiv}>
            <p className={styles.founder}>Founder: </p>
            <h4 className={styles.founderName}>{houseInfo.founder}</h4>
          </div>
        </div>
      ))}
    </main>
  );
}