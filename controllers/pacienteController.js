import Paciente from "../models/Paciente.js";

//Añadir Paciente 
const addPaciente = async (req, res) => {
   const paciente = new Paciente(req.body);
   paciente.veterinario = req.userVeterinario._id;
   try {
    const pacienteSave = await paciente.save(); 
    res.json(pacienteSave);
   } catch (error) {
    console.log(error); 
   }
}; 

//Obtener Pacientes
const getPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.userVeterinario);
    res.json(pacientes)
}; 

//Obtener paciente para acción
const getPaciente = async (req, res) => {
    const { id } = req.params; 
    const pacienteFind = await Paciente.findById(id); 

    if(!pacienteFind){
      res.status(404).json({msg: "Paciente NO encontrado"}); 
    }
    
    if(pacienteFind.veterinario._id.toString() !== req.userVeterinario._id.toString()){
     return res.json({msg: "Acción no Permitida"}); 
    }

    if(pacienteFind){
        res.json(pacienteFind); 
    }
}; 

//Editar Paciente
const updatePaciente = async (req, res) => {
    const { id } = req.params; 
    const pacienteFind = await Paciente.findById(id); 

    if(!pacienteFind){
      res.status(404).json({msg: "Paciente NO encontrado"}); 
    }
    
    if(pacienteFind.veterinario._id.toString() !== req.userVeterinario._id.toString()){
     return res.json({msg: "Acción no Permitida"}); 
    }
       //Actualizar Paciente 
       pacienteFind.name = req.body.name || pacienteFind.name; 
       pacienteFind.propietario = req.body.propietario || pacienteFind.propietario; 
       pacienteFind.email = req.body.email || pacienteFind.email; 
       pacienteFind.fecha = req.body.fecha || pacienteFind.fecha; 
       pacienteFind.sintomas = req.body.sintomas || pacienteFind.sintomas;

       try {
        const pacienteUpdate = await pacienteFind.save();
        res.json(pacienteUpdate); 
       } catch (error) {
        console.log(error)
       }

}; 

//Eliminar Paciente
const deletePaciente = async (req, res) => {
    const { id } = req.params; 
    const pacienteFind = await Paciente.findById(id); 

    if(!pacienteFind){
      res.status(404).json({msg: "Paciente NO encontrado"}); 
    }
    
    if(pacienteFind.veterinario._id.toString() !== req.userVeterinario._id.toString()){
     return res.json({msg: "Acción no Permitida"}); 
    }

    try {
        await pacienteFind.deleteOne(); 
        res.json({msg: "Paciente Eliminado"}); 
    } catch (error) {
        console.log(error)
    }
}; 


export {
    addPaciente,
    getPacientes,
    getPaciente,
    updatePaciente,
    deletePaciente
}