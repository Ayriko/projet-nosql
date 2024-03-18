import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar.tsx";
import ProfileComponent from "../components/ProfileComponent.tsx";
import PostComponent from '../components/PostComponent.tsx';
import PostType from "../models/post.ts";
import {getPostsByAuthorId} from "../client/client.ts";
import { useParams } from 'react-router-dom';

function Profil(): React.JSX.Element {
    const [posts, setPosts] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedUsers = await getPostsByAuthorId(userId);
                setPosts(fetchedUsers);
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <Navbar />
          <ProfileComponent  profilId={userId}/>
            {
                posts.slice().reverse().map((post: PostType, index : number) => {
                    return (
                        <div key={index}>
                            <PostComponent  post={post} />
                        </div>
                );})
            }
        </div>
    );
}

export default Profil;