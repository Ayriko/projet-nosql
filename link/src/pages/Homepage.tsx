import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import {Stack} from "@mui/material";
import { getPosts } from '../client/client.ts';
import PostType  from '../models/post.ts';
import PostComponent from '../components/PostComponent.tsx';
import AddPostComponent from '../components/AddPostComponent.tsx';
import SearchResultsComponent from '../components/SearchResultsComponent.tsx';

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
        <div>
            <Navbar/>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={3}
                sx={{ margin: '5rem' }}
            >
            <SearchResultsComponent />
                 
            <AddPostComponent/>
                {
                    posts.slice().reverse().map((post: PostType, index : number) => {
                        return (
                            <div key={index} >
                                 <PostComponent  post={post} />
                            </div>
                        );})
                }
            </Stack>
        </div>
    );
}

export default Homepage;