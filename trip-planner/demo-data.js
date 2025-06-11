// Demo data for showcasing TripAdvisor-like features
// This file contains sample data that would typically come from APIs

const demoDestinations = {
  "paris": {
    name: "Paris, France",
    rating: 4.8,
    reviewCount: 25847,
    images: [
      "eiffel-tower.jpg",
      "louvre-museum.jpg", 
      "seine-river.jpg",
      "montmartre.jpg"
    ],
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Champs-Élysées"],
    bestTime: "April-June, September-October",
    currency: "EUR (€)",
    language: "French",
    timeZone: "CET (UTC+1)",
    averageTemp: "15°C (59°F)",
    topAttractions: [
      {
        name: "Eiffel Tower",
        rating: 4.6,
        category: "Landmark",
        price: "€25",
        duration: "2-3 hours"
      },
      {
        name: "Louvre Museum", 
        rating: 4.7,
        category: "Museum",
        price: "€17",
        duration: "3-4 hours"
      }
    ]
  },
  "tokyo": {
    name: "Tokyo, Japan",
    rating: 4.7,
    reviewCount: 18923,
    highlights: ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing", "Imperial Palace"],
    bestTime: "March-May, September-November", 
    currency: "JPY (¥)",
    language: "Japanese",
    timeZone: "JST (UTC+9)",
    averageTemp: "16°C (61°F)"
  },
  "newyork": {
    name: "New York City, USA",
    rating: 4.5,
    reviewCount: 31456,
    highlights: ["Statue of Liberty", "Central Park", "Times Square", "Brooklyn Bridge"],
    bestTime: "April-June, September-November",
    currency: "USD ($)",
    language: "English", 
    timeZone: "EST (UTC-5)",
    averageTemp: "13°C (55°F)"
  }
};

const expertRecommendations = {
  restaurants: [
    {
      name: "Le Comptoir du Relais",
      cuisine: "French Bistro",
      rating: 4.8,
      priceRange: "€€€",
      specialty: "Traditional French dishes with modern twist"
    },
    {
      name: "L'As du Fallafel",
      cuisine: "Middle Eastern",
      rating: 4.6,
      priceRange: "€",
      specialty: "Best falafel in the Marais district"
    }
  ],
  activities: [
    {
      name: "Seine River Evening Cruise",
      category: "Sightseeing",
      rating: 4.7,
      duration: "1.5 hours",
      price: "€35",
      highlights: ["Illuminated monuments", "Audio guide", "Photo opportunities"]
    },
    {
      name: "Versailles Day Trip",
      category: "Historical",
      rating: 4.8,
      duration: "Full day",
      price: "€85",
      highlights: ["Palace tour", "Gardens", "Transportation included"]
    }
  ]
};

const travelTips = {
  transportation: {
    metro: "Buy a weekly Navigo pass for unlimited metro/bus travel",
    taxi: "Use official taxi stands or apps like Uber/Bolt",
    walking: "Paris is very walkable - comfortable shoes recommended"
  },
  cultural: {
    greeting: "Say 'Bonjour' when entering shops",
    dining: "Lunch is typically 12-2pm, dinner after 7:30pm",
    tipping: "Service charge included, but 5-10% tip appreciated"
  },
  practical: {
    language: "Learn basic French phrases - locals appreciate the effort",
    shopping: "Shops closed on Sundays, sales periods: January & July",
    safety: "Watch for pickpockets in tourist areas and metro"
  }
};

// Weather data by month
const weatherData = {
  paris: {
    january: { temp: "7°C", rain: "High", daylight: "8hrs" },
    april: { temp: "15°C", rain: "Medium", daylight: "13hrs" },
    july: { temp: "25°C", rain: "Low", daylight: "16hrs" },
    october: { temp: "16°C", rain: "Medium", daylight: "11hrs" }
  }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demoDestinations,
    expertRecommendations, 
    travelTips,
    weatherData
  };
}
