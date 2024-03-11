import React from 'react';
import Navbar from "../components/Navbar.tsx";
import {Stack} from "@mui/material";
import Post from '../components/Post.tsx';

function Homepage(): React.JSX.Element {
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
                <Post />
                <Post />
                <Post />
            </Stack>
        </>
    );
}

export default Homepage;