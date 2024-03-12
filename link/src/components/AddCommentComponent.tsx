import React from 'react';
import { Button,Typography, Avatar, Card } from '@mui/material';
import CommentType from '../models/comment';
import { createComment } from '../client/client';

function AddCommentComponent({postId } : {postId : string}): React.JSX.Element {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const commentContent = form.elements.namedItem('commentContent') as HTMLInputElement;

        console.log("postId", postId);
        const newComment : CommentType = {
            id: Math.random().toString(36).substr(2, 9),
            author: '65ef0ca6a2f5fd42b4e4be75',
            postId: postId,
            date: new Date().toDateString(),  
            content: commentContent.value,
        }
        createComment(newComment);
        commentContent.value = "";
    }
 


    const initialUsername = "O";

    return (
        <Card sx={{ margin: '5px', background : 'black', border: '0.5px solid grey'}}>
            <form method="post" onSubmit={handleSubmit} style={{display:'flex', flexDirection:'row', justifyContent: 'center',alignItems: 'center' }} >
                <Avatar sx={{ bgcolor: 'white', marginLeft:'5px', marginRight:'5px'}} aria-label="recipe">
                    <Typography variant="subtitle2" color="black">
                    {initialUsername}
                    </Typography>
                </Avatar>
                <textarea
                    name="commentContent"
                    placeholder='Write a comment...'
                    style={{
                    width:"100%", height:"50px", border: 'none', resize: 'none', background: 'black', padding: '10px', color: 'white',marginTop: '10px', marginBottom: '10px'}}
                />
                <Button type="submit" variant="contained" color="primary" sx={{borderRadius: '30px', marginRight:'5px', marginLeft:'5px' }}>
                <Typography color="white" sx={{fontSize:'12px'}}>
                   comment
                </Typography>
                </Button>
            </form>
        </Card>
    );
}

export default AddCommentComponent;