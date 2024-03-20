import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import {Link as RLink, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import theme from '../theme/theme';
import {loginClient} from "../client/client.ts";



export default function SignIn() {
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('Authentification'))
            navigate('/')
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        })
        const token = await loginClient(data)
        localStorage.setItem('Authentification', token.token)
        navigate('/')
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs"
                       sx={{
                           boxShadow: '0px 0px 0px 2px white',
                           borderRadius: '10px',
                           padding: '30px',
                           marginTop: '10%'
                       }}
            >
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.primary',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                            InputProps={{
                                style: {
                                    color: 'white',
                                    borderColor: 'white',
                                },
                                sx: {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white !important',
                                    },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            InputProps={{
                                style: {
                                    color: 'white',
                                    borderColor: 'white',
                                },
                                sx: {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white !important',
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            type="reset"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 0, mb: 2 }}
                        >
                            <RLink to={"/"} style={linkStyle}>Cancel</RLink>
                        </Button>
                        <Grid container>
                            <Grid item>
                                <RLink to={"/register"}>
                                        {"Don't have an account? Sign Up"}
                                </RLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}



const linkStyle = {
    textDecoration: "none",
    color: 'black'
};
