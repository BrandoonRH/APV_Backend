import nodemailer from "nodemailer"; 

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
 
      const {email, name, token } = data; 

      //Enviar Email 
      const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria", 
        to: email,
        subject: 'Comprueba tu Cuenta en APV', 
        text: 'Comprueba tu Cuenta en APV',
        html: `<p>Hola: ${name}, hemos recibido información para crear una Cuenta en APV</p>
        <p>Tu Cuenta esta casi lista, Solo debes comprobarla ingresando al siguiente enlance: 
        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Comprobar Cuenta</a></p>

        <p>Si no creaste esta cuenta, Puedes ignorar este mensaje</p>
        `,
      });
      console.log("Mensaje Enviado: %s", info.messageId); 
}

export default emailRegister; 