import React from 'react'
import Login from '../Pages/Login/Login'
import { Routes,Route } from 'react-router-dom';
import ProtectedRouter from './ProtectedRouter';
import UserProfile from '../Pages/UserProfile/UserProfile'
import Feed from '../Pages/Feed/Feed'


const PrivateRoutes = () => {
    return (
        <div>
            <Routes>
                <Route exact path="user-profile/:id" element={<ProtectedRouter Component={UserProfile}/>}></Route>
                <Route exact path="feed/:id" element={<ProtectedRouter Component={Feed}/>}></Route>
            </Routes>
        </div>
    )
}

export default PrivateRoutes
