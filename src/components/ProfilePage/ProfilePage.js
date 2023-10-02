import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Avatar, Typography, Button, CardActions, CardContent, Card, Box } from "@mui/material";
import './ProfilePage.css'
import { Height } from "@mui/icons-material";

const styles = {
    card: {
        minWidth: 275
    },
    title: {
        fontSize: 15
    },
    pos: {
        marginBottom: -10
    }
};

function ProfilePage(props) {

    const { classes } = props;
    const [userInfo, setUserInfo] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [isAvatar, setIsAvatar] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showInput, setshowInput] = useState(false);
    
    const showInputButton = () => {
        setshowInput(true);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            const aux = base64Image
            cambiarAvatar(aux);
        };
        reader.readAsDataURL(file);
        }
    };

    const cambiarAvatar = async (aux) => {
        try {
            let url;
            if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            } else {
                url = 'http://localhost:3000';
            }
 
            const response = await fetch(`${url}/api/v1/users/cambiar_avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_id': localStorage.getItem('user_id'),
                    'avatar': aux,
                }),
            });
    
            const data = await response.json();

    
            if (data.estado === "ok") {
                console.log("LISTO!");
                window.location.reload();
            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchData = async () => {
        try {
            let url;
            if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            }
            else {
                url = 'http://localhost:3000';
            }
            // Perform your API fetch here
            const user_id = localStorage.getItem('user_id');
            const response = await fetch(`${url}/api/v1/users/busqueda`, {
                
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_id': localStorage.getItem('user_id'),
                }),
            });
            console.log(response);

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                setUserName(data.nombre);
                setUserEmail(data.mail);
                setUserAvatar(data.avatar);
                if (data.avatar === "") {
                    setIsAvatar(false);
                } else {
                    setIsAvatar(true);
                }

                //window.alert("You are friends!");
                
            } else {
                //window.alert("Hubo un error");
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            // Handle any errors that occurred during the fetch
            console.error("Error fetching data:", error);
        }
    }

    fetchData();






    
    return (
        <div style={{height: '100vh', width: '100%'}}>
            <Card className={classes.card}>
                <CardContent>
                    <Avatar
                    alt="Daniel Di Salvo"
                    src={isAvatar ? userAvatar : "https://avatars.githubusercontent.com/u/43717474?v=4"}
                    className={classes.bigAvatar}
                    />
                    <Typography variant="h5" component="h2">
                    {userName}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                    {userEmail}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={showInputButton}
                    >
                        Cambiar avatar
                    </Button>
                    {showInput && (
                        
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        
                    )}
                    </CardActions>
            </Card>
        </div>
    );
    }

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfilePage);