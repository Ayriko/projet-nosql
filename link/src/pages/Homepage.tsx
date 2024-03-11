import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import {Stack} from "@mui/material";
import { getPosts } from '../client/client.ts';
import PostType  from '../models/post.ts';
import PostComponent from '../components/PostComponent.tsx';
import TextEditor from '../components/TextEditor.tsx';


function Homepage(): React.JSX.Element {
    const [posts, setPosts] = useState([]);

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
        <>
            <Navbar/>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={3}
                sx={{ marginTop: '2rem' }}
            >
            <TextEditor/>
                {
                    posts.slice().reverse().map((post: PostType, index : number) => {
                        return (
                            <div key={index}>
                                 <PostComponent  post={post} />
                            </div>
                        );})
                }
            </Stack>
        </>
    );
}

export default Homepage;