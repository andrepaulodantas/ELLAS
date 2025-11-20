const express = require('express');
const app = require('./src/app');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true, // Permitir qualquer origem em desenvolvimento
  credentials: true, // If you need to handle cookies or authentication headers
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
