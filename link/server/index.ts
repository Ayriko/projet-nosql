import express from 'express';
import User from './models/user';


const app = express();
const port = 3000; 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      console.log('Users:', users);
      res.send(users);
    })
    .catch((error) => console.error('Error fetching users:', error));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});