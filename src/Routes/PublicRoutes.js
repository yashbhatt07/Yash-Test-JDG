import React from 'react'
import Login from '../Pages/Login/Login'
import { Routes,Route } from 'react-router-dom';

const PublicRoutes = () => {
    return (
            <Routes>
                <Route exact path="login" element={<Login/>}></Route>
                <Route exact path="/" element={<Login/>}></Route>
                <Route exact path="*" element={<Login/>}></Route>
            </Routes>
    )
}

export default PublicRoutes
