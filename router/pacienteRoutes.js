import express from "express"; 
const router = express.Router(); 
import { addPaciente , getPacientes, getPaciente, updatePaciente, deletePaciente} from '../controllers/pacienteController.js'
import checkAuth from "../middleware/authMiddleware.js";

router.route('/')
    .post( checkAuth, addPaciente)
    .get( checkAuth, getPacientes)

router.route('/:id')
    .get(checkAuth, getPaciente)
    .put(checkAuth, updatePaciente)
    .delete(checkAuth, deletePaciente)



export default router; 