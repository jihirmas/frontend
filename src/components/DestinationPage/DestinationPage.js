import React, { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import './DestinationPage.css';
import { useParams } from 'react-router-dom'; // Importa useParams

const DestinationPage = () => {
  const { destinationId } = useParams(); // Obtiene el destinationId de la URL
  const [destination, setDestination] = useState({});
  let url = '';
  if (process.env.REACT_APP_VERCEL_URL) {
    url = 'https://' + process.env.REACT_APP_VERCEL_URL;
  }
  else {
    url = 'http://localhost:3000';
  }

  useEffect(() => {
    // Hacer una solicitud a tu API para obtener los datos del destino según el destinationId
    async function fetchDestination() {
      try {
        const response = await fetch(`${url}/api/v1/destinations/${destinationId}`, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDestination(data);
        } else {
          console.error('Error al obtener datos del destino');
        }
      } catch (error) {
        console.error('Error al obtener datos del destino', error);
      }
    }

    fetchDestination();
  }, [destinationId]);

  return (
    <Container className='trip-page'>
      <Typography variant='h4'>{destination.name}</Typography>
      <Typography variant='body1'>Country: {destination.country}</Typography>
      <Typography variant='body1'>City: {destination.city}</Typography>
      <Typography variant='body1'>Latitude: {destination.latitude}</Typography>
      <Typography variant='body1'>Longitude: {destination.longitude}</Typography>
      {/* Puedes mostrar más información del destino según tus necesidades */}
    </Container>
  );
};

export default DestinationPage;
