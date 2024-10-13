const express = require('express');
const connectDB = require('./src/DBL/db');
const userRoutes = require('./src/routes/userRoutes');
const app = express();

require('dotenv').config();
connectDB();

app.use(express.json());
app.use('/api', userRoutes); // Prefix your routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running........`);
});
