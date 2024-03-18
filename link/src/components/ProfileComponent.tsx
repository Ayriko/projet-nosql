import React, { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { getUserById } from '../client/client';
import UserType from '../models/user';

function ProfileComponent({userId} : {userId : string }): React.JSX.Element {
    const [user, setUser] = useState<UserType>();

    useEffect(() => {
        getUserById(userId)
            .then(user => {
                setUser(user);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            });
    }, [userId]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" maxWidth={800} margin={"auto"} marginTop={'5em'} textAlign="center">
            <Box marginBottom={4}>
                <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h2">
                        {user?.username.charAt(0).toUpperCase()}
                    </Typography>
                </Avatar>
            </Box>
            <Box marginBottom={4}>
                <Typography variant="h4" color="white">
                    {user?.username}
                </Typography>
                <Typography variant="subtitle1" color="white">
                </Typography>
            </Box>
            <Box marginBottom={4}>
                <Typography variant="body1" color="white">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget nulla eu ligula consequat faucibus. Nulla facilisi.
                </Typography>
            </Box>
            <Button variant="contained" color="primary">
                Add Friend
            </Button>
        </Box>
    );
};

export default ProfileComponent;
