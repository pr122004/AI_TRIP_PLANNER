import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTripItinerary = async (trip) => {
  try {

    const model = genAI.getGenerativeModel({ model: "learnlm-2.0-flash-experimental" });
    
    // Format dates for prompt
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    
    const prompt = `
      Generate a detailed day-by-day travel itinerary for a trip to ${trip.destination}.
      
      Trip details:
      - Duration: ${trip.duration} days (${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()})
      - Number of travelers: ${trip.travelers}
      - Budget: ${trip.budget}
      - Interests: ${trip.interests.join(', ')}
      - Pace: ${trip.pace}
      ${trip.accommodation ? `- Preferred accommodation: ${trip.accommodation}` : ''}
      ${trip.notes ? `- Additional notes: ${trip.notes}` : ''}
      
      Please provide a detailed itinerary with:
      1. A title for each day
      2. 4-6 activities per day, including meals, attractions, and experiences
      3. For each activity, include: time, title, location, and a brief description
      4. Suggest local restaurants and attractions that match the interests
      
      Format the response as JSON with this structure:
      [
        {
          "date": "YYYY-MM-DD",
          "title": "Day 1: Title",
          "description": "Brief description of the day",
          "activities": [
            {
              "time": "09:00 AM",
              "title": "Activity name",
              "type": "breakfast/sightseeing/etc",
              "location": "Location name",
              "description": "Brief description"
            }
          ]
        }
      ]
      
      Focus on providing a realistic, well-paced itinerary that includes both popular attractions and local experiences.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const itinerary = JSON.parse(jsonMatch[0]);
    
    // Process the itinerary to ensure proper date format
    const processedItinerary = itinerary.map((day, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      
      return {
        ...day,
        date: currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      };
    });
    
    const updatedTrip = await trip.constructor.findByIdAndUpdate(
      trip._id,
      { itinerary: processedItinerary },
      { new: true }
    );
    
    return processedItinerary;
  } catch (error) {
    console.error('AI itinerary generation error:', error);
  }
};

