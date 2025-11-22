"use strict";
import Instrumento from "./models/Instrumento.js";
import arrInstrumentos from "./bdInstrumentos.js"; 
import nodemailer from 'nodemailer';

export const insertarInstrumentos = async (req, res) => {
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

// PARA ENVIAR LOS EMAILS => PASS ES CONTRASEÑA DE APLICACIÓN GOOGLE

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
export const enviarEmailsReserva = async (profesor, alumno, instrumento, clase, descripcion, horas) => {
    try {
        
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

//funcion que envia email de bienvenida a profesor al registrarse e incita a modificar su perfil para escribir su bio
export const emailBienvenidaProfesor = async (profesor) => {
    try {
        await transporter.sendMail({
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Bienvenido a TONALYA",
            to: profesor.email,
            html: `<h1>¡Bienvenido a TONALYA!</h1>
            <p>¡Gracias por unirte a nuestra comunidad de músicos!</p>
            <p>Es todo un placer contar contigo entre nosotros, ${profesor.nombre}. Si acceder a tu perfil y editar tu biografía, añadir o eliminar instrumentos, y cambiar tu foto de perfil, inicia sesión en nuestro sitio web: <a href="http://localhost:5173/">TONALYA</a>. Recuerda que en tu perfil también estarán los detalles de tus clases.</p>
            <p>Mucho ánimo y a por ello!</p>
            <p>Un saludo, el equipo de TONALYA.</p>`
        });
        console.log('Email de bienvenida enviado exitosamente');
    } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError);
    }
}

export const emailBienvenidaAlumno = async (usuario) => {
    try {
        await transporter.sendMail({
            from: '"TONALYA" <tonalyamusica@gmail.com>',
            to: usuario.email,
            subject: `Bienvenido a TONALYA, ${usuario.nombre}`,
            html: `<h1>Gracias por registrarte en TONALYA, ${usuario.nombre}.<h1><br> <p>¡Nos alegra tenerte con nosotros!</p><br><p>No olvides buscar profesor en ${usuario.provincia} que te pueda servir de ayuda!</p> <p>Para acceder a tu perfil, inicia sesión en nuestro sitio web: <a href="http://localhost:5173/">TONALYA</a>
            <p>Gracias por confiar en nosotros!</p>
            <p>Un saludo, el equipo de TONALYA.</p>
            </p>`
        })
        console.log('Email de bienvenida enviado exitosamente');
    } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError);
    }
}


// funcion que envia emails de rechazo de clase cuando la rechaza un usuario
export const enviarEmailsRechazoUsuario = async (profesor, alumno, clase, instrumento) => {
    try {
        
        
        await Promise.all([
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: `Clase de ${alumno.nombre} rechazada`,
                to: profesor.email,
                html: `<h1>Rechazo de clase reservada</h1>
                <p>Tu alumno <strong>${alumno.nombre}</strong> ha decidido cancelar la reserva de la clase de <strong>${instrumento.nombre}</strong> que teníais programada el ${formatoFecha(clase.fechaInicio)}, disculpa las molestias, el motivo escapa de nuestro control.</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA.</p>`
            }),
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Clase rechazada",
                to: alumno.email,
                html: `<h1>Clase rechazada</h1>
                <p>Tu clase con ${profesor.nombre} de <strong>${instrumento.nombre}</strong> del día ${formatoFecha(clase.fechaInicio)} ha sido rechazada correctamente, disculpa las molestias, esperemos que encuentres la inspiración para seguir aprendiendo.</p>
                <br/><br/>
                
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA!</p>`
            })
        ]);
        
        console.log('Emails enviados correctamente');
    } catch (emailError) {
        console.error('Error enviando emails:', emailError);
    }
}


export const enviarEmailsPagada = async (profesor, alumno, clase, instrumento) => {
    try {
        const formatoFecha = (fecha) => fecha.toLocaleString('es-ES');
        
        const precio = clase?.precio || profesor?.precioHora || 0;
        const precioConIVA = (precio * 1.07).toFixed(2);
        const precioFormateado = precio.toFixed(2);
        await Promise.all([
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Clase pagada",
                to: profesor.email,
                html: `<h1>Clase de tu alumno pagada</h1>
                <p>Alumno: ${alumno.nombre}</p>
                <p>Instrumento: ${instrumento.nombre}</p>
                <p>Descripción: ${clase.descripcion}</p>
                <p>Fecha inicio: ${formatoFecha(clase.fechaInicio)}</p>
                <p>Fecha fin: ${formatoFecha(clase.fechaFin)}</p>
                <p>Horario: ${formatoFecha(clase.fechaInicio)} - ${clase.fechaFin.getHours()}:${clase.fechaFin.getMinutes() >0 ? clase.fechaFin.getMinutes() : '00'}</p>
                <p>Precio: ${precioFormateado} €</p>
                <br/><br/>
                <p>Gracias por confiar en nosotros!</p>
                <p>Un saludo, el equipo de TONALYA!</p>`
            }),
            transporter.sendMail({
                from: "TONALYA <tonalyamusica@gmail.com>",
                subject: "Clase pagada",
                to: alumno.email,
                html: `<h1>Clase pagada con éxito</h1>
                <p>Esperemos que disfrutes de tu clase con ${profesor.nombre}!</p><br/><br/>
                <p>Ticket: <br/>
                - Profesor: ${profesor.nombre}<br/> 
                - Alumno: ${alumno.nombre} <br/> 
                - Instrumento: ${instrumento.nombre} 
                - Horario: ${formatoFecha(clase.fechaInicio)} - ${clase.fechaFin.getHours()}:${clase.fechaFin.getMinutes() >0 ? clase.fechaFin.getMinutes() : '00'}<br/> 
                - Subtotal: ${precioConIVA}€<br/><br/></p>
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

export const enviarEmailsRechazoProfesor = (profesor, alumno, clase, instrumento, mensaje) => {
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

export const enviarEmailsAceptada = (profesor, alumno, clase, instrumento) => {
    try {
        transporter.sendMail({
            from: "TONALYA <tonalyamusica@gmail.com>",
            subject: "Solicitud de reserva de clase aceptada",
            to: alumno.email,
            html: `<h1>Solicitud de reserva de clase aceptada, ya puedes abonar el importe</h1>
            <p>Hola ${alumno.nombre}! Nos complace comunicarte que <strong>${profesor.nombre}</strong> ha decidido aceptar tu solicitud de clase de ${instrumento.nombre}. Cuando quieras puedes abonar el importe para asegurar tu asistencia, recuerda hacerlo cuanto antes! si no lo haces, el profesor podrá rechazar tu solicitud.</p>
            <br><br>
            <p>Ticket: <br/>
                - Profesor: ${profesor.nombre}<br/> 
                - Alumno: ${alumno.nombre} <br/> 
                - Instrumento: ${instrumento.nombre} 
                - Horario: ${formatoFecha(clase.fechaInicio)} - ${clase.fechaFin.getHours()}:${clase.fechaFin.getMinutes() >0 ? clase.fechaFin.getMinutes() : '00'}<br/> 
                - Subtotal: ${(clase.precio*1.07).toFixed(2)}€<br/><br/></p>
            <p>Gracias por confiar en nosotros!</p>
            <p>Un saludo, el equipo de TONALYA.</p>`
        })
    } catch (exception) {
        console.error('Error enviando emails:', exception);
    }
}

