import express from 'express';
import bodyParser from 'body-parser';
import User from './models/user.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Post from './models/post';
import cors from 'cors';
import Comment from './models/comment';
import UserMongo from "./models/user.ts";
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
)

// Open a new Session
const session = driver.session()

const app = express();
const port = 3000;
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.get('/users', (_, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((error) => console.error('Error fetching users:', error));
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => console.error('Error fetching user:', error));
});

app.post('/login', (req, res) => {
  const params: {email: string, password: string} = req.body
  User.findOne({email: params.email}).then(async (user) => {
    if (!user?.password) {
      return res.status(400).send({
        message: 'This is an error!'
      });
    }

    if (!(await bcrypt.compare(params.password, user.password))) {
      return res.status(401).send({
        message: 'Username or password is not correct'
      });
    }

    const token = jwt.sign({id: user._id.toString()}, "secret")
    res.send({'token': token});
  })
})

app.post('/test', async (req, res) => {
  console.log(req.body)
  session.run(`
      CREATE (u:User {id: $meId})
      CREATE (c:Comment {id: $postId})
      WITH u, c
      MATCH (a:User {id: $meId}), (b:Comment {id: $postId})
      CREATE (a)-[:A_LIKE]->(b)
      RETURN u
    `,
    {
      meId: req.body.meId,
      postId: req.body.postId
    }).then((result => {
      result.records.forEach((record) => {
        console.log(record.get('u').properties)
        res.send();
      })
  }))
});

app.post('/register',  async (req, res) => {
  const cryptedPassword  = await bcrypt.hash(req.body.password, 10)
  const user = new UserMongo({
    email: req.body.email,
    password: cryptedPassword,
    username: req.body.username,
  })
  user.save().then((user) => {
    const token = jwt.sign({id: user._id.toString()}, "secret")
    res.send({'token': token});
  })
})

// POSTS
app.get('/posts', (_, res) => {
  Post.find()
    .then((posts) => {
      res.send(posts);
    })
    .catch((error) => console.error('Error fetching posts:', error));
});

app.get('/post/:id', (req, res) => {
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      res.send(post);
    })
    .catch((error) => console.error('Error fetching post:', error));
});

app.post('/post', (req, res) => {
  const bearerAuth = req.headers.authorization;
  if (!bearerAuth) {
    throw new Error('No connection')
  }

  const token = bearerAuth.substring(7, bearerAuth.length);
  const decodeToken: jwt.JwtPayload = jwt.verify(token, 'secret') as jwt.JwtPayload

  const post = new Post({
    authorId: decodeToken.id,
    date: req.body.date,
    content: req.body.content,
    likes: req.body.likes,
    comments: req.body.comments
  });
  post.save()
    .then((post) => {
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

app.post('/updatelikespost/:id', async (req, res) =>  {
  const id = req.params.id;
  const postlikes = req.body.likes;
  await Post.findOneAndUpdate(
    { _id: id },
    {
      $set: {"likes": postlikes}
    },
    { new: true }
  );
  res.send('Likes updated on post');
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
      res.send(comment);
    })
    .catch((error) => console.error('Error creating comment:', error));
});

app.get('/comment/:id', (req, res) => {
  const id = req.params.id;
  Comment.findById(id)
    .then((comment) => {
      res.send(comment);
    })
    .catch((error) => console.error('Error fetching comment:', error));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
