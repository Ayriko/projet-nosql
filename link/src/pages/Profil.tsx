import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar.tsx";
import ProfileComponent from "../components/ProfileComponent.tsx";
import PostComponent from '../components/PostComponent.tsx';
import PostType from "../models/post.ts";
import {getPosts} from "../client/client.ts";

function Profil(): React.JSX.Element {
    const [posts, setPosts] = useState([]);

    //add check to only get user post

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedUsers = await getPosts();
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
            <ProfileComponent />
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