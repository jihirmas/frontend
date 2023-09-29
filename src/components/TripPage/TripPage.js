import React, { useEffect, useState } from 'react';
import './TripPage.css';
import { useParams, Navigate } from 'react-router-dom';
import PostCard from './PostCard/PostCard';
import DestinationCard from './DestinationCard/DestinationCard';
import { Fab, Paper, Stack, styled, Grid, Container, Typography } from "@mui/material";
import TripMap from './TripMap/TripMap'; // Importa el componente TripMap

function TripPage(props) {
  const user_id = parseInt(localStorage.getItem('user_id'));
  const { tripId } = useParams(); // Obtén el ID del trip de la URL
  const [posts, setPosts] = useState([]); // Estado para almacenar los posts
  const [error, setError] = useState(null); // Estado para manejar errores
  const [destinations, setDestinations] = useState([]); // Estado para almacenar el destino
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  useEffect(() => {
    async function fetchData() {
      try {
        let url;
        if (process.env.REACT_APP_VERCEL_URL) {
          url = 'https://' + process.env.REACT_APP_VERCEL_URL;
        }
        else {
          url = 'http://localhost:3000';
        }
        const response = await fetch(`${url}/api/v1/trip_destinations?trip_id=${tripId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          // Aquí obtienes los posts asociados al trip con el ID "tripId"
          setDestinations(data); // Almacena los datos de los posts en el estado
        } else {
          setError('Error al obtener datos'); // Manejar errores
        }
      } catch (error) {
        setError('Error al obtener datos'); // Manejar errores de red u otros
      }
    }
  
    fetchData();
  }, [tripId]); // Llama a fetchData cuando el componente se monta o cuando tripId cambia
  
  useEffect(() => {
    async function fetchData() {
      try {
        let url;
        if (process.env.REACT_APP_VERCEL_URL) {
          url = 'https://' + process.env.REACT_APP_VERCEL_URL;
        }
        else {
          url = 'http://localhost:3000';
        }
        const response = await fetch(`${url}/api/v1/trips/${tripId}/posts`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          // Aquí obtienes los posts asociados al trip con el ID "tripId"
          setPosts(data); // Almacena los datos de los posts en el estado
        } else {
          setError('Error al obtener datos'); // Manejar errores
        }
      } catch (error) {
        setError('Error al obtener datos'); // Manejar errores de red u otros
      }
    }
  
    fetchData();
  }, [tripId]);

  return (
    <Container className='trip-page'>
      <div className='section'>
        <Typography variant='h2' gutterBottom>
          Posts
        </Typography>
        <Grid container spacing={2}>
          {error ? (
            <p>{error}
            {isAuthenticated ? alert("Autenticación fallida, se le redirigirá a la página de inicio de sesión para que ingrese nuevamente"): null}
            {localStorage.clear()}
            <div>
            <Navigate to="/login" />
              </div></p>
          ) : (
            posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))
          )}
        </Grid>
      </div>

      <div className='section'>
        <Typography variant='h2' gutterBottom>
          Destinations
        </Typography>
        <Grid container spacing={2}>
          {error ? (
            <p>{error}</p>
          ) : (
            destinations.map((destination) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={destination.id}>
                <DestinationCard dest={destination} />
              </Grid>
            ))
          )}
        </Grid>
      </div>
      <div className='section'>
        <Typography variant='h2' gutterBottom>
          Mapa de Destinos
        </Typography>
        <TripMap tripId={tripId} /> {/* Usar el componente TripMap aquí */}
      </div>
    </Container>
  );
  
            }  

export default TripPage;
