const express = require('express');
const app = express({
  name: 'API Server',
});


const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
  console.log("%s listening at %s", app.name, app.url);
});
