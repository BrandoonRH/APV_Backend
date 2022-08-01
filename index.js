import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import connectDB from './config/db.js';
import veterinarioRoutes from './router/veterinarioRoutes.js'; 
import pacienteRoutes from './router/pacienteRoutes.js'; 

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

const allowedDomains = [process.env.FRONTEND_URL]; 

const corsOptions = {
    origin: function(origin, callback){
      if(allowedDomains.indexOf(origin) !== -1 ){
        //El Origen del Request esta Permitido 
        callback(null, true); 

      }else{
        callback(new Error('Accion no permitida por CORS')); 
      }
    }
}
app.use(cors(corsOptions)); 

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el Puerto ${PORT}`);
})