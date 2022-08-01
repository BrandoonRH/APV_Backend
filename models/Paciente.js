import mongoose from "mongoose"; 

const pacientesShema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario"
    },

}, {
  timestamps: true
}); 

const Paciente = mongoose.model("Paciente", pacientesShema); 
export default Paciente; 