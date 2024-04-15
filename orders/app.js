const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();
const jwtSecret = 'my-secret-key';
const port = process.env.PORT || 3001;

app.get('/orders', (req, res) => {
  res.send('Hello from the Orders Microservice!');
});

app.get('/orders/inventory', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const inventoryResponse = await axios.get(
      'http://localhost:3002/inventory',
      { headers: { authorization: token } }
    );
    res.send(
      `Orders Microservice received data from Inventory Microservice: ${inventoryResponse.data}`
    );
  } catch (error) {
    console.error(
      `Error fetching data from Inventory Microservice: ${error.message}`
    );
    res.status(500).send('Error fetching data from Inventory Microservice');
  }
});

app.post('/orders/auth', (req, res) => {
  const token = jwt.sign({ user: 'orders-service' }, jwtSecret, {
    expiresIn: '1h',
  });
  res.send({ token });
});

app.use(
  expressJwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({
    path: ['/orders/auth'],
  })
);

app.listen(port, () => {
  console.log(`Orders Microservice listening on port ${port}`);
});
