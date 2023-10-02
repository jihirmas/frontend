import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Avatar, Typography, Button, CardActions, CardContent, Card, Box } from "@mui/material";
import './ProfilePage.css'
import { Height } from "@mui/icons-material";
import axios from 'axios';

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
    const [file, setFile] = useState()

    function handleChange(event) {
        setFile(event.target.files[0])
    }
    
    const showInputButton = () => {
        setshowInput(true);
    }

    

    function handleSubmit(event) {
        event.preventDefault()
        let url;
            if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            } else {
                url = 'http://localhost:3000';
            }
        const final_url = url + '/api/v1/users/cambiar_avatar'
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('id', localStorage.getItem('user_id'));
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        const user_id = localStorage.getItem('user_id');
        axios.post(final_url, formData, config).then((response) => {
          console.log(response.data);
        }).then((response) => {
            window.location.reload();
        })
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
                        //camnera e imagen
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleChange}/>
                            <button type="submit">Upload</button>
                        </form>
                        
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