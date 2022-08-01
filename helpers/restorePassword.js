import nodemailer from "nodemailer"; 

const restorePassword = async (data) => {
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
        subject: 'Restablece tu Password', 
        text: 'Restablece tu Password',
        html: `<p>Hola: ${name}, has solicitado restablecer tu password</p>
        <p>Ingresa al siguiente enlance para modificarlo: 
        <a href="${process.env.FRONTEND_URL}/recover-password/${token}">Cambiar Password</a></p>

        <p>Si no creaste esta cuenta, Puedes ignorar este mensaje</p>
        `,
      });
      console.log("Mensaje Enviado: %s", info.messageId); 
}

export default  restorePassword;