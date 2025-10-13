import express from "express";
import Clase from "../models/Clase.js";
import Usuario from "../models/Usuario.js";
import Profesor from "../models/Profesor.js";

const router = express.Router();


// AÑADIR CLASE
router.post('/', async (req, res) => {
    try {
        const clase = new Clase({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            fecha: req.body.fecha,
            asistencia: false,
            pagoRealizado: false,
            completada: false

        });
        await clase.save();
        res.json({ mensaje: 'Clase creada exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al crear la clase', error: error.message });
    }
});

// OBTENER DATOS CLASE
router.get('/:id', async (req, res) => {
    try {
        const clase = await Clase.findById(req.params.id);
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        res.json(clase);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener la clase', error: error.message });
    }
});

// MODIFICAR CLASE
router.put('/:id', async (req, res) => {
    try {
        const clase = await Clase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!clase) {
            return res.json({ mensaje: 'Clase no encontrada' });
        }
        res.json(clase);
    } catch (error) {
        res.json({ mensaje: 'Error al actualizar la clase', error: error.message });
    }
});

// BORRAR CLASE (NO NECESARIO POR BORRADO LÓGICO PERO SE PUEDE)
router.delete('/:id', async (req, res) => {
    try {
        await Clase.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Clase eliminada exitosamente' });
    } catch (error) {
        res.json({ mensaje: 'Error al eliminar la clase', error: error.message });
    }
});

export default router;