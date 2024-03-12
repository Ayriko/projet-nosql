import express from 'express';
import Post from './models/post';
import cors from 'cors';
import User from './models/user';
import Comment from './models/comment';



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
      console.log('Users:', users);
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
      console.log('Posts:', posts);
      res.send(posts);
    })
    .catch((error) => console.error('Error fetching posts:', error));
});

app.get('/post/:id', (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      console.log('Post:', post);
      res.send(post);
    })
    .catch((error) => console.error('Error fetching post:', error));
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

app.post('/addcommenttopost/:id', async (req, res) =>  {
    const id = req.params.id;
    await Post.findOneAndUpdate(
      { _id: id }, 
      {
        $push: {"comments": req.body.commentId}
      },
      { new: true }
    );
    res.send('Comment added to post');
});


// COMMENTS
app.post('/comment', (req, res) => {
  const comment = new Comment({
    author: req.body.author,
    date: req.body.date,
    content: req.body.content,
    postId: req.body.postId
  });
  comment.save()
    .then((comment) => {
      console.log('Comment:', comment);
      res.send(comment);
    })
    .catch((error) => console.error('Error creating comment:', error));
});

app.get('/comment/:id', (req, res) => {
  const id = req.params.id;
  Comment.findById(id)
    .then((comment) => {
      console.log('Comment:', comment);
      res.send(comment);
    })
    .catch((error) => console.error('Error fetching comment:', error));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});