import React, { useState } from 'react';
import { Typography, Avatar, Grid, Card } from '@mui/material';
import CardHeader from "@mui/material/CardHeader";

function Comments(): React.JSX.Element {
    const [comment] = useState("Ceci est un commentaire");

    // Sample user data
    const user = {
        username: "SampleUser",
        avatar: "https://example.com/avatar.jpg"
    };

    const date = "March 11, 2024";

    return (
        <Card sx={{ padding: '2.5px', backgroundColor: '#ffffff', borderRadius: '10px'}}>
            <CardHeader
                avatar={
                    <Grid item>
                        <Avatar src={user.avatar} alt={user.username} />
                    </Grid>
                }
                title={
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle2">{user.username}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1" color="text.secondary">{date}</Typography>
                        </Grid>
                    </Grid>
                }
            />
            <Typography variant="body1" textAlign="left" sx={{ margin: '8px' }}>{comment}</Typography>
        </Card>
    );
}

export default Comments;
