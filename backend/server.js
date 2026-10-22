const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());
app.use(cors()); 

//ROutes
app.use('/api/products', productRoutes);

//mongoose connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(' MongoDB Connected successfully to Velet & Vine'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// test route
app.get('/', (req, res) => {
  res.send('Velvet & Vine API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});