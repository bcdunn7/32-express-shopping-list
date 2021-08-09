const express = require('express');
const app = express();
const itemRoutes = require('./itemRoutes');

app.use('/items', itemRoutes);