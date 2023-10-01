import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { QrReader } from 'react-qr-reader';
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { json } from 'react-router';
import jsQR from 'jsqr';
import { isNullableType } from 'graphql';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function FriendsPage(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [qrCodeSrc, setQrCodeSrc] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false); // State to control QR code scanner
    const [data, setData] = useState(null); // State to store the scanned data
    const [spinner, setSpinner] = useState(false);

    // Function to get the user's location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            }, (error) => {
                console.error("Error getting user location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Function to handle the API fetch
    const fetchData = async () => {
        setIsLoading(true);

        try {
            let url;
            if (process.env.REACT_APP_BACKEND_URL) {
            url = 'https://' + process.env.REACT_APP_BACKEND_URL;
            }
            else {
            url = 'http://localhost:3000';
            }
            // Perform your API fetch here
            const response = await fetch(`${url}/api/v1/friendship_tokens/show`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_id': localStorage.getItem('user_id'),
                    'latitude': userLocation ? userLocation.lat : null,
                    'longitude': userLocation ? userLocation.lng : null,
                }),
            });

            // Check if the response is successful (status code 200)
            console.log(userLocation.lat);
            if (response.status === 200) {
                // Convert the response body to Blob and create a data URL
                const blob = await response.blob();
                const qrCodeDataUrl = URL.createObjectURL(blob);
                setQrCodeSrc(qrCodeDataUrl); // Set the image source
            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            // Handle any errors that occurred during the fetch
            console.error("Error fetching data:", error);
        }

        setIsLoading(false);
    };

    // Function to handle the scanning of the QR code
    const handleScan = async (aux) => {
        setSpinner(true);
        if (aux) {
            // Close the scanner and handle the scanned data (e.g., send a request via API fetch)
            setIsScannerOpen(false);
            const [url, query] = aux.split('?');
            const params = new URLSearchParams(query);
            const friend_token = params.get('fndtk');

            try {
                let url;
                if (process.env.REACT_APP_BACKEND_URL) {
                url = 'https://' + process.env.REACT_APP_BACKEND_URL;
                }
                else {
                url = 'http://localhost:3000';
                }
                // Perform your API fetch here
                
                const response = await fetch(`${url}/api/v1/friendship_tokens/add`, {
                    
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'token': friend_token,
                        'user_id': localStorage.getItem('user_id'),
                    }),
                });
                console.log('RESSS')
                console.log(response.json());
                console.log('RESSS')
    
                // Check if the response is successful (status code 200)
                setSpinner(false);
                if (response.status === 200) {
                    window.alert("You are friends!");
                    
                } else {
                    window.alert("Hubo un error");
                    console.error("API request failed with status:", response.status);
                }
            } catch (error) {
                // Handle any errors that occurred during the fetch
                console.error("Error fetching data:", error);
            }
        }
    };

    const handleError = (error) => {
        console.error("QR code scanning error:", error);
    };

    useEffect(() => {
        // Get the user's location when the component mounts
        getUserLocation();
    }, []);

    
    


    const css = `
    div > video {
        position: relative!important;
        `;

    return (
        <div style={{ padding: '20px', height: '600px', width: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button style={{ marginTop: '90px' }} variant='contained' color="primary" size="small" onClick={fetchData}>
                Crear Solicitud de Amistad
            </Button>

            <div style={{ marginTop: '20px' }}>
                {qrCodeSrc && (
                    <div>
                        <Typography variant="h6">Tu código QR:</Typography>
                        <img src={qrCodeSrc} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                    </div>
                )}
            </div>
            {spinner && (
                <Box sx={{ display: 'flex' }}>
                <CircularProgress />
                </Box>
            )}

            

            {!isScannerOpen && (
                <Button style={{ marginTop: '20px' }} variant='contained' color="secondary" size="small" onClick={() => setIsScannerOpen(true)}>
                    Escanear Amigo
                </Button>
            )}

            {isScannerOpen && (
                <div style={{ marginTop: '20px' }}>
                    <style>{"\
                            div>video{\
                            position:relative!important; top:-700px!important;\
                            }\
                        "}</style>
                    <QrReader
                        delay={100}
                        onError={handleError}
                        onResult={(result, error) => {
                            if (!!result) {
                                setIsScannerOpen(false);
                                setData(result?.text);
                                const aux = result?.text;
                                console.log(aux);
                                handleScan(aux);
                            }
                            if (!!error) {
                                console.log("ERROR QR")
                                console.error(error);
                                console.log("ERROR QR")
                            }
                        }}
                        style={{ width: '100%' , position: 'relative!important'}}
                        constraints={{ facingMode: "environment" }}
                    />
                
                </div>
                
            )}
        </div>
    );
}

export default FriendsPage;


