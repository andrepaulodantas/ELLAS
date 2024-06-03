const express = require('express');
const app = require('./src/app');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend origin
  credentials: true, // If you need to handle cookies or authentication headers
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
