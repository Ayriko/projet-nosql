import express from 'express';
import Post from './models/post';
import cors from 'cors';
import User from './models/user';



const app = express();
app.use(express.json())
app.use(cors());
const port = 3000; 

app.get('/', (_, res) => {
  res.send('Hello World!');
});

// USERS
app.get('/users', (_, res) => {
  User.find()
    .then((users) => {
      //console.log('Users:', users);
      res.send(users);
    })
    .catch((error) => console.error('Error fetching users:', error));
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  console.log('Fetching user:', id)
  User.findById(id)
    .then((user) => {
      console .log('User:', user);
      res.send(user);
    })
    .catch((error) => console.error('Error fetching user:', error));
});


// POSTS
app.get('/posts', (_, res) => {
  Post.find()
    .then((posts) => {
      //console.log('Posts:', posts);
      res.send(posts);
    })
    .catch((error) => console.error('Error fetching posts:', error));
});

app.post('/post', (req, res) => {
  const post = new Post({
    author: req.body.author,
    date: req.body.date,
    content: req.body.content,
    likes: req.body.likes,
    comments: req.body.comments
  });
  post.save()
    .then((post) => {
      console.log('Post:', post);
      res.send(post);
    })
    .catch((error) => console.error('Error creating post:', error));
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});