import { generateTripItinerary } from '../services/aiService.js';

// Generate itinerary for a trip
export const generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      budget,
      interests,
      pace,
      accommodation,
      notes,
    } = req.body;

    // Create a mock trip object to pass to the generator
    const tripData = {
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      budget,
      interests,
      pace,
      accommodation,
      notes,
      user: req.user?.id || null,
    };

    const itinerary = await generateTripItinerary(tripData);

    res.status(200).json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error('Generate itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary',
      error: error.message,
    });
  }
};