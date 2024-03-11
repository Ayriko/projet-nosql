import PostType from "../models/post";
import UserType from "../models/user";


const getUsers = async () => {
  const response = await fetch('http://localhost:3000/users');
  return response.json();
}

const getUserById = async (id: string) => {
  const response = await fetch(`http://localhost:3000/user/${id}`);
  const userData = await response.json();
  const user : UserType = {
    id: userData.id,
    username: userData.username,
    mail: userData.mail,
    password: userData.password
  }
  return user;
}

const getPosts = async () => {
  const response = await fetch('http://localhost:3000/posts');
  return response.json();
}

const createPost = async (post: PostType) => {
  await fetch('http://localhost:3000/post', {
    method: 'POST',
    body: JSON.stringify({
      author: post.author,
      content: post.content,
      date: post.date,
      likes: post.likes,
      comments: post.comments
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  });
}



export { getUsers, getUserById, getPosts, createPost };

