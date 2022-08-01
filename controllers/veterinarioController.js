import Veterinario from "../models/Veterinario.js"
import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import emailRegister from "../helpers/emailREgister.js";
import restorePassword from "../helpers/restorePassword.js";


const register = async (req, res) => {
//Caundo mandas algo en express de tipo POST se almacena en el Req.Body 
const { email, name } = req.body; 
//Prevenir Usuario Dupliucado
const userExist = await Veterinario.findOne({email}); 

if(userExist){
    const error = new Error("Usuario ya Registrado"); 
    return res.status(400).json({msg: error.message}); 
}

 try {
    //Guardar Veterinario 
    const veterinario = new Veterinario(req.body); 
    const veterinarioSave = await veterinario.save();
    //Enviar Email 
    emailRegister({
       name, 
       email, 
       token: veterinarioSave.token
    });
    //res.json(veterinarioSave);
    res.json({msg: "Usuario Registrado"}); 
    console.log(veterinarioSave); 
 } catch (error) {
    console.log(error)
 }
}//End to Register 


const profile = (req, res) => {
    const { userVeterinario } = req
    res.json({userVeterinario}); 
}

const confirmUser = async (req, res) => {
    //Utilizas req.params para leer variables en la url 
    const { token } = req.params; 
    const userTokenExist = await Veterinario.findOne({token}); 

    if(!userTokenExist){
        const error = new Error("Token no Valido"); 
        return res.status(404).json({msg: error.message}); 
    }
    try {
        userTokenExist.token = null; 
        userTokenExist.confirm = true; 
        await userTokenExist.save(); 
        res.json({msg: "Cuenta Confirmada Correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const authUser = async(req, res) => {

    const { email, password } = req.body; 

    //Comprobar que el usuario existe 
    const userExist = await Veterinario.findOne({email}); 
    if(!userExist){
        const error = new Error("Usuario No Existe"); 
        return res.status(404).json({msg: error.message}); 
    } 

    //Comprobar que el usuario este confirmado 
    if(!userExist.confirm){
        const error = new Error("Usuario NO Confirmado"); 
        return res.status(403).json({msg: error.message}); 
    }

    //Comprobar User 
    if(await userExist.checkPassword(password)){
     //Auth User 
    
     res.json({
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email, 
        telefono: userExist.telefono,
        web: userExist.web,
        token: generateJWT(userExist.id)
     })
    }else{
        const error = new Error("Password Icorrecto "); 
        return res.status(403).json({msg: error.message}); 
    }
}

const recoverPassword = async (req, res) =>{
 const { email } = req.body;

    const userVeterinarioExist = await Veterinario.findOne({email}); 

    if(!userVeterinarioExist){
        const error = new Error("El usuario no existe"); 
        return res.status(403).json({msg: error.message}); 
    }

    try {
        userVeterinarioExist.token = generateToken(); 
        await userVeterinarioExist.save(); 
        //Enviar Email de INstrucciones 

        restorePassword({
            name: userVeterinarioExist.name,
            email,
            token: userVeterinarioExist.token,
        })

        res.json({msg: "Hemos enviado un Email con las Instrucciones"}); 
    } catch (error) {
        console.log(error); 
    }

}

const checkToken = async (req, res) =>{
    const {token} = req.params;
    const tokenValidate = await Veterinario.findOne({token});
    if(tokenValidate){
        res.json({msg: "Token Valido y el Usuario Existe"}); 
    }else{
        const error = new Error("Token NO Valido"); 
        return res.status(403).json({msg: error.message}); 
    }
}

const newPassword = async (req, res) =>{
   const { token } = req.params;
   const { password } = req.body;

   const veterinario = await Veterinario.findOne({token}); 
   if(!veterinario){
    const error = new Error("Hubo un Error"); 
    return res.status(400).json({msg: error.message}); 
   }

   try {
    veterinario.token = null; 
    veterinario.password = password;
    await veterinario.save(); 
    res.json({msg: "Password Modificado Correcto"}); 

   } catch (error) {
    console.log(error)
   }
}

const updateProfile = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id); 
    if(!veterinario){
        const error = new Error("Hubo un Error, Vuelve a Intentarlo"); 
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body; 
    if(veterinario.email !== req.body.email){
        const existEmail = await Veterinario.findOne({email}); 
        if(existEmail){
            const error = new Error("El Email ya se Encuentra Registrado"); 
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.name = req.body.name || veterinario.name; 
        veterinario.email = req.body.email || veterinario.email; 
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;  

        const veterinarioUpdate = await veterinario.save();
        res.json(veterinarioUpdate); 

    } catch (error) {
        console.log(error)
    }
}
const changePassword = async (req, res) =>{
  //Leer Datos 
 const {id} = req.userVeterinario; 
 const {password, new_password} = req.body;

  //Comprobar que el Usuario Exista 
  const veterinario = await Veterinario.findById(id); 
  if(!veterinario){
      const error = new Error("Hubo un Error, Vuelve a Intentarlo"); 
      return res.status(400).json({msg: error.message});
  }

  //Comprobar su Password
if(await veterinario.checkPassword(password)){
    //Alamcenar el NUevo Password 
    veterinario.password = new_password;
    await veterinario.save(); 
    res.json({msg: 'Password Amacenado Correctamente'}); 
}else{
    const error = new Error("El Password Actual es Incorrecto"); 
      return res.status(400).json({msg: error.message});

}//End To changePassword

  

}


export {
    register,
    profile, 
    confirmUser,
    authUser,
    recoverPassword,
    checkToken,
    newPassword, 
    updateProfile,
    changePassword
    
}