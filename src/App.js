import './App.css';
import {
    HashRouter,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import React, {Component} from "react";
import TripsPage from "./components/TripsPage";
import BottomBar from "./components/BottomBar/BottomBar";
import TopNav from "./components/TopNav/TopNav";
import HomePage from "./components/HomePage/HomePage";
import FriendsPage from "./components/FriendsPage/FriendsPage";
import MapPage from "./components/MapPage/MapPage";
import SearchPage from "./components/SearchPage/SearchPage";
import LoginForm from "./components/LoginForm/LoginForm";
import TripPage from './components/TripPage/TripPage';
import DestinationPage from './components/DestinationPage/DestinationPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


function App() {
    const isAuthenticated = !!localStorage.getItem('authToken');
    return (
        <div className="App">
            <HashRouter>
                <div className="App__content">
                    <TopNav />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route exact path="/login" element={<LoginForm />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/friends" element={<FriendsPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/trip/:tripId" element={<TripPage />} />
                        <Route path='/destination/:destinationId' element={<DestinationPage />}/>
                    </Routes>
                </div>
                <BottomBar />
            </HashRouter>
        </div>

    );
}

export default App;
