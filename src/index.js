const app = require('./app.js');

// set port to listen
const PORT = 3000;

// start server
app.listen(PORT, () => {
    console.log(`serser start on port ${PORT}`);
});

