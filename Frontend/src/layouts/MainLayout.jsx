import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Header/Navbar'

const MainLayout = () => {
  return (
    <>
        <Navbar />
        <Outlet />
        
    </>
  )
}

export default MainLayout