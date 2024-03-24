import { Typography, Avatar, Card } from '@mui/material';
import CardHeader from "@mui/material/CardHeader";
import CommentType from '../models/comment';
import { useEffect, useState } from 'react';
import { getCommentById, getUserById } from '../client/client';

function CommentComponent({commentId}: {commentId: string}) {
    const [authorUsername, setAuthorUsername] = useState("");
    const [comment, setComment] = useState<CommentType>();

    useEffect(() => {
        getCommentById(commentId)
            .then(comment => {
                return setComment(comment);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du commentaire :", error);
                return setComment(undefined);
            });
    }, []);


    useEffect(() => {
        getUserById(comment?.author!)
            .then(user => {
                setAuthorUsername(user.username);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                setAuthorUsername("Unknown");
            });
    }, [comment]);

    return (
        <Card sx={{ margin: '5px', background : 'black', border: '0.5px solid grey'}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'white' }} aria-label="recipe">
                         <Typography variant="subtitle2" color="black">
                         {authorUsername.charAt(0).toUpperCase()}
                        </Typography>
                    </Avatar>
                }
                title={
                    <div style={{display:"flex", flexDirection:'column', alignItems:'flex-start'}}>
                        <Typography variant="subtitle2" color="grey">
                               @  {authorUsername}
                        </Typography>
                        <Typography variant="body1" textAlign="left" sx={{ margin: '8px', color: 'white' }}>
                            {comment?.content!}
                        </Typography>
                    </div>
                }
            />

        </Card>
    );
}

export default CommentComponent;
