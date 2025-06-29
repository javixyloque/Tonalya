"use strict";
import Instrumento from "../models/Instrumento.js";
import "./bdInstrumentos.js";

const insertarInstrumentos = async (req, res) => {
    try{
        const instrumentos = await Instrumento.find({});
        if (!instrumentos) {
            await Instrumento.insertMany(arrInstrumentos);
        }
        res.json(instrumentos);
    } catch(error){
        console.log("Error al obtener los instrumentos", error)
        res.status(500).json({error: "Ocurrió un error"});
    }
}

export {insertarInstrumentos};