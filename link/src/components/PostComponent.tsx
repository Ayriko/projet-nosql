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
import {decodeToken, getUserById, test, updateLikesPost} from '../client/client';
import { useEffect, useState } from 'react';
import { Grid, Menu, MenuItem } from '@mui/material';
import CommentComponent from './CommentComponent.tsx';
import AddCommentComponent from './AddCommentComponent.tsx';
import getTimeAgo from '../utils/timeAgo.ts';
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext.tsx';


export default function PostComponent({post}: {post: PostType}) {
    const { user } = useUserContext();


    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [authorUsername, setAuthorUsername] = useState("");
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        getUserById(post.authorId)
            .then(user => {
                setAuthorUsername(user.username);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                setAuthorUsername("Unknown");
            });
    }, [post.authorId]);

    const date = getTimeAgo(post.date);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleMenuClick = (event: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLike = () => {
        const tokenPayload = decodeToken()

        test(JSON.stringify({postId: post._id, meId: tokenPayload.id}))
        setIsLiked(!isLiked);
        if (isLiked) {
            post.likes -= 1;
        } else {
            post.likes += 1;
        }
        updateLikesPost(post._id, post.likes);
    }

    return (
        <Card sx={{ width: 800, margin: 'auto', background : 'black', border: '0.5px solid grey'}}>
            <CardHeader
                avatar={
                    <Link to={`/profil/${post.authorId}`}>
                        <Avatar sx={{ bgcolor: 'white' }} aria-label="recipe">
                            <Typography variant="subtitle2" color="black">
                            {authorUsername.charAt(0).toUpperCase()}
                            </Typography>
                        </Avatar>
                    </Link>
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
                      {post.authorId === user._id && (
                        <IconButton aria-label="settings" onClick={handleMenuClick} sx={{ color: 'grey' }}>
                        <MoreVertIcon />
                        </IconButton>
                        )}
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleMenuClose}>Editer</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Supprimer</MenuItem>
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
                <IconButton aria-label="add to likes" sx={{color : isLiked ? 'red' : 'white'}} onClick={handleLike}>
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
