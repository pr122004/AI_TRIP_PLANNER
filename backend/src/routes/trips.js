import { Router} from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { verifyJWT } from '../middlewares/auth.js';
import mongoose from 'mongoose';

const router = Router();

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Trip ID' });
  }
  next();
};


// Routes
router.route('/').get(verifyJWT, getTrips).post(verifyJWT, createTrip);
router.route('/:id')
  .get(verifyJWT, validateObjectId, getTripById)
  .put(verifyJWT, validateObjectId, updateTrip)
  .delete(verifyJWT, validateObjectId, deleteTrip);


export default router;
