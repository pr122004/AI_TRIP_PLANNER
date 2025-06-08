import { Router } from 'express';
import { generateTripItinerary } from '../services/aiService.js';
import { verifyJWT } from '../middlewares/auth.js';

const router = Router();

// All routes are protected
// router.use(protect);

router.route('/generate-itinerary').post(verifyJWT, generateTripItinerary)
 
export default router;