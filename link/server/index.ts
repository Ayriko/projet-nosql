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
import { Redis } from 'ioredis';

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
)

// Open a new neo4j Session
const session = driver.session()

//ioredis
const redis = new Redis();

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
      redis.set(`post:${post._id}`, JSON.stringify(post), (err, result) => {
        if (err) {
          console.error('Error saving post in cache:', err);
        }
        console.log('Post saved in cache:', result);
      });
      redis.sadd('posts:keys', `post:${post._id}`, (err, result) => {
        if (err) {
          console.error('Error adding post key to Post Set:', err);
        }
        console.log('Post key added to Post Set:', result);
      });
      res.send(post);
    })
    .catch((error) => console.error('Error creating post:', error));
});

app.get('/posts', (_, res) => {
  // on récupère les clés des posts stockés dans le set
  redis.smembers('posts:keys', (err, keys) => {
    if (err || keys.length === 0) {
      console.error('Error fetching post keys from Post Set:', err);
      // Récupérer les posts depuis MongoDB
      Post.find({})
          .then(posts => {
            // Mettre en cache tous les posts dans Redis
            posts.forEach(post => {
              redis.set(`post:${post._id}`, JSON.stringify(post), (err, result) => {
                if (err) {
                  console.error('Error adding post to Redis:', err);
                }
                console.log('Post added to Redis:', result);
                // Ajouter la clé du post dans le set
                redis.sadd('posts:keys', `post:${post._id}`, (err, result) => {
                  if (err) {
                    console.error('Error adding post key to Redis Set:', err);
                  }
                  console.log('Post key added to Post Set:', result);
                });
              });
            });
            res.send(posts);
          })
          .catch(error => {
            console.error('Error fetching posts from MongoDB:', error);
            res.status(500).send({ message: 'Error fetching posts' });
          });
    } else {
      // Récupérer les posts à partir des clés
      const postPromises = keys.map(key => {
        return new Promise((resolve, reject) => {
          redis.get(key, (err, post) => {
            if (err) {
              reject(err);
            }
            if (post != null) {
              resolve(JSON.parse(post));
            }
          });
        });
      });

      // Renvoyer tous les posts
      Promise.all(postPromises)
          .then(posts => {
            res.send(posts);
          })
          .catch(error => {
            console.error('Error fetching posts from Redis:', error);
            res.status(500).send({ message: 'Error fetching posts' });
          });
    }
  });
});

app.get('/post/:id', (req, res) => {
  const postId = req.params.id;

  // Check if the post is available in the cache
  redis.get(`post:${postId}`, (err, result) => {
    if (err) {
      console.error('Error fetching post from cache:', err);
    }

    if (result) {
      // If the post is in the cache, return it
      console.log('Post returned from cache:', result);
      res.send(JSON.parse(result));
    } else {
      // If the post is not in the cache, fetch it from MongoDB
      Post.findById(postId)
          .then((post) => {
            if (!post) {
              res.status(404).send({ message: 'Post not found' });
            } else {
              // Save the post in the cache
              redis.set(`post:${post._id}`, JSON.stringify(post), (err, result) => {
                if (err) {
                  console.error('Error saving post in cache:', err);
                }
                console.log('Post saved in cache:', result);
              });

              // Return the post
              res.send(post);
            }
          })
          .catch((error) => {
            console.error('Error fetching post from MongoDB:', error);
            res.status(500).send({ message: 'Error fetching post' });
          });
    }
  });
});

app.put('/post/:id', (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  Post.findByIdAndUpdate(postId, updatedPost, { new: true })
      .then((post) => {
        if (!post) {
          res.status(404).send({ message: 'Post not found' });
        } else {
          redis.set(`post:${post._id}`, JSON.stringify(post), (err, result) => {
            if (err) {
              console.error('Error updating post in Redis:', err);
            }
            console.log('Post updated in Redis:', result);
          });

          res.send(post);
        }
      })
      .catch((error) => {
        console.error('Error updating post:', error);
        res.status(500).send({ message: 'Error updating post' });
      });
});

app.delete('/post/:id', (req, res) => {
  const postId = req.params.id;

  Post.findByIdAndDelete(postId)
      .then((post) => {
        if (!post) {
          res.status(404).send({ message: 'Post not found' });
        } else {
          redis.del(`post:${post._id}`, (err, result) => {
            if (err) {
              console.error('Error deleting post from Redis:', err);
            }
            console.log('Post deleted from Redis:', result);
          });

          // Remove the post key from the Post Set
          redis.srem('posts:keys', `post:${post._id}`, (err, result) => {
            if (err) {
              console.error('Error removing post key from Redis Set:', err);
            }
            console.log('Post key removed from Post Set:', result);
          });

          res.send({ message: 'Post deleted successfully' });
        }
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
        res.status(500).send({ message: 'Error deleting post' });
      });
});


app.post('/addCommentToPost/:id', async (req, res) =>  {
    const id = req.params.id;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $push: {"comments": req.body.commentId}
      },
      { new: true }
    );

  // Mettre à jour le cache Redis avec le post mis à jour
  redis.set(`post:${id}`, JSON.stringify(updatedPost), (err, result) => {
    if (err) {
      console.error('Error updating post in Redis:', err);
    }
    console.log('Post updated in Redis:', result);
  });

  res.send('Comment added to post');
});

app.post('/updateLikesPost/:id', async (req, res) =>  {
  const id = req.params.id;
  const postLikes = req.body.likes;
  const updatedPost = await Post.findOneAndUpdate(
    { _id: id },
    {
      $set: {"likes": postLikes}
    },
    { new: true }
  );

  redis.set(`post:${id}`, JSON.stringify(updatedPost), (err, result) => {
    if (err) {
      console.error('Error updating post in Redis:', err);
    }
    console.log('Post updated in Redis:', result);
  });

  res.send('Likes updated on post');
});


// COMMENTS
app.post('/comment', (req, res) => {
  const comment = new Comment({
    author: req.body.author,
    content: req.body.content,
    postId: req.body.postId
  });
  comment.save()
    .then((comment) => {
      redis.set(`comment:${comment._id}`, JSON.stringify(comment), (err, result) => {
        if (err) {
          console.error('Error saving comment in cache:', err);
        }
        console.log('Comment saved in cache:', result);
      });
      res.send(comment);
    })
    .catch((error) => console.error('Error creating comment:', error));
});

app.get('/comment/:id', (req, res) => {
  const commentId = req.params.id;

  redis.get(`comment:${commentId}`, (err, result) => {
    if (err) {
      console.error('Error fetching comment from cache:', err);
    }

    if (result) {
      console.log('Comment returned from cache:', result);
      res.send(JSON.parse(result));
    } else {
      Comment.findById(commentId)
          .then((comment) => {
            if (!comment) {
              res.status(404).send({message: 'Comment not found'});
            } else {
              redis.set(`comment:${comment._id.toString()}`, JSON.stringify(comment), (err, result) => {
                if (err) {
                  console.error('Error saving comment in cache:', err);
                }
                console.log('Comment saved in cache:', result);
              });
              res.send(comment);
            }
          })
          .catch((error) => {
            console.error('Error fetching comment from MongoDB:', error);
            res.status(500).send({message: 'Error fetching comment'});
          });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
