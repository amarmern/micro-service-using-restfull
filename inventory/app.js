const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

const jwtSecret = 'my-secret-key';

app.get('/inventory', (req, res) => {
  res.send('Hello from the Inventory Microservice!');
});

app.post('/inventory/auth', (req, res) => {
  const token = jwt.sign({ user: 'inventory-service' }, jwtSecret, {
    expiresIn: '1h',
  });
  res.send({ token });
});

app.use(
  expressJwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({
    path: ['/inventory/auth'],
  })
);

app.listen(port, () => {
  console.log(`Inventory Microservice listening on port ${port}`);
});
