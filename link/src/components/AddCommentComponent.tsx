import React from 'react';
import { Button,Typography, Avatar, Card } from '@mui/material';
import CommentType from '../models/comment';
import {createComment, decodeToken} from '../client/client';
import { useUserContext } from '../contexts/UserContext';

function AddCommentComponent({postId } : {postId : string}): React.JSX.Element {

    const { user } = useUserContext();
    const tokenPayload = decodeToken()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const commentContent = form.elements.namedItem('commentContent') as HTMLInputElement;

        const newComment : CommentType = {
            id: "",
            author: tokenPayload.id,
            postId: postId,
            content: commentContent.value,
        }
        createComment(newComment);
        commentContent.value = "";
    }




    return (
        <Card sx={{ margin: '5px', background : 'black', border: '0.5px solid grey'}}>
            <form method="post" onSubmit={handleSubmit} style={{display:'flex', flexDirection:'row', justifyContent: 'center',alignItems: 'center' }} >
                <Avatar sx={{ bgcolor: 'white', marginLeft:'5px', marginRight:'5px'}} aria-label="recipe">
                    <Typography variant="subtitle2" color="black">
                    {user.username.charAt(0).toUpperCase()}
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
