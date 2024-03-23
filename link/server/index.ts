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
import {createClient} from 'redis';

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
)

// Open a new neo4j Session
const session = driver.session()

//redis
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

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

app.post('/like', async (req, res) => {
  try {
    await session.run(`
      MATCH (a:User {id: $meId}), (b:Post {id: $postId})
      CREATE (a)-[:A_LIKE]->(b);
    `,
      {
        meId: req.body.meId,
        postId: req.body.postId
      })
      .then(() => {
        res.send()
      })
  } catch (e) {
    console.log(e)
  }
});

app.post('/follow', async (req, res) => {
  try {
    await session.run(`
      MATCH (a:User {id: $meId}), (b:User {id: $authorId})
      CREATE (a)-[:FOLLOW]->(b);
    `,
      {
        meId: req.body.meId,
        authorId: req.body.authorId
      })
      .then(() => {
        res.send()
      })
  } catch (e) {
    console.log(e)
  }
});

app.post('/unFollow', async (req, res) => {
  try {
    await session.run(`
      MATCH (a:User {id: $meId})-[r:FOLLOW]->(b:User {id: $authorId})
      DELETE r;
    `,
      {
        meId: req.body.meId,
        authorId: req.body.authorId
      })
      .then(() => {
        res.send()
      })
  } catch (e) {
    console.log(e)
  }
});

app.get('/getFollowed/:id', async (req, res) => {
  const id = req.params.id;
  const newSession = driver.session();
  await newSession.run(
    `
      MATCH (a:User {id: $userId})-[FOLLOW]->(u:User)
      RETURN collect(u.id) AS userIds;
    `,
    {
      userId: id,
    }).then((result => {
    result.records.forEach((record) => {
      res.send({users: record.get('userIds')});
    })
  }))
});

app.get('/getFollower/:id', async (req, res) => {
  const id = req.params.id;
  const newSession = driver.session();
  await newSession.run(
    `
      MATCH (u:User)-[FOLLOW]->(a:User {id: $userId})
      RETURN collect(u.id) AS userIds;
    `,
    {
      userId: id,
    }).then((result => {
    result.records.forEach((record) => {
      res.send({users: record.get('userIds')});
    })
  }))
});

app.get('/getRecommendation/:id', async (req, res) => {
  const id = req.params.id;
  const newSession = driver.session();
  await newSession.run(
    `
      MATCH (u:User {id: $userId})-[:FOLLOW]->(:User)-[:FOLLOW]->(recommended:User)
      WHERE NOT (u)-[:FOLLOW]->(recommended) AND recommended.id <> $userId
      RETURN collect(recommended.id) AS recommendedUserId, COUNT(*) AS recommendationScore
      ORDER BY recommendationScore DESC
      LIMIT 10;
    `,
    {
      userId: id,
    }).then((result => {
    result.records.forEach((record) => {
      res.send({users: record.get('recommendedUserId')});
    })
  }))
});

app.post('/dislike', async (req, res) => {
  try {
    await session.run(`
      MATCH (u:User {id: $meId})-[r:A_LIKE]->(p:Post {id: $postId})
      DELETE r;
    `,
      {
        meId: req.body.meId,
        postId: req.body.postId
      }).then(() => {
        res.send()
    })
  } catch (e) {
    console.log('poeut3', e)
    throw e
  }
});

app.get('/like/:id', async (req, res) => {
  const id = req.params.id;
  const newSession = driver.session();
  await newSession.run(
    `
      MATCH (u:User)-[r:A_LIKE]->(p:Post {id: $postId})
      RETURN COUNT(r) AS likeCount, collect(u.id) AS userIds;
    `,
    {
      postId: id,
    }).then((result => {
    result.records.forEach((record) => {
      res.send({likes: record.get('likeCount').toString(), users: record.get('userIds')});
    })
  }))
})

app.post('/register',  async (req, res) => {
  const cryptedPassword  = await bcrypt.hash(req.body.password, 10)
  const user = new UserMongo({
    email: req.body.email,
    password: cryptedPassword,
    username: req.body.username,
  })
  user.save().then( async (user) => {
    const token = jwt.sign({id: user._id.toString()}, "secret")
    await session.run(`
      CREATE (u:User {id: $userId})
    `,
      {
        userId: user._id.toString(),
      })
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
    .then( async (post) => {
      await session.run(`
      CREATE (p:Post {id: $postId})
      WITH p
      MATCH (p:Post {id: $postId}), (u:User {id: $userId})
      CREATE (u)-[:A_POSTE]->(p)
      `,
        {postId: post._id.toString(), $postId: post._id.toString(), userId: post.authorId})
      res.send(post);
    })
    .catch((error) => console.error('Error creating post:', error));
});

app.post('/addCommentToPost/:id', async (req, res) =>  {
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
    .then( async (comment) => {
      await session.run(
`
      CREATE (c:Comment {id: $postId})
      `,
        {postId: comment._id.toString()})
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
