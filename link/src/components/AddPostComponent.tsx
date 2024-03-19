import React from 'react';
import { Button,Typography, Avatar } from '@mui/material';
import { createPost } from '../client/client';
import PostType from '../models/post';
import { useUserContext } from '../contexts/UserContext';

function AddPostComponent(): React.JSX.Element {
    const { user } = useUserContext();

    if (!user.username) {
        return <div></div>;
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const postContent = form.elements.namedItem('postContent') as HTMLInputElement;

        const newPost : PostType = {
            _id: '',
            authorId: '',
            date: new Date().toDateString(),
            content: postContent.value,
            likes: 0,
            comments: []
        }
        createPost(newPost);
        postContent.value = "";
    }




    return (
        <div style={{background:"black", width:"800px", border: '0.5px solid grey', borderRadius: '5px'}}>
        <form method="post" onSubmit={handleSubmit} style={{display:'flex', flexDirection:'row', justifyContent: 'center',alignItems: 'center' }} >
            <Avatar sx={{ bgcolor: 'white', padding:'10px', margin:'5px'}} aria-label="recipe">
                <Typography variant="subtitle2" color="black">
                {user.username.charAt(0).toUpperCase()}
                </Typography>
            </Avatar>
            <textarea
                name="postContent"
                placeholder='What is happening ?'
                style={{
                width:"100%", height:"50px", border: 'none', resize: 'none', background: 'black', padding: '10px', color: 'white',marginTop: '10px', marginBottom: '10px'}}
            />
            <Button type="submit" variant="contained" color="primary" sx={{justifyContent: 'flex-end', borderRadius: '30px', marginRight: '5px', marginLeft: '5px' }}>
            <Typography color="white" sx={{fontSize:'12px'}}>
                post
            </Typography>
            </Button>
        </form>
        </div>
    );
}

export default AddPostComponent;
