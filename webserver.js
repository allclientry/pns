const express = require('express');
const path = require('path');
const app = express();

// Set the port to 3000
const PORT = 3000;

// Serve static files from a directory (e.g., 'public')
app.use(express.static(path.join(__dirname, '.')));

// Optional: Serve a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the file server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
