import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, Grid, Menu, MenuItem } from '@mui/material';
import Comments from "./Comments.tsx";

export default function Post() {
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ width: 500, margin: 'auto'}}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                    </Avatar>
                }
                title={
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle2">
                                User
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" color="text.secondary">
                                2 hours ago
                            </Typography>
                        </Grid>
                    </Grid>
                }
                action={
                    <>
                        <IconButton aria-label="settings" onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Editer</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Supprimer</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Bloquer</MenuItem>
                        </Menu>
                    </>
                }
            />

            <CardContent sx={{ padding: 1}}>
                <Typography variant="body1" color="text.primary" textAlign="left">
                    This is a Twitter-like post. It includes a user's avatar, username, and date.
                    Here, you can add your post content. This could be a tweet, a message, or any
                    other short piece of text.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to likes">
                    <FavoriteIcon />
                </IconButton>
                5
                <IconButton
                    aria-label="comment"
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                >
                    <ChatBubbleOutlineIcon />
                    Reply
                </IconButton>
            </CardActions>
            <Divider />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {<Comments />}
                </CardContent>
            </Collapse>
        </Card>
    );
}
