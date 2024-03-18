import React from 'react';
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function ProfileComponent(): React.JSX.Element {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" maxWidth={600} margin="auto" textAlign="center">
            <Box marginBottom={4}>
                <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h2">
                        T
                    </Typography>
                </Avatar>
            </Box>
            <Box marginBottom={4}>
                <Typography variant="h4" color="white">
                    Toto
                </Typography>
                <Typography variant="subtitle1" color="white">
                    toto@toto
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
