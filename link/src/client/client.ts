import CommentType from "../models/comment";
import PostType from "../models/post";
import UserType from "../models/user";


const getUsers = async () => {
  const response = await fetch('http://localhost:3000/users');
  return response.json();
}

const searchUsers = async (searchTerm : string) => {

  const userList = await getUsers();
  const filteredUsers = userList.filter((user: { username: string; })  => {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const results: string[] = [];

  filteredUsers.map((user: UserType) => {
    return results.push(user.username);
  });

  return results;
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

const createComment = async (comment: CommentType) => {
  console.log(comment);
  const response  = await fetch('http://localhost:3000/comment', {
    method: 'POST',
    body: JSON.stringify({
      author: comment.author,
      content: comment.content,
      date: comment.date,
      postId: comment.postId
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  });
  const createdComment = await response.json();

  console.log(createdComment);

  try {
    await addCommentToPost(createdComment._id, createdComment.postId);
  } catch {
    console.log(Error);
  }
  
}

const addCommentToPost = async (commentId: string, postId : string) => {
  await fetch(`http://localhost:3000/addcommenttopost/${postId}`, {
    method: 'POST',
    body: JSON.stringify({
      commentId: commentId
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  })
}

const getCommentById = async (id: string) => {
  const response = await fetch(`http://localhost:3000/comment/${id}`);
  const commentData = await response.json();
  const comment : CommentType = {
    id: commentData.id,
    author: commentData.author,
    date: commentData.date,
    content: commentData.content,
    postId: commentData.postId
  }
  return comment;

}






export { getUsers, getUserById, getPosts, createPost, createComment, getCommentById, searchUsers };

