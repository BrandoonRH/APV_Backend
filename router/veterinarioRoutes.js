import express from "express"; 
import { register, profile, confirmUser, authUser, recoverPassword, checkToken, newPassword, updateProfile, changePassword  } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router(); 


//Public 
router.post('/register', register)
router.get('/confirm/:token', confirmUser )
router.post('/login', authUser )

router.post('/recover-password', recoverPassword )

router.get('/recover-password/:token', checkToken )
router.post('/recover-password/:token', newPassword )
//router.route('recover-password/:token').get(checkToken).post(newPassword) //Sintaxis cons get y post en misma url 


//Private 
router.get('/profile', checkAuth,  profile )
router.put('/profile/updatepassword', checkAuth, changePassword)
router.put('/profile/:id', checkAuth, updateProfile)



export default router; 