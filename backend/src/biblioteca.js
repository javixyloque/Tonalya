"use strict";
import Instrumento from "./models/Instrumento.js";
import arrInstrumentos from "./bdInstrumentos.js"; 
import nodemailer from 'nodemailer';

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'tonalyamusica@gmail.com',
        pass: 'ctig qiqw wgqp iirw'
    }
});

const formatoFecha = (fecha) => fecha.toLocaleString('es-ES');

/**
 * Función para enviar emails cuando un usuario hace una peticion de reserva de clase a un profesor
 * @param {*} profesor 
 * @param {*} alumno 
 * @param {*} instrumento 
 * @param {*} clase 
 * @param {*} descripcion 
 * @param {*} horas 
 */
const enviarEmailsReserva = async (profesor, alumno, instrumento, clase, descripcion, horas) => {
    try {
        const formatoFecha = (fecha) => fecha.toLocaleString('es-ES');
        
        await Promise.all([
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Solicitud de reserva de clase",
                to: profesor.email,
                html: `<h1>Solicitud de reserva de clase</h1>
                <p>Alumno: ${alumno.nombre}</p>
                <p>Instrumento: ${instrumento.nombre}</p>
                <p>Descripción: ${descripcion}</p>
                <p>Fecha inicio: ${formatoFecha(clase.fechaInicio)}</p>
                <p>Fecha fin: ${formatoFecha(clase.fechaFin)}</p>
                <p>Duración: ${horas.toFixed(2)} hora${horas !== 1 ? 's' : ''}</p>
                <p>Precio: ${clase.precio.toFixed(2)} €</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA.</p>`
            }),
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Solicitud de reserva de clase exitosa",
                to: alumno.email,
                html: `<h1>Solicitud de reserva de clase exitosa</h1>
                <p>Profesor: ${profesor.nombre}</p>
                <p>Instrumento: ${instrumento.nombre}</p>
                <p>Descripción: ${descripcion}</p>
                <p>Fecha inicio: ${formatoFecha(clase.fechaInicio)}</p>
                <p>Fecha fin: ${formatoFecha(clase.fechaFin)}</p>
                <p>Duración: ${horas.toFixed(2)} hora${horas !== 1 ? 's' : ''}</p>
                <p>Precio: ${clase.precio.toFixed(2)} €</p>
                <p>En cuanto ${profesor.nombre} acepte tu solicitud, te enviaremos un correo con los detalles</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA.</p>`
            })
        ]);
        
        console.log('Emails enviados exitosamente');
    } catch (emailError) {
        console.error('Error enviando emails:', emailError);
     
    }
}


// funcion que envia emails de rechazo de clase cuando la rechaza un usuario
const enviarEmailsRechazoUsuario = async (profesor, alumno, clase, instrumento) => {
    try {
        
        
        await Promise.all([
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: `Clase de ${alumno.nombre} rechazada`,
                to: profesor.email,
                html: `<h1>Rechazo de clase reservada</h1>
                <p>Tu alumno <strong>${alumno.nombre}</strong> ha decidido cancelar la reserva de la clase de <strong>${instrumento}</strong> que teníais programada el ${formatoFecha(clase.fechaInicio)}, disculpa las molestias, el motivo escapa de nuestro control.</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA.</p>`
            }),
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Clase rechazada",
                to: alumno.email,
                html: `<h1>Clase rechazada</h1>
                <p>Tu clase con ${profesor.nombre} de <strong>${instrumento}</strong> del día ${formatoFecha(clase.fechaInicio)} ha sido rechazada correctamente, disculpa las molestias, esperemos que encuentres la inspiración para seguir aprendiendo.</p>
                <br/><br/>
                <p>Ticket: <br/>
                - Profesor: ${clase.profesor}<br/> 
                - Alumno: ${clase.alumno} <br/> 
                - Instrumento: ${clase.instrumento} 
                - Horario: ${clase.fechaInicio} - ${clase.fechaFin.getHours()}:${clase.fechaFin.getMinutes() >0 ? clase.fechaFin.getMinutes() : '00'}<br/> 
                - Subtotal: ${clase.precio*1.07}€<br/><br/></p>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA!</p>`
            })
        ]);
        
        console.log('Emails enviados correctamente');
    } catch (emailError) {
        console.error('Error enviando emails:', emailError);
    }
}


const enviarEmailsPagada = async (profesor, alumno, clase, instrumento) => {
    try {
        const formatoFecha = (fecha) => fecha.toLocaleString('es-ES');
        
        await Promise.all([
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Solicitud de reserva de clase",
                to: profesor.email,
                html: `<h1>Solicitud de reserva de clase</h1>
                <p>Alumno: ${alumno.nombre}</p>
                <p>Instrumento: ${instrumento.nombre}</p>
                <p>Descripción: ${descripcion}</p>
                <p>Fecha inicio: ${formatoFecha(clase.fechaInicio)}</p>
                <p>Fecha fin: ${formatoFecha(clase.fechaFin)}</p>
                <p>Duración: ${horas.toFixed(2)} hora${horas !== 1 ? 's' : ''}</p>
                <p>Precio: ${clase.precio.toFixed(2)} €</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA!</p>`
            }),
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Solicitud de reserva de clase exitosa",
                to: alumno.email,
                html: `<h1>Solicitud de reserva de clase exitosa</h1>
                <p>Profesor: ${profesor.nombre}</p>
                <p>Instrumento: ${instrumento.nombre}</p>
                <p>Descripción: ${descripcion}</p>
                <p>Fecha inicio: ${formatoFecha(clase.fechaInicio)}</p>
                <p>Fecha fin: ${formatoFecha(clase.fechaFin)}</p>
                <p>Duración: ${horas.toFixed(2)} hora${horas !== 1 ? 's' : ''}</p>
                <p>Precio: ${clase.precio.toFixed(2)} €</p>
                <p>En cuanto ${profesor.nombre} acepte tu solicitud, te enviaremos un correo con los detalles</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA.</p>`
            })
        ]);
        
        console.log('Emails enviados exitosamente');
    } catch (emailError) {
        console.error('Error enviando emails:', emailError);
     
    }
}

const enviarEmailsRechazoProfesor = (profesor, alumno, clase, instrumento, mensaje) => {
    try {
        transporter.sendMail({
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Solicitud de reserva de clase rechazada",
            to: alumno.email,
            html: `<h1>Solicitud de reserva de clase rechazada</h1>
            <p>Lamentamos comunicarte que la clase de ${instrumento.nombre} que teníais programada el ${formatoFecha(clase.fechaInicio)} ha sido rechazada por ${profesor.nombre}, el motivo que nos ha dado para ti es el siguiente: <br/><br/><em>${mensaje}</em></p>
            <br/><br/>
            <p>Gracias por confiar en nosotros!</p>
            <p>Un saludo, el equipo de TONALYA.</p>`
            
        })
    } catch (exception) {
        console.error('Error enviando emails:', exception);
    }
}

const enviarEmailsAceptada = (profesor, alumno, clase, instrumento) => {
    try {
        transporter.sendMail({
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Solicitud de reserva de clase aceptada",
            to: alumno.email,
            html: `<h1>Solicitud de reserva de clase aceptada, ya puedes abonar el importe</h1>
            <p>Hola ${alumno.nombre}! Nos complace comunicarte que <strong>${profesor.nombre}</strong> ha decidido aceptar tu solicitud de clase de ${instrumento.nombre}. Cuando quieras puedes abonar el importe para asegurar tu asistencia, recuerda hacerlo cuanto antes! si no lo haces, el profesor podrá rechazar tu solicitud.</p>
            <br><br>
            <p>Descripción: ${clase.descripcion}</p>
            <p>Horario: ${formatoFecha(clase.fechaInicio)} - ${clase.fechaFin.getHours()}:${clase.fechaFin.getMinutes() > 0 ? clase.fechaFin.getMinutes() : '00'}</p>
            <p>Precio: ${clase.precio.toFixed(2)}€</p>
            <br/><br/>
            <p>Gracias por confiar en nosotros!</p>
            <p>Un saludo, el equipo de TONALYA.</p>`
        })
    } catch (exception) {
        console.error('Error enviando emails:', exception);
    }
}


export {insertarInstrumentos, enviarEmailsReserva, enviarEmailsRechazoUsuario, enviarEmailsPagada, enviarEmailsRechazoProfesor, enviarEmailsAceptada};