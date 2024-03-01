const express = require('express');
const cors = require('cors');
const housesData = require('./housesData.json');

const app = express();
app.use(cors());


app.get('/houses', (req, res) => {
  const { name } = req.query;

  if (name) {
    const filteredHouses = housesData.filter(house => house.name.toLowerCase().includes(name.toLowerCase()));
    res.json(filteredHouses);
  } else {
    res.json(housesData);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});