import CommentType from "../models/comment";
import PostType from "../models/post";
import UserType from "../models/user";
import SearchResult from "../models/searchResults";

const decodeToken = () => {
  const token = localStorage.getItem('Authentification')
  if (!token) {
    return
  }

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload)
}

const getUsers = async () => {
  const response = await fetch('http://localhost:3000/users');
  return response.json();
}

const createUser = async (user: any) => {
  const res = await fetch('http://localhost:3000/register', {
    method: 'post',
    headers: {'Content-Type':'application/json;charset=utf-8'},
    body: user
  });
  return res.json()
}

const loginClient = async (user) => {
  const res = await fetch('http://localhost:3000/login', {
    method: 'post',
    headers: {'Content-Type':'application/json;charset=utf-8'},
    body: user
  });
  return res.json()
}

const searchUsers = async (searchTerm : string) => {
  const userList = await getUsers();
  const filteredUsers = userList.filter((user: { username: string; })  => {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const results: SearchResult[] = [];

  filteredUsers.map((user: UserType) => {
    results.push({username: user.username, id: user._id});
  });



  return results;
}

const getUserById = async (id: string) => {
  const token = localStorage.getItem('Authentification')
  if (!token) {
    return
  }

  return await fetch(`http://localhost:3000/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${token}`
    },
  }).then(async (response) => {
    return await response.json()
  });
}



const getPosts = async () => {
  const response = await fetch('http://localhost:3000/posts');
  return response.json();
}

const getPostsByAuthorId = async (authorId: string) => {
  try {
    const postsList = await getPosts();
    return postsList.filter((post: { authorId: string; }) => post.authorId === authorId);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts :', error);
    throw error;
  }
};

const updateLikesPost = async (postId : string, likes: number) => {
  await fetch(`http://localhost:3000/updatelikespost/${postId}`, {
    method: 'POST',
    body: JSON.stringify({
      likes: likes
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  })
}

const createPost = async (post: PostType) => {
  const token = localStorage.getItem('Authentification')
  if (!token) {
    return
  }

  await fetch('http://localhost:3000/post', {
    method: 'POST',
    body: JSON.stringify({
      author: '',
      content: post.content,
      date: post.date,
      likes: post.likes,
      comments: post.comments
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8',
    'Authorization': `Bearer ${token}`
  },
  });
}

const createComment = async (comment: CommentType) => {
  const tokenPayload = decodeToken()

  const response  = await fetch('http://localhost:3000/comment', {
    method: 'POST',
    body: JSON.stringify({
      author: tokenPayload.id,
      content: comment.content,
      date: comment.date,
      postId: comment.postId
   }),
   headers: {
    'Content-type': 'application/json; charset=UTF-8'
  },
  });
  const createdComment = await response.json();

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






export { decodeToken, getUsers, getUserById, getPosts, createPost, createComment, getCommentById, searchUsers, getPostsByAuthorId, createUser, updateLikesPost, loginClient };

