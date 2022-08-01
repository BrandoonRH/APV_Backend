import mongoose from "mongoose"; 
import bcrypt from "bcrypt"; 
import generateTokenUnique from "../helpers/generateToken.js"; 

const veterinarioSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generateTokenUnique(),
    }, 
    confirm:{
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre("save", async function (next){
    //Utilizamos Function para acceder al objeto actual de this ya que una arrow funciton nos apareceria undefinded 
    if(!this.isModified("password")){
      next(); //Si el password ya esta Hash se va al siguiente 
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt); 
}); 

veterinarioSchema.methods.checkPassword = async function(passForm){
 return await bcrypt.compare(passForm, this.password)
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario; 
