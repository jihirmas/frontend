import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles } from "@mui/styles";
import { ImageList, ImageListItem, Dialog, DialogContent, Button } from '@mui/material';import { PanoramaSharp } from '@mui/icons-material';
import './PostPage.css';

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

function PostPage() {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);


    function handleMultipleChange(event) {
        const files = event.target.files;
        setFiles(files);
    }
    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
        setOpenDialog(true);
      };
      
      const handleDialogClose = () => {
        setSelectedImage(null);
        setOpenDialog(false);
      };

    const fetchData = async () => {
        
            let url;
            if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            }
            else {
                url = 'http://localhost:3000';
            }
            // Perform your API fetch here
            // post_id in the url parmas ? 
            const site_url = window.location.href;
            const post_id = site_url.split('=')[1];
            const user_id = localStorage.getItem('user_id');
            
            const response = await fetch(`${url}/api/v1/posts/imagenes`, {
                
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'post_id': post_id,
                }),
            });
            const data = await response.json();
            console.log(data);
            setItemData(data);
            
            
        
         
        }
        useEffect(() => {
            fetchData();
        }, []);

    function handleMultipleSubmit(event) {
        event.preventDefault();
        let url;
            if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            } else {
                url = 'http://localhost:3000';
            }
        
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
          }
        
        const site_url = window.location.href;
        const post_id = site_url.split('=')[1];
        formData.append('id', post_id);
        console.log(formData);
        const config = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                'content-type': 'multipart/form-data',
            },
        };
        const final_url = url + '/api/v1/posts/cargar';
        axios.post(final_url, formData, config).then((response) => {
            console.log(response.data);
            
          }).then((response) => {
            window.location.reload();
            })
        .catch((error) => {
            console.error("Error uploading files: ", error);
        });
    }
    return (
        <div>
            <div className="App Gallery-custom">
        <form onSubmit={handleMultipleSubmit}>
            <h1>Subir imagenes al post</h1>
            <input type="file" multiple onChange={handleMultipleChange} />
            <button type="submit">Upload</button>
        </form>
        {uploadedFiles.map((file, index) => (
            <img key={index} src={file} alt={`Uploaded content ${index}`} />
        ))}
        </div>
      <ImageList sx={{ width: "100%", height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} onClick={() => handleImageClick(item.img)}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Ampliación de la imagen"
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </div>
      );
      
}



export default withStyles(styles)(PostPage);