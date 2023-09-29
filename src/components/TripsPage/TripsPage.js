import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import TripCard from "./TripCard/TripCard";
import './TripsPage.css';
import { Fab, Paper, Stack, styled, Grid, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import { generatePath, useNavigate } from "react-router-dom";
import { useScrollDirection } from 'react-use-scroll-direction';
import { Navigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

function TripsPage(props) {
  const [trips, setTrips] = useState([]); // Estado para almacenar los datos de los viajes
  const [error, setError] = useState(null); // Estado para manejar errores
  const user_id = parseInt(localStorage.getItem('user_id'));
  const isAuthenticated = !!localStorage.getItem('authToken');
  useEffect(() => {
    async function fetchData() {
      try {
        let url;
        if (process.env.REACT_APP_BACKEND_URL) {
          url = 'https://' + process.env.REACT_APP_BACKEND_URL;
        }
        else {
          url = 'http://localhost:3000';
        }
        const response = await fetch(`${url}/api/v1/trips`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filtrar los viajes en los que el autor sea igual a user_id
          const filteredTrips = data.filter((trip) => trip.author === user_id);
          setTrips(filteredTrips); // Almacena los datos filtrados en el estado
        } else {
          setError('Autenticación fallida'); // Manejar errores
        }
      } catch (error) {
        setError('Autenticación fallida'); // Manejar errores de red u otros
      }
    }

    fetchData();
  }, []); // Llama a fetchData cuando el componente se monta

  return (
    <Container className='trips-all'>
      <Grid container spacing={2}>
        {error ? (
          
          <p>{error}
          {isAuthenticated ? alert("Autenticación fallida, se le redirigirá a la página de inicio de sesión para que ingrese nuevamente"): null}
          {localStorage.clear()}
          <div>
          <Navigate to="/login" />
            </div></p>
        ) : (
          trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trip.id}>
              <TripCard trip={trip} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default TripsPage;
