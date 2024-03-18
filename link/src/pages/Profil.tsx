import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar.tsx";
import ProfileComponent from "../components/ProfileComponent.tsx";
import PostComponent from '../components/PostComponent.tsx';
import PostType from "../models/post.ts";
import {getPostsByAuthorId} from "../client/client.ts";
import {useNavigate, useParams} from 'react-router-dom';

function Profil(): React.JSX.Element {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (userId) {
                    const fetchedUsers = await getPostsByAuthorId(userId);
                    setPosts(fetchedUsers);

                    return
                }
                navigate('/');
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        };
        fetchPosts();
    }, []);

    if (userId) {
        return (
          <div>
              <Navbar/>
              <ProfileComponent userId={userId}/>
              {
                  posts.slice().reverse().map((post: PostType, index: number) => {
                      return (
                        <div key={index}>
                            <PostComponent post={post}/>
                        </div>
                      );
                  })
              }
          </div>
        );
    }
}

export default Profil;
