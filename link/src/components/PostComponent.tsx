import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteOutlineIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider } from '@mui/material';
import PostType from '../models/post';
import { getUserById } from '../client/client';
import { useEffect, useState } from 'react';
import getFirstLetterUsername from '../utils/getFirstLetterUsername';
import { Grid, Menu, MenuItem } from '@mui/material';
import CommentComponent from './CommentComponent.tsx';
import AddCommentComponent from './AddCommentComponent.tsx';
import getTimeAgo from '../utils/timeAgo.ts';


export default function PostComponent({post}: {post: PostType}) {
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [authorUsername, setAuthorUsername] = useState("");

    useEffect(() => {
        getUserById(post.author)
            .then(user => {
                setAuthorUsername(user.username); 
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                setAuthorUsername("Unknown"); 
            });
    }, [post.author]);

    const date = getTimeAgo(post.date);

   const initialUsername = getFirstLetterUsername(authorUsername);


    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleMenuClick = (event: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ width: 800, margin: 'auto', background : 'black', border: '0.5px solid grey'}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'white' }} aria-label="recipe">
                         <Typography variant="subtitle2" color="black">
                         {initialUsername}
                        </Typography>
                    </Avatar>
                }
                title={
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle2" color="grey">
                               @  {authorUsername}  •  {date}
                            </Typography>
                        </Grid>
                    </Grid>
                }
                action={
                    <>
                      
                        <IconButton aria-label="settings" onClick={handleMenuClick} sx={{color : 'grey'}}>
                        <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleMenuClose}>Editer</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Supprimer</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Bloquer</MenuItem>
                        </Menu>
                    </>
                }
            />
            <CardContent sx={{ padding: 1}}>
                <Typography variant="body1" color="white" textAlign="left">
                    {post.content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to likes" sx={{color : 'white'}}>
                    <FavoriteOutlineIcon />
                </IconButton>
                <Typography color="white">
                    {post.likes} likes
                </Typography>
                <IconButton
                    aria-label="comment"
                    onClick={handleExpandClick}
                    sx={{color : 'white'}}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography color="white">
                    Reply
                </Typography>
            </CardActions>
            <Divider />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    { post.comments.length > 0 ?
                        post.comments.slice().reverse().map((comment : string, index : number) => {
                            return (
                                <div key={index}>
                                <CommentComponent commentId={comment} />
                                </div>
                            );})
                        :
                        <Typography variant="body1" color="white">
                            No comments yet
                        </Typography>
                        
                    }

                     <AddCommentComponent postId={post._id}/>
                </CardContent>
            </Collapse>
        </Card>
    );
}
