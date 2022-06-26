// ✨ implement axiosWithAuth
import React from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const customApi = () => {
    const token = localStorage.getItem("token")
    return axios.create({
        baseURL: 'http://localhost:9000/api',
        headers: {
            authorization: token
        }
})
}

const AuthRoute = (props) => {
    const { children } = props;
    return localStorage.getItem("token") ? children : <Navigate to="/" />
}