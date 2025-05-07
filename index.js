require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://list-frontend-five.vercel.app';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use('/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});