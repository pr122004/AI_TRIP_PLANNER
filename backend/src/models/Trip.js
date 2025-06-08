import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  time: String,
  title: String,
  type: String,
  location: String,
  description: String,
  notes: String,
  price: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const daySchema = new mongoose.Schema({
  date: String,
  title: String,
  description: String,
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: Number,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    budget: {
      type: String,
      enum: ['budget', 'medium', 'luxury'],
      default: 'medium',
    },
    interests: {
      type: [String],
      default: [],
    },
    pace: {
      type: String,
      enum: ['relaxed', 'moderate', 'busy'],
      default: 'moderate',
    },
    accommodation: String,
    notes: String,
    itinerary: [daySchema],
    imageUrl: String,
    status: {
      type: String,
      enum: ['draft', 'planning', 'confirmed', 'completed', 'cancelled'],
      default: 'planning',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total estimated cost
tripSchema.virtual('estimatedCost').get(function () {
  // You could add logic here to calculate based on duration, budget, etc.
  return 0;
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;