import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Inicio } from "../pages/Inicio";
import { Header } from "../pages/Header";
import { Footer } from "../pages/Footer";
import { SearchPage } from "../pages/SearchPage";

export const AppRoutes:React.FC = () =>{

    return(
        <BrowserRouter>
        {/* Layout */}
        <Header/>

        {/* Contenido principal y rutas */}
        <main className="main-content">
            <Routes>
                <Route path="/" element={<Inicio/>} />
                <Route path="/inicio" element={<Inicio/>} />
                <Route path="/buscar" element={<SearchPage/>} />
            </Routes>
        </main>

        <Footer/>

        </BrowserRouter>
    )
}