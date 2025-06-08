import Trip from '../models/Trip.js';
import {User} from '../models/User.js';
import { generateTripItinerary } from '../services/aiService.js';

// Get all trips for the authenticated user
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort('-createdAt');
    
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trips',
      error: error.message,
    });
  }
};

// Get a single trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }
    
    // Check if the trip belongs to the authenticated user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this trip',
      });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trip',
      error: error.message,
    });
  }
};

// Create a new trip
export const createTrip = async (req, res) => {
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
    
    // Create trip
    const trip = await Trip.create({
      user: req.user.id,
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
      // Random image URL based on destination
      imageUrl: `https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&h=650`,
    });
    
    //Add trip to user's trips
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { trips: trip._id } }
    );
    
    // Generate itinerary with AI (this will be processed asynchronously)
    await generateTripItinerary(trip).catch(err => 
      console.error(`Error generating itinerary for trip ${trip._id}:`, err)
    );
    
    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message,
    });
  }
};

// Update a trip
export const updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }
    
    // Check if the trip belongs to the authenticated user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trip',
      });
    }
    
    // Update trip
    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip',
      error: error.message,
    });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }
    
    // Check if the trip belongs to the authenticated user
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this trip',
      });
    }
    
    // Remove trip from user's trips
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { trips: trip._id } }
    );
    
    // Delete trip
    await Trip.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip',
      error: error.message,
    });
  }
};