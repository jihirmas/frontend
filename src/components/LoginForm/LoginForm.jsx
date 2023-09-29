import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';

function isValidEmail(email) {
  // You can use a regular expression or any other method to validate email format.
  // Here's a simple example with a regex pattern:
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // Implement your password validation logic here.
  // For example, you can check the length or other requirements.
  return password.length >= 6; // Minimum password length of 6 characters.
}


export default function SignIn() {
  const isAuth = !!localStorage.getItem('authToken');


  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [token, setToken] = React.useState(localStorage.getItem('authToken') || '');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  

  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email and password before submitting the form.
    let isFormValid = true;

    if (!isValidEmail(email)) {
      setEmailError('Invalid email format');
      isFormValid = false;
    } else {
      setEmailError('');
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isFormValid = false;
    } else {
      setPasswordError('');
    }
    console.log(process.env.REACT_APP_BACKEND_URL)
    let url = '';
      if (process.env.REACT_APP_BACKEND_URL) {
        url = 'https://' + process.env.REACT_APP_BACKEND_URL;
      }
      else {
        url = 'http://localhost:3000';
      }
    if (isFormValid) {
      // Form is valid; you can proceed with form submission.
      try {
        // Send a GET request with HTTP Basic Authentication.
        const response = await fetch(`${url}/api/v1/api-keys`, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Authorization': 'Basic ' + btoa(email + ':' + password),
          },
        });

        if (response.bearer_id) {
          // Authentication is successful. Handle the response as needed.
          const data = await response.json();

          // Set the token in state and localStorage.
          setToken(data.token);
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('email', email);
          localStorage.setItem('user_id', data.bearer_id)
          localStorage.setItem('api_id', data.id)
          console.log('Authentication successful. Token:', data.token);
          window.location.href = "/#/trips";
        } else {
          // Authentication failed. Handle the error.
          console.error('Authentication failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  // Function to clear the token (e.g., for logout)
  const clearToken = () => {
    setToken('');
    localStorage.removeItem('authToken');
  };
  
  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      <div>
        {isAuth ? <Navigate to="/trips" /> : null}
      </div>
    </ThemeProvider>
  );
}
