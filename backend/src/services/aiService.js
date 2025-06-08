import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to generate trip itinerary using Gemini AI
export const generateTripItinerary = async (trip) => {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Format dates for prompt
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    // Generate the prompt for AI
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
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    // Parse the JSON
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
    
    // Update the trip in the database with the new itinerary
    const updatedTrip = await trip.constructor.findByIdAndUpdate(
      trip._id,
      { itinerary: processedItinerary },
      { new: true }
    );
    
    return processedItinerary;
  } catch (error) {
    console.error('AI itinerary generation error:', error);
    // If AI fails, generate a fallback itinerary
  }
};

