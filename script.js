const API_KEY =
  "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";

// Initialize destination database - will be loaded asynchronously
let destinationDatabase = {};
let countriesAndCities = {};

// Load destination database from JSON file
async function loadDestinationDatabase() {
  try {
    const response = await fetch('destinations-database.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Update the global variables with data from the JSON file
    destinationDatabase = data.destinations || {};
    countriesAndCities = data.countries_and_cities || {};
    
    console.log('Destination database loaded successfully');
    console.log(`Loaded ${Object.keys(destinationDatabase).length} destinations and ${Object.keys(countriesAndCities).length} countries`);
    
    // Initialize the UI with the loaded data
    loadCountries();
  } catch (error) {
    console.error('Error loading destination database:', error);
    // Fallback to sample data if loading fails
    destinationDatabase = {
      "paris-france": {
        name: "Paris, France",
        country: "France",
        rating: 4.6,
        reviewCount: 15428,
        highlights: ["Eiffel Tower", "Louvre Museum", "Seine River", "Montmartre"],
        bestTime: "April-June, September-October",
        currency: "EUR (€)",
        language: "French",
        timezone: "CET (UTC+1)",
        population: "2.2 million",
        founded: "3rd century BC"
      },
      "london-uk": {
        name: "London, United Kingdom",
        country: "United Kingdom", 
        rating: 4.5,
        reviewCount: 23891,
        highlights: ["Big Ben", "Tower Bridge", "British Museum", "Thames River"],
        bestTime: "May-September",
        currency: "GBP (£)",
        language: "English",
        timezone: "GMT (UTC+0)",
        population: "8.9 million",        founded: "43 AD"
      },
      "rome-italy": {
        name: "Rome, Italy",
        country: "Italy",
        rating: 4.7,
        reviewCount: 19634,
        highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum"],
        bestTime: "April-June, September-October",
        currency: "EUR (€)",
        language: "Italian",
        timezone: "CET (UTC+1)",
        population: "2.8 million",
        founded: "753 BC"
  },      "barcelona-spain": {
        name: "Barcelona, Spain",
        country: "Spain",
        rating: 4.6,
        reviewCount: 17892,
        highlights: ["Sagrada Familia", "Park Güell", "Gothic Quarter", "La Rambla"],
        bestTime: "May-June, September-October",
        currency: "EUR (€)",
        language: "Spanish/Catalan",
        timezone: "CET (UTC+1)",
        population: "1.6 million",
        founded: "15 BC"
      },
  "amsterdam-netherlands": {
    name: "Amsterdam, Netherlands",
    country: "Netherlands",
    rating: 4.4,
    reviewCount: 14523,
    highlights: ["Canal Ring", "Anne Frank House", "Van Gogh Museum", "Jordaan District"],
    bestTime: "April-October",
    currency: "EUR (€)",
    language: "Dutch",
    timezone: "CET (UTC+1)",
    population: "872,000",
    founded: "1275"
  },
  
  // Asia
  "tokyo-japan": {
    name: "Tokyo, Japan", 
    country: "Japan",
    rating: 4.7,
    reviewCount: 12847,
    highlights: ["Cherry Blossoms", "Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing"],
    bestTime: "March-May, September-November",
    currency: "JPY (¥)",
    language: "Japanese",
    timezone: "JST (UTC+9)",
    population: "13.9 million",
    founded: "1457"
  },
  "bangkok-thailand": {
    name: "Bangkok, Thailand",
    country: "Thailand",
    rating: 4.3,
    reviewCount: 16789,
    highlights: ["Grand Palace", "Wat Pho Temple", "Floating Markets", "Khao San Road"],
    bestTime: "November-March",
    currency: "THB (฿)",
    language: "Thai",
    timezone: "ICT (UTC+7)",
    population: "8.3 million",
    founded: "1782"
  },
  "singapore-singapore": {
    name: "Singapore",
    country: "Singapore",
    rating: 4.5,
    reviewCount: 13456,
    highlights: ["Gardens by the Bay", "Marina Bay Sands", "Sentosa Island", "Clarke Quay"],
    bestTime: "February-April",
    currency: "SGD (S$)",
    language: "English/Mandarin/Malay/Tamil",
    timezone: "SGT (UTC+8)",
    population: "5.9 million",
    founded: "1819"
  },
  
  // North America
  "newyorkcity-unitedstates": {
    name: "New York City, USA",
    country: "United States",
    rating: 4.5,
    reviewCount: 23591,
    highlights: ["Times Square", "Central Park", "Statue of Liberty", "Broadway"],
    bestTime: "April-June, September-November",
    currency: "USD ($)",
    language: "English",
    timezone: "EST (UTC-5)",
    population: "8.4 million",
    founded: "1624"
  },
  "losangeles-unitedstates": {
    name: "Los Angeles, USA",
    country: "United States",
    rating: 4.2,
    reviewCount: 18967,
    highlights: ["Hollywood Sign", "Santa Monica Pier", "Getty Center", "Venice Beach"],
    bestTime: "March-May, September-November",
    currency: "USD ($)",
    language: "English",
    timezone: "PST (UTC-8)",
    population: "3.9 million",
    founded: "1781"
  },
  "toronto-canada": {
    name: "Toronto, Canada",
    country: "Canada",
    rating: 4.3,
    reviewCount: 11234,
    highlights: ["CN Tower", "Distillery District", "Toronto Islands", "Royal Ontario Museum"],
    bestTime: "May-October",
    currency: "CAD (C$)",
    language: "English/French",
    timezone: "EST (UTC-5)",
    population: "2.7 million",
    founded: "1793"
  },
  
  // South America
  "riodejaneiro-brazil": {
    name: "Rio de Janeiro, Brazil",
    country: "Brazil",
    rating: 4.4,
    reviewCount: 15678,
    highlights: ["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain", "Ipanema"],
    bestTime: "December-March",
    currency: "BRL (R$)",
    language: "Portuguese",
    timezone: "BRT (UTC-3)",
    population: "6.7 million",
    founded: "1565"
  },
  "buenosaires-argentina": {
    name: "Buenos Aires, Argentina",
    country: "Argentina",
    rating: 4.3,
    reviewCount: 12890,
    highlights: ["Tango Shows", "La Boca", "Recoleta Cemetery", "San Telmo"],
    bestTime: "September-November, March-May",
    currency: "ARS ($)",
    language: "Spanish",
    timezone: "ART (UTC-3)",
    population: "3.1 million",
    founded: "1536"
  },
  
  // Africa
  "capetown-southafrica": {
    name: "Cape Town, South Africa",
    country: "South Africa",
    rating: 4.6,
    reviewCount: 9876,
    highlights: ["Table Mountain", "V&A Waterfront", "Robben Island", "Cape Point"],
    bestTime: "October-April",
    currency: "ZAR (R)",
    language: "English/Afrikaans",
    timezone: "SAST (UTC+2)",
    population: "4.6 million",
    founded: "1652"
  },
  
  // Oceania
  "sydney-australia": {
    name: "Sydney, Australia",
    country: "Australia",
    rating: 4.5,
    reviewCount: 14567,
    highlights: ["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "The Rocks"],
    bestTime: "September-November, March-May",
    currency: "AUD (A$)",
    language: "English",    timezone: "AEDT (UTC+11)",
    population: "5.3 million",
    founded: "1788"
  }
};
    
    // Fallback countries and cities if loading fails
    countriesAndCities = {
      "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth"],
      "France": ["Paris", "Lyon", "Marseille", "Nice"],
      "Germany": ["Berlin", "Munich", "Hamburg", "Cologne"],
      "India": ["Mumbai", "Delhi", "Bangalore", "Jaipur", "Agra", "Varanasi", "Goa", "Trivandrum", "Kochi"],
      "Italy": ["Rome", "Milan", "Venice", "Florence"],
      "Japan": ["Tokyo", "Osaka", "Kyoto", "Hiroshima"],
      "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
      "Singapore": ["Singapore"],
      "Spain": ["Barcelona", "Madrid", "Seville", "Valencia"],
      "Thailand": ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
      "United Kingdom": ["London", "Edinburgh", "Manchester", "Liverpool"],
      "United States": ["New York City", "Los Angeles", "Chicago", "Las Vegas"]
    };
    
    // Initialize the UI with the fallback data
    loadCountries();
  }
}

const travelRecommendations = [
  {
    icon: "fas fa-utensils",
    title: "Must-Try Local Cuisine",
    type: "Food & Dining",
    description: "Discover authentic local flavors and hidden gems recommended by food critics and locals.",
    rating: 4.8,
    priceRange: "$$ - $$$"
  },
  {
    icon: "fas fa-camera",
    title: "Instagram-Worthy Spots",
    type: "Photography",
    description: "Capture breathtaking photos at the most photogenic locations with perfect lighting tips.",
    rating: 4.7,
    priceRange: "Free - $"
  },
  {
    icon: "fas fa-hiking",
    title: "Adventure Activities",
    type: "Outdoor Adventure", 
    description: "Thrilling experiences and outdoor activities for adventure seekers and nature lovers.",
    rating: 4.6,
    priceRange: "$$ - $$$$"
  },
  {
    icon: "fas fa-shopping-bag",
    title: "Shopping Districts",
    type: "Shopping",
    description: "From luxury boutiques to local markets, find the best shopping experiences.",
    rating: 4.4,
    priceRange: "$ - $$$$"
  }
];

const travelerReviews = [
  {
    name: "Sarah M.",
    location: "California, USA",
    rating: 5,
    date: "2 weeks ago",
    review: "Absolutely incredible experience! The local recommendations were spot-on and helped us discover hidden gems we never would have found otherwise.",
    avatar: "S"
  },
  {
    name: "James K.",
    location: "London, UK", 
    rating: 4,
    date: "1 month ago",
    review: "Great trip planning tool! The itinerary was well-structured and the cost breakdown was very helpful for budgeting.",
    avatar: "J"
  },
  {
    name: "Maria L.",
    location: "Barcelona, Spain",
    rating: 5,
    date: "3 weeks ago",
    review: "The travel agent recommendations made our trip unforgettable. Every suggestion was perfectly tailored to our interests.",
    avatar: "M"
  }
];

const localTips = [
  {
    icon: "fas fa-subway",
    title: "Transportation",
    tip: "Download the local transport app and buy a weekly pass for significant savings on public transportation."
  },
  {
    icon: "fas fa-clock",
    title: "Best Times to Visit",
    tip: "Visit popular attractions early morning or late afternoon to avoid crowds and get better photos."
  },
  {
    icon: "fas fa-credit-card",
    title: "Payment Tips", 
    tip: "Many local businesses prefer cash. Always carry some local currency for small vendors and tips."
  },
  {
    icon: "fas fa-wifi",
    title: "Connectivity",
    tip: "Free WiFi is available in most cafes and public areas. Consider getting a local SIM card for better coverage."
  },
  {
    icon: "fas fa-shield-alt",
    title: "Safety",
    tip: "Keep copies of important documents in separate locations and share your itinerary with someone back home."
  },
  {
    icon: "fas fa-gift",
    title: "Souvenirs",
    tip: "Shop at local markets for authentic souvenirs at better prices than tourist shops."
  }
];

const similarDestinations = [
  { name: "Rome, Italy", price: "From $899", rating: 4.5, icon: "fas fa-monument" },
  { name: "London, UK", price: "From $1,299", rating: 4.4, icon: "fas fa-crown" },
  { name: "Barcelona, Spain", price: "From $799", rating: 4.6, icon: "fas fa-palette" },
  { name: "Amsterdam, Netherlands", price: "From $1,099", rating: 4.3, icon: "fas fa-bicycle" }
];

// Load countries into dropdown
function loadCountries() {
  const countrySelect = document.getElementById('country');
  const sortedCountries = Object.keys(countriesAndCities).sort();
  
  countrySelect.innerHTML = '<option value="">Select a country</option>';
  sortedCountries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

// Load cities based on selected country
function loadCities() {
  const countrySelect = document.getElementById('country');
  const citySelect = document.getElementById('destination');
  const selectedCountry = countrySelect.value;
  
  if (selectedCountry && countriesAndCities[selectedCountry]) {
    citySelect.disabled = false;
    citySelect.innerHTML = '<option value="">Select a city</option>';
    
    const cities = countriesAndCities[selectedCountry].sort();
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  } else {
    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">First select a country</option>';
  }
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

function displayDestinationOverview(destination) {
  // Create a key from city and country
  const cityCountry = destination.split(', ');
  const city = cityCountry[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const country = cityCountry[1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const destinationKey = `${city}-${country}`;
  
  const destData = destinationDatabase[destinationKey] || {
    name: destination,
    rating: 4.5,
    reviewCount: 2847,
    highlights: ["Historic Sites", "Local Culture", "Scenic Views", "Local Cuisine"],
    bestTime: "Year-round",
    currency: "Local Currency",
    language: "Local Language",
    timezone: "Local Time",
    population: "Various",
    founded: "Ancient"
  };
  
  document.getElementById('destinationName').textContent = destData.name;
  document.getElementById('destinationStars').innerHTML = generateStars(destData.rating);
  document.getElementById('destinationRating').textContent = destData.rating;
  document.getElementById('reviewCount').textContent = destData.reviewCount.toLocaleString();
}

function displayQuickFacts(destination) {
  // Create a key from city and country
  const cityCountry = destination.split(', ');
  const city = cityCountry[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const country = cityCountry[1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const destinationKey = `${city}-${country}`;
  
  const destData = destinationDatabase[destinationKey] || {
    bestTime: "Year-round",
    currency: "Local Currency", 
    language: "Local Language",
    timezone: "Local Time",
    population: "Various",
    highlights: ["Historic Sites", "Local Culture", "Scenic Views", "Local Cuisine"]
  };

  const facts = [
    { icon: "fas fa-calendar-alt", title: "Best Time to Visit", value: destData.bestTime },
    { icon: "fas fa-coins", title: "Currency", value: destData.currency },
    { icon: "fas fa-language", title: "Language", value: destData.language },
    { icon: "fas fa-clock", title: "Timezone", value: destData.timezone },
    { icon: "fas fa-users", title: "Population", value: destData.population },
    { icon: "fas fa-star", title: "Top Highlights", value: destData.highlights.join(", ") }
  ];
  
  const factsGrid = document.getElementById('quickFactsGrid');
  factsGrid.innerHTML = facts.map(fact => `
    <div class="fact-card">
      <i class="${fact.icon}"></i>
      <h4>${fact.title}</h4>
      <p>${fact.value}</p>
    </div>
  `).join('');
}

function displayDosAndDonts(destination) {
  // Create a key from city and country
  const cityCountry = destination.split(', ');
  const city = cityCountry[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const country = cityCountry[1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const destinationKey = `${city}-${country}`;
  
  const destData = destinationDatabase[destinationKey] || {
    dos: [
      "Research local customs and traditions",
      "Learn basic local phrases",
      "Try authentic local cuisine",
      "Respect local dress codes",
      "Use official transportation",
      "Keep important documents safe"
    ],
    donts: [
      "Don't ignore local laws and regulations",
      "Don't be disrespectful to local culture",
      "Don't drink tap water unless it's safe",
      "Don't leave valuables unattended",
      "Don't be too trusting of strangers",
      "Don't ignore travel advisories"
    ]
  };

  // Check if container exists, if not create it
  let dosAndDontsContainer = document.getElementById('dosAndDontsContainer');
  if (!dosAndDontsContainer) {
    // Create the container and add it to the page
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      const dosAndDontsSection = document.createElement('div');
      dosAndDontsSection.className = 'dos-and-donts-section';
      dosAndDontsSection.innerHTML = `
        <h3><i class="fas fa-exclamation-triangle"></i> Do's and Don'ts</h3>
        <div id="dosAndDontsContainer" class="dos-and-donts-container"></div>
      `;
      
      // Insert it after the quick facts section
      const quickFactsSection = resultsDiv.querySelector('.quick-facts');
      if (quickFactsSection) {
        quickFactsSection.insertAdjacentElement('afterend', dosAndDontsSection);
      } else {
        resultsDiv.appendChild(dosAndDontsSection);
      }
      dosAndDontsContainer = document.getElementById('dosAndDontsContainer');
    }
  }

  if (dosAndDontsContainer) {
    dosAndDontsContainer.innerHTML = `
      <div class="dos-and-donts-grid">
        <div class="dos-section">
          <h4><i class="fas fa-check-circle"></i> Do's</h4>
          <ul class="dos-list">
            ${destData.dos.map(doItem => `<li><i class="fas fa-check"></i> ${doItem}</li>`).join('')}
          </ul>
        </div>
        <div class="donts-section">
          <h4><i class="fas fa-times-circle"></i> Don'ts</h4>
          <ul class="donts-list">
            ${destData.donts.map(dontItem => `<li><i class="fas fa-times"></i> ${dontItem}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}

function displayRecommendations() {
  const container = document.getElementById('recommendationsContainer');
  container.innerHTML = travelRecommendations.map(rec => `
    <div class="recommendation-card">
      <div class="recommendation-header">
        <div class="recommendation-icon">
          <i class="${rec.icon}"></i>
        </div>
        <div class="recommendation-title">
          <h4>${rec.title}</h4>
          <span class="recommendation-type">${rec.type}</span>
        </div>
      </div>
      <div class="recommendation-content">
        <p>${rec.description}</p>
        <div class="recommendation-rating">
          <div class="stars">${generateStars(rec.rating)}</div>
          <span>${rec.rating}</span>
        </div>
        <div class="price-range">${rec.priceRange}</div>
      </div>
    </div>
  `).join('');
}

// Traveler Reviews section removed

function displayLocalTips() {
  const container = document.getElementById('localTipsContainer');
  container.innerHTML = localTips.map(tip => `
    <div class="tip-card">
      <h4><i class="${tip.icon}"></i> ${tip.title}</h4>
      <p>${tip.tip}</p>
    </div>
  `).join('');
}

function displaySimilarDestinations() {
  const container = document.getElementById('similarDestinations');
  container.innerHTML = similarDestinations.map(dest => `
    <div class="similar-destination-card" onclick="suggestDestination('${dest.name}')">
      <div class="destination-image">
        <i class="${dest.icon}"></i>
      </div>
      <div class="destination-details">
        <h4>${dest.name}</h4>
        <div class="destination-price">${dest.price}</div>
        <div class="destination-rating-small">
          <div class="stars">${generateStars(dest.rating)}</div>
          <span>${dest.rating}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function suggestDestination(destinationName) {
  const [city, country] = destinationName.split(', ');
  document.getElementById('country').value = country;
  loadCities();
  setTimeout(() => {
    document.getElementById('destination').value = city;
  }, 100);
  document.getElementById('country').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Generate fallback itinerary data
function generateFallbackItinerary(destination, startDate, endDate) {
  const fallbackItineraries = {
    "Paris, France": [
      "Day 1 | 9 AM | Visit Eiffel Tower | 4.8 | $30",
      "Day 1 | 2 PM | Seine River Cruise | 4.6 | $45",
      "Day 1 | 7 PM | Dinner at Bistro | 4.4 | $80",
      "Day 2 | 10 AM | Louvre Museum Tour | 4.7 | $25",
      "Day 2 | 3 PM | Walk Champs Elysees | 4.5 | $0",
      "Day 2 | 8 PM | French Cuisine Experience | 4.8 | $120"
    ],
    "London, United Kingdom": [
      "Day 1 | 9 AM | Tower of London | 4.6 | $35",
      "Day 1 | 2 PM | Thames River Cruise | 4.4 | $25",
      "Day 1 | 7 PM | Traditional Pub Dinner | 4.3 | $45",
      "Day 2 | 10 AM | British Museum Visit | 4.8 | $20",
      "Day 2 | 3 PM | Hyde Park Stroll | 4.5 | $0",
      "Day 2 | 8 PM | West End Show | 4.9 | $85"
    ],
    "Tokyo, Japan": [
      "Day 1 | 9 AM | Senso-ji Temple | 4.7 | $0",
      "Day 1 | 1 PM | Sushi Lunch Experience | 4.8 | $60",
      "Day 1 | 4 PM | Tokyo Skytree | 4.6 | $25",
      "Day 2 | 10 AM | Meiji Shrine Visit | 4.5 | $0",
      "Day 2 | 2 PM | Harajuku District | 4.4 | $30",
      "Day 2 | 7 PM | Kaiseki Dinner | 4.9 | $150"
    ]
  };
  
  const defaultItinerary = [
    "Day 1 | 9 AM | City Center Exploration | 4.5 | $20",
    "Day 1 | 2 PM | Local Museum Visit | 4.4 | $15",
    "Day 1 | 7 PM | Traditional Dinner | 4.6 | $50",
    "Day 2 | 10 AM | Historical Site Tour | 4.7 | $30",
    "Day 2 | 3 PM | Shopping District | 4.3 | $25",
    "Day 2 | 8 PM | Cultural Performance | 4.8 | $40"
  ];
  
  const itinerary = fallbackItineraries[destination] || defaultItinerary;
  
  return {
    choices: [{
      message: {
        content: itinerary.join("\n")
      }
    }]
  };
}

function displayCostBreakdown(breakdown, total, estimated) {
  const costDetails = document.getElementById('costDetails');
  const estimatedBudget = parseFloat(estimated) || total;
  const remainingBudget = estimatedBudget - total;
  
  // Add accommodation estimate if not included
  if (breakdown.accommodation === 0) {
    breakdown.accommodation = Math.round(total * 0.4); // Estimate 40% for accommodation
    total += breakdown.accommodation;
  }
  
  // Add meals estimate if low
  if (breakdown.meals < total * 0.2) {
    const mealEstimate = Math.round(total * 0.25);
    breakdown.meals += mealEstimate;
    total += mealEstimate;
  }
  
  // Add transportation estimate if not included
  if (breakdown.transportation === 0) {
    breakdown.transportation = Math.round(total * 0.15);
    total += breakdown.transportation;
  }
  
  costDetails.innerHTML = `
    <div class="cost-item">
      <span><i class="fas fa-ticket-alt"></i> Activities & Attractions</span>
      <strong>$${breakdown.activities}</strong>
    </div>
    <div class="cost-item">
      <span><i class="fas fa-utensils"></i> Meals & Dining</span>
      <strong>$${breakdown.meals}</strong>
    </div>
    <div class="cost-item">
      <span><i class="fas fa-car"></i> Transportation</span>
      <strong>$${breakdown.transportation}</strong>
    </div>
    <div class="cost-item">
      <span><i class="fas fa-bed"></i> Accommodation</span>
      <strong>$${breakdown.accommodation}</strong>
    </div>
    <div class="cost-item" style="border-top: 2px solid #667eea; font-weight: 600; background: linear-gradient(135deg, #f8fafc 0%, #e6f3ff 100%);">
      <span><i class="fas fa-calculator"></i> Total Estimated Cost</span>
      <strong>$${total}</strong>
    </div>
    ${estimated ? `
    <div class="cost-item" style="background: ${remainingBudget >= 0 ? '#f0fff4' : '#fff5f5'}; border-left: 4px solid ${remainingBudget >= 0 ? '#48bb78' : '#f56565'};">
      <span><i class="fas fa-piggy-bank"></i> ${remainingBudget >= 0 ? 'Remaining Budget' : 'Over Budget'}</span>
      <strong style="color: ${remainingBudget >= 0 ? '#48bb78' : '#f56565'};">$${Math.abs(remainingBudget)}</strong>
    </div>
    ` : ''}
  `;
}

function displayDestinationGallery(destination) {
  const gallery = document.getElementById('imageGallery');
  const imageCategories = [
    { query: 'landmarks historic sites', title: 'Historic Sites' },
    { query: 'nature landscape scenic views', title: 'Scenic Views' },
    { query: 'local cuisine food restaurants', title: 'Local Cuisine' },
    { query: 'shopping markets stores', title: 'Shopping Areas' },
    { query: 'photography spots scenic', title: 'Photo Spots' },
    { query: 'art museums culture', title: 'Art & Culture' }
  ];
  
  // Initially show loading placeholders
  gallery.innerHTML = imageCategories.map(category => `
    <div class="gallery-item">
      <div class="gallery-placeholder loading">
        <div class="loading-spinner"></div>
      </div>
      <span class="gallery-title">${category.title}</span>
    </div>
  `).join('');
  
  // Fetch real images for each category
  imageCategories.forEach(async (category, index) => {
    try {
      if (window.ImageAPI) {
        const searchQuery = `${destination} ${category.query}`;
        const images = await ImageAPI.fetchUnsplashImages(searchQuery, 1);
        
        if (images && images.length > 0) {
          const galleryItems = document.querySelectorAll('.gallery-item');
          if (galleryItems[index]) {
            galleryItems[index].innerHTML = `
              <div class="gallery-image" 
                   style="background-image: url('${images[0].url}')"
                   onclick="window.UIHelpers.openImageModal('${images[0].url}', '${destination} - ${category.title}')">
              </div>
              <span class="gallery-title">${category.title}</span>
              <span class="gallery-credit">Photo by ${images[0].photographer}</span>
            `;
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load image for ${category.title}:`, error);
    }
  });
}

function formatRating(rating) {
  if (!rating) return 0;
  return Math.round(rating * 10) / 10;
}

function truncateText(text, maxLength = 150) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Form submission
document.getElementById("travelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const country = document.getElementById("country").value;
  const city = document.getElementById("destination").value;
  const destination = `${city}, ${country}`;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const budget = document.getElementById("budget").value;
  const tripNature = document.getElementById("tripNature").value;
  const estimatedCost = document.getElementById("estimatedCost").value;
  const travelStyle = document.getElementById("travelStyle").value;
  const accommodationType = document.getElementById("accommodationType").value;

  // Validate inputs
  if (!country || !city) {
    alert("Please select both a country and a city.");
    return;
  }

  // Show loading spinner
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");

  try {
    // Try multiple API models as fallback
    const models = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "microsoft/phi-3-mini-128k-instruct:free", 
      "google/gemma-2-9b-it:free",
      "qwen/qwen-2-7b-instruct:free"
    ];

    let response = null;
    let data = null;
    
    // Try each model until one works
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Travel Planner"
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Create a detailed travel itinerary for ${destination} from ${startDate} to ${endDate}. 
                Trip details: ${budget} budget, ${tripNature} travel, estimated budget: $${estimatedCost}
                Travel style: ${travelStyle || 'mixed'}, Accommodation: ${accommodationType || 'hotel'}
                
                Requirements:
                - Maximum 4 activities per day
                - Include activity ratings (4.0-5.0 scale)
                - Include estimated costs for each activity
                - Each activity description should be 4-6 words maximum
                - Format as simple text with each line as: Day number | Time | Activity | Rating | Cost
                - Times should be in format like "9 AM" or "2 PM"
                - Ratings should be like "4.5" or "4.8"
                - Costs should be like "$25" or "$150"
                - Do not include any special characters or formatting beyond the pipe separators
                
                Example format:
                Day 1 | 9 AM | Visit Eiffel Tower | 4.8 | $30
                Day 1 | 2 PM | Seine River Cruise | 4.6 | $45
                Day 2 | 10 AM | Louvre Museum Tour | 4.7 | $25`,
              },
            ],
            max_tokens: 2000,
            temperature: 0.7
          }),
        });

        if (response.ok) {
          data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log(`Successfully used model: ${model}`);
            break;
          }
        }
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError);
        continue;
      }
    }

    // If all models failed, use fallback data
    if (!data || !data.choices || !data.choices[0]) {
      console.log("All API models failed, using fallback data");
      data = generateFallbackItinerary(destination, startDate, endDate);
    }

    // Hide loading spinner
    document.getElementById("loading").classList.add("hidden");    // Display all TripAdvisor-like features
    displayDestinationOverview(destination);
    displayQuickFacts(destination);
    displayDosAndDonts(destination);
    displayRecommendations();
    displayLocalTips();
    displaySimilarDestinations();

    // Process and display itinerary results
    const itineraryBody = document.getElementById("itineraryBody");
    const content = data.choices[0].message.content;

    // Clear previous content
    itineraryBody.innerHTML = "";

    // Split content into lines and filter out unwanted lines
    const lines = content
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.includes("\\boxed") &&
          !line.includes("undefined") &&
          !line.includes("{") &&
          !line.includes("}")
      );

    let totalCost = 0;
    const costBreakdown = {
      activities: 0,
      meals: 0,
      transportation: 0,
      accommodation: 0
    };

    // Create table rows
    lines.forEach((line) => {
      if (line.trim()) {
        const parts = line.split("|").map((item) => item.trim());
        if (parts.length >= 5) {
          const [day, time, activity, rating, cost] = parts;
          
          // Extract cost number for calculations
          const costNumber = parseFloat(cost.replace(/[^0-9.]/g, '')) || 0;
          totalCost += costNumber;
          
          // Categorize costs (simplified logic)
          if (activity.toLowerCase().includes('restaurant') || activity.toLowerCase().includes('dining') || activity.toLowerCase().includes('food')) {
            costBreakdown.meals += costNumber;
          } else if (activity.toLowerCase().includes('transport') || activity.toLowerCase().includes('taxi') || activity.toLowerCase().includes('bus')) {
            costBreakdown.transportation += costNumber;
          } else if (activity.toLowerCase().includes('hotel') || activity.toLowerCase().includes('accommodation')) {
            costBreakdown.accommodation += costNumber;
          } else {
            costBreakdown.activities += costNumber;
          }
          
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${day}</td>
            <td>${time}</td>
            <td>${activity}</td>
            <td>
              <div class="activity-rating">
                <div class="stars">${generateStars(parseFloat(rating) || 4.5)}</div>
                <span>${rating}</span>
              </div>
            </td>
            <td><strong>${cost}</strong></td>
          `;
          itineraryBody.appendChild(row);
        }
      }
    });    // Display cost breakdown
    displayCostBreakdown(costBreakdown, totalCost, estimatedCost);
    
    // Display destination images (placeholder)
    displayDestinationGallery(destination);

    // Fetch and display real-time tourism data
    if (window.TourismDataAPI) {
      console.log(`Fetching real-time data for ${city}, ${country}`);
      TourismDataAPI.fetchAllData(city, country).catch(error => {
        console.warn('Real-time data fetch failed:', error);
      });
      
      // Set country background image
      if (window.backgroundManager) {
        console.log(`Setting background for country: ${country}`);
        backgroundManager.setCountryBackground(country);
      }
    }

    document.getElementById("results").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loading").classList.add("hidden");
    
    // Show fallback data in case of complete failure
    try {
      const fallbackData = generateFallbackItinerary(destination, startDate, endDate);
        // Display TripAdvisor-like features with fallback
      displayDestinationOverview(destination);
      displayQuickFacts(destination);
      displayDosAndDonts(destination);
      displayRecommendations();
      displayLocalTips();
      displaySimilarDestinations();
      
      // Display fallback itinerary
      const itineraryBody = document.getElementById("itineraryBody");
      itineraryBody.innerHTML = "";
      
      const lines = fallbackData.choices[0].message.content.split("\n");
      lines.forEach((line) => {
        if (line.trim()) {
          const parts = line.split("|").map((item) => item.trim());
          if (parts.length >= 5) {
            const [day, time, activity, rating, cost] = parts;
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${day}</td>
              <td>${time}</td>
              <td>${activity}</td>
              <td>
                <div class="activity-rating">
                  <div class="stars">${generateStars(parseFloat(rating) || 4.5)}</div>
                  <span>${rating}</span>
                </div>
              </td>
              <td><strong>${cost}</strong></td>
            `;
            itineraryBody.appendChild(row);
          }
        }
      });
        displayCostBreakdown({activities: 200, meals: 150, transportation: 100, accommodation: 300}, 750, estimatedCost);
      displayDestinationGallery(destination);

      // Fetch and display real-time tourism data even with fallback
      if (window.TourismDataAPI) {
        console.log(`Fetching real-time data for ${city}, ${country} (fallback mode)`);
        TourismDataAPI.fetchAllData(city, country).catch(error => {
          console.warn('Real-time data fetch failed:', error);
        });
        
        // Set country background image
        if (window.backgroundManager) {
          console.log(`Setting background for country: ${country} (fallback mode)`);
          backgroundManager.setCountryBackground(country);
        }
      }

      document.getElementById("results").classList.remove("hidden");
      
      // Show informative message
      alert("We're using sample itinerary data. For live AI-generated content, please check your internet connection or try again later.");
      
    } catch (fallbackError) {
      alert("Unable to generate itinerary. Please check your internet connection and try again.");
    }
  }
});

// AI Tourism Information Management
let currentAITab = 'general';
let aiDataCache = {};

function switchAITab(tabType) {
  // Update tab buttons
  document.querySelectorAll('.ai-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
  
  // Update current tab
  currentAITab = tabType;
  
  // Load content for the selected tab
  loadAITourismInfo(tabType);
}

async function loadAITourismInfo(infoType = 'general') {
  const contentContainer = document.getElementById('aiTourismContent');
  const lastUpdatedSpan = document.getElementById('aiLastUpdated');
  
  // Show loading state
  contentContainer.innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <p>Fetching real-time ${infoType} information...</p>
    </div>
  `;
  
  try {
    // Get current destination
    const destination = getCurrentDestination();
    if (!destination) {
      throw new Error('No destination selected');
    }
    
    const cityCountry = destination.split(', ');
    const city = cityCountry[0] || '';
    const country = cityCountry[1] || '';
    
    // Check cache first
    const cacheKey = `${city}-${country}-${infoType}`;
    if (aiDataCache[cacheKey] && isDataFresh(aiDataCache[cacheKey].timestamp)) {
      displayAIContent(aiDataCache[cacheKey].data, infoType);
      lastUpdatedSpan.textContent = formatTimestamp(aiDataCache[cacheKey].timestamp);
      return;
    }
    
    // Fetch from Deepseek API
    const aiData = await DeepseekAPI.fetchRealTimeTourismInfo(city, country, infoType);
    
    // Cache the result
    aiDataCache[cacheKey] = {
      data: aiData,
      timestamp: new Date()
    };
    
    // Display the content
    displayAIContent(aiData, infoType);
    lastUpdatedSpan.textContent = formatTimestamp(new Date());
    
  } catch (error) {
    console.error('Error loading AI tourism info:', error);
    showAIError(contentContainer, error.message);
  }
}

function displayAIContent(data, infoType) {
  const container = document.getElementById('aiTourismContent');
  
  switch (infoType) {
    case 'general':
      displayGeneralInfo(container, data);
      break;
    case 'attractions':
      displayAttractionsInfo(container, data);
      break;
    case 'restaurants':
      displayRestaurantsInfo(container, data);
      break;
    case 'events':
      displayEventsInfo(container, data);
      break;
    case 'transportation':
      displayTransportationInfo(container, data);
      break;
    case 'safety':
      displaySafetyInfo(container, data);
      break;
    default:
      displayGeneralInfo(container, data);
  }
}

function displayGeneralInfo(container, data) {
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-globe"></i> Current Tourism Overview</h4>
      <div class="ai-info-grid">
        <div class="ai-info-card">
          <h5><i class="fas fa-thermometer-half"></i> Weather & Climate</h5>
          <p>${extractWeatherInfo(data.content)}</p>
        </div>
        <div class="ai-info-card">
          <h5><i class="fas fa-star"></i> Trending Now</h5>
          <p>${extractTrendingInfo(data.content)}</p>
        </div>
        <div class="ai-info-card">
          <h5><i class="fas fa-info-circle"></i> Current Status</h5>
          <p>${extractStatusInfo(data.content)}</p>
        </div>
        <div class="ai-info-card">
          <h5><i class="fas fa-lightbulb"></i> Local Tips</h5>
          <p>${extractTipsInfo(data.content)}</p>
        </div>
      </div>
      <div class="ai-full-content">
        <h4><i class="fas fa-book"></i> Detailed Information</h4>
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 10px;">
          ${formatAIContent(data.content)}
        </div>
      </div>
    </div>
  `;
}

function displayAttractionsInfo(container, data) {
  const attractions = data.attractions || extractAttractionsList(data.content);
  
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-map-marker-alt"></i> Top Attractions (Updated ${new Date().toLocaleDateString()})</h4>
      ${attractions.length > 0 ? attractions.map((attraction, index) => `
        <div class="ai-attraction-item">
          <h5>${index + 1}. ${attraction.name}</h5>
          <p>${attraction.description || attraction.rawLine}</p>
        </div>
      `).join('') : `
        <div class="ai-info-card">
          <p>${formatAIContent(data.content)}</p>
        </div>
      `}
    </div>
  `;
}

function displayRestaurantsInfo(container, data) {
  const restaurants = data.restaurants || extractRestaurantsList(data.content);
  
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-utensils"></i> Dining Recommendations</h4>
      ${restaurants.length > 0 ? restaurants.map((restaurant, index) => `
        <div class="ai-restaurant-item">
          <h5>${index + 1}. ${restaurant.name}</h5>
          <p>${restaurant.description || restaurant.rawLine}</p>
        </div>
      `).join('') : `
        <div class="ai-info-card">
          <p>${formatAIContent(data.content)}</p>
        </div>
      `}
    </div>
  `;
}

function displayEventsInfo(container, data) {
  const events = data.events || extractEventsList(data.content);
  
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-calendar-alt"></i> Current & Upcoming Events</h4>
      ${events.length > 0 ? events.map((event, index) => `
        <div class="ai-event-item">
          <h5>${event.name}</h5>
          <p>${event.description || event.rawLine}</p>
        </div>
      `).join('') : `
        <div class="ai-info-card">
          <p>${formatAIContent(data.content)}</p>
        </div>
      `}
    </div>
  `;
}

function displayTransportationInfo(container, data) {
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-subway"></i> Transportation Information</h4>
      <div class="ai-info-card">
        ${formatAIContent(data.content)}
      </div>
    </div>
  `;
}

function displaySafetyInfo(container, data) {
  container.innerHTML = `
    <div class="ai-section-content">
      <h4><i class="fas fa-shield-alt"></i> Safety & Health Information</h4>
      <div class="ai-info-card">
        ${formatAIContent(data.content)}
      </div>
    </div>
  `;
}

function showAIError(container, message) {
  container.innerHTML = `
    <div class="ai-error">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Unable to load real-time information: ${message}</p>
      <button class="ai-retry-btn" onclick="loadAITourismInfo('${currentAITab}')">
        <i class="fas fa-redo"></i> Retry
      </button>
      <p style="margin-top: 10px; font-size: 0.85rem;">
        Using cached data or fallback information where available.
      </p>
    </div>
  `;
}

// Utility functions for AI data processing
function getCurrentDestination() {
  return document.getElementById('destinationName')?.textContent || null;
}

function isDataFresh(timestamp, maxAgeMinutes = 30) {
  const now = new Date();
  const age = (now - timestamp) / (1000 * 60); // Age in minutes
  return age < maxAgeMinutes;
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function formatAIContent(content) {
  if (!content) return 'Information not available';
  
  // Convert markdown-like formatting to HTML
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function extractWeatherInfo(content) {
  const weatherMatch = content.match(/weather|temperature|climate|season/i);
  if (weatherMatch) {
    const sentences = content.split('.').filter(s => /weather|temperature|climate|season/i.test(s));
    return sentences[0]?.trim() + '.' || 'Weather information available in detailed section.';
  }
  return 'Current weather conditions vary. Check detailed information below.';
}

function extractTrendingInfo(content) {
  const trendingMatch = content.match(/trending|popular|hotspot|new|recent/i);
  if (trendingMatch) {
    const sentences = content.split('.').filter(s => /trending|popular|hotspot|new|recent/i.test(s));
    return sentences[0]?.trim() + '.' || 'Popular attractions and experiences available.';
  }
  return 'Discover trending attractions and experiences in the detailed sections.';
}

function extractStatusInfo(content) {
  const statusMatch = content.match(/open|closed|operating|hours|status|available/i);
  if (statusMatch) {
    const sentences = content.split('.').filter(s => /open|closed|operating|hours|status|available/i.test(s));
    return sentences[0]?.trim() + '.' || 'Operating status information available.';
  }
  return 'Most attractions and services are operating normally.';
}

function extractTipsInfo(content) {
  const tipsMatch = content.match(/tip|advice|recommend|suggest|should|best/i);
  if (tipsMatch) {
    const sentences = content.split('.').filter(s => /tip|advice|recommend|suggest|should|best/i.test(s));
    return sentences[0]?.trim() + '.' || 'Travel tips and recommendations available.';
  }
  return 'Local insights and travel tips available in detailed information.';
}

function extractAttractionsList(content) {
  const lines = content.split('\n');
  const attractions = [];
  
  lines.forEach(line => {
    const match = line.match(/^(?:\d+\.|\*|\-)\s*(.+?)(?:\s*-\s*(.+))?$/);
    if (match && /attraction|museum|temple|palace|park|tower|bridge/i.test(line)) {
      attractions.push({
        name: match[1].trim(),
        description: match[2] ? match[2].trim() : '',
        rawLine: line
      });
    }
  });
  
  return attractions.slice(0, 10);
}

function extractRestaurantsList(content) {
  const lines = content.split('\n');
  const restaurants = [];
  
  lines.forEach(line => {
    const match = line.match(/^(?:\d+\.|\*|\-)\s*(.+?)(?:\s*-\s*(.+))?$/);
    if (match && /restaurant|cafe|food|cuisine|dining|eat/i.test(line)) {
      restaurants.push({
        name: match[1].trim(),
        description: match[2] ? match[2].trim() : '',
        rawLine: line
      });
    }
  });
  
  return restaurants.slice(0, 8);
}

function extractEventsList(content) {
  const lines = content.split('\n');
  const events = [];
  
  lines.forEach(line => {
    const match = line.match(/^(?:\d+\.|\*|\-)\s*(.+?)(?:\s*-\s*(.+))?$/);
    if (match && /event|festival|exhibition|concert|show|celebration/i.test(line)) {
      events.push({
        name: match[1].trim(),
        description: match[2] ? match[2].trim() : '',
        rawLine: line
      });
    }
  });
  
  return events.slice(0, 6);
}

// Booking Modal Functions
let currentBookingType = '';
let currentDestination = '';
let currentStartDate = '';
let currentEndDate = '';

function openBookingModal(type) {
  currentBookingType = type;
  
  // Get current trip details from the form
  const country = document.getElementById("country").value;
  const city = document.getElementById("destination").value;
  currentDestination = `${city}, ${country}`;
  currentStartDate = document.getElementById("startDate").value;
  currentEndDate = document.getElementById("endDate").value;
  
  const modal = document.getElementById('bookingModal');
  const modalTitle = document.getElementById('modalTitle');
  const partnersContainer = document.getElementById('bookingPartners');
  
  const titles = {
    flights: 'Book Your Flight',
    hotels: 'Book Your Hotel',
    cars: 'Rent a Car',
    activities: 'Book Activities & Tours',
    insurance: 'Get Travel Insurance'
  };
  
  modalTitle.textContent = titles[type] || 'Book Your Travel';
  
  // Define booking partners for each service
  const bookingPartners = {
    flights: [
      {
        name: 'Expedia',
        logo: 'fas fa-plane',
        description: 'Compare flights from 500+ airlines',
        rating: '4.5/5',
        benefits: ['Price Match Guarantee', 'Rewards Program', '24/7 Support']
      },
      {
        name: 'Kayak',
        logo: 'fas fa-search',
        description: 'Search hundreds of travel sites',
        rating: '4.4/5',
        benefits: ['Price Forecasting', 'Trip Planning', 'Mobile Alerts']
      }
    ],
    hotels: [
      {
        name: 'Booking.com',
        logo: 'fas fa-bed',
        description: 'Over 28 million listings worldwide',
        rating: '4.6/5',
        benefits: ['Free Cancellation', 'No Booking Fees', 'Best Price Guarantee']
      },
      {
        name: 'Hotels.com',
        logo: 'fas fa-building',
        description: 'Collect 10 nights, get 1 free',
        rating: '4.3/5',
        benefits: ['Rewards Program', 'Member Discounts', 'Express Booking']
      }
    ],
    cars: [
      {
        name: 'Hertz',
        logo: 'fas fa-car',
        description: 'Global leader in car rental',
        rating: '4.2/5',
        benefits: ['Premium Fleet', 'Gold Plus Rewards', 'Worldwide Coverage']
      },
      {
        name: 'Enterprise',
        logo: 'fas fa-road',
        description: 'Pick you up at your location',
        rating: '4.4/5',
        benefits: ['Pick-up Service', 'Wide Selection', 'Loyalty Program']
      }
    ],
    activities: [
      {
        name: 'Viator',
        logo: 'fas fa-ticket-alt',
        description: 'Book tours and attractions',
        rating: '4.3/5',
        benefits: ['Skip-the-Line', 'Local Experts', 'Instant Confirmation']
      },
      {
        name: 'GetYourGuide',
        logo: 'fas fa-map-marked-alt',
        description: 'Discover and book experiences',
        rating: '4.5/5',
        benefits: ['Free Cancellation', 'Mobile Tickets', '24/7 Support']
      }
    ],
    insurance: [
      {
        name: 'World Nomads',
        logo: 'fas fa-shield-alt',
        description: 'Travel insurance for adventurers',
        rating: '4.4/5',
        benefits: ['Adventure Coverage', 'Claim Online', '24/7 Emergency']
      },
      {
        name: 'Allianz Travel',
        logo: 'fas fa-umbrella',
        description: 'Comprehensive travel protection',
        rating: '4.2/5',
        benefits: ['Trip Cancellation', 'Medical Coverage', 'Baggage Protection']
      }
    ]
  };
  
  const partners = bookingPartners[type] || [];
  
  partnersContainer.innerHTML = partners.map(partner => `
    <div class="partner-option">
      <div class="partner-header">
        <i class="${partner.logo}"></i>
        <div class="partner-info">
          <h4>${partner.name}</h4>
          <div class="partner-rating">★ ${partner.rating}</div>
        </div>
      </div>
      <p class="partner-description">${partner.description}</p>
      <ul class="partner-benefits">
        ${partner.benefits.map(benefit => `<li><i class="fas fa-check"></i> ${benefit}</li>`).join('')}
      </ul>
      <button class="partner-btn" onclick="proceedToBooking('${partner.name.toLowerCase().replace(/[^a-z]/g, '')}')">
        <i class="fas fa-external-link-alt"></i>
        Book with ${partner.name}
      </button>
    </div>
  `).join('');
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  currentBookingType = '';
  currentDestination = '';
}

function proceedToBooking(partner) {
  // Get destination details for URL encoding
  const [city, country] = currentDestination.split(', ');
  const encodedCity = encodeURIComponent(city);
  const encodedCountry = encodeURIComponent(country);
  const encodedDestination = encodeURIComponent(currentDestination);
  
  // Format dates for URL parameters
  const checkIn = currentStartDate;
  const checkOut = currentEndDate;
  
  // Define actual booking URLs with parameters
  const bookingUrls = {
    // Flight booking URLs
    flights: {
      expedia: `https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:${encodedCity},to:${encodedDestination}&passengers=adults:1&options=cabinclass:economy&fromDate=${checkIn}&toDate=${checkOut}`,
      kayak: `https://www.kayak.com/flights/${encodedCity}-${encodedDestination}/${checkIn}/${checkOut}?sort=bestflight_a`
    },
    
    // Hotel booking URLs
    hotels: {
      bookingcom: `https://www.booking.com/searchresults.html?ss=${encodedDestination}&checkin=${checkIn}&checkout=${checkOut}&group_adults=1&no_rooms=1&group_children=0`,
      hotelscom: `https://www.hotels.com/search.do?destination=${encodedDestination}&startDate=${checkIn}&endDate=${checkOut}&rooms=1&adults=1`
    },
    
    // Car rental URLs
    cars: {
      hertz: `https://www.hertz.com/rentacar/reservation/?targetPage=searchResultsPage&from=${encodedCity}&fromDate=${checkIn}&toDate=${checkOut}`,
      enterprise: `https://www.enterprise.com/en/car-rental/locations/${encodedCountry}/${encodedCity}.html?from=${checkIn}&to=${checkOut}`
    },
    
    // Activities booking URLs
    activities: {
      viator: `https://www.viator.com/${encodedCountry}/${encodedCity}-tours/d${Math.floor(Math.random() * 1000)}`,
      getyourguide: `https://www.getyourguide.com/s/?q=${encodedDestination}&date_from=${checkIn}&date_to=${checkOut}`
    },
    
    // Insurance URLs
    insurance: {
      worldnomads: `https://www.worldnomads.com/travel-insurance/get-quote?trip_type=single&departure_date=${checkIn}&return_date=${checkOut}&destination=${encodedCountry}`,
      allianztravel: `https://www.allianztravelinsurance.com/get-quote?departure=${checkIn}&return=${checkOut}&destination=${encodedCountry}`
    }
  };
  
  // Get the appropriate URL
  let bookingUrl = '';
  
  if (bookingUrls[currentBookingType] && bookingUrls[currentBookingType][partner]) {
    bookingUrl = bookingUrls[currentBookingType][partner];
  } else {
    // Fallback URLs if specific partner not found
    const fallbackUrls = {
      flights: `https://www.google.com/travel/flights?q=flights%20to%20${encodedDestination}%20from%20${checkIn}%20to%20${checkOut}`,
      hotels: `https://www.google.com/travel/hotels/${encodedDestination}?g2lb=2502548%2C2503771%2C2503781%2C4258168&hl=en&gl=us&cs=1&ssta=1&ts=CAESCAoCCAMKAggDGhwSGhIUCgcI5Q8QCxgMEgcI5Q8QCxgNGAEyAhAAKgcKBToDVVNE&checkin=${checkIn}&checkout=${checkOut}`,
      cars: `https://www.google.com/travel/search?q=car%20rental%20${encodedDestination}&pickup_date=${checkIn}&dropoff_date=${checkOut}`,
      activities: `https://www.google.com/search?q=things%20to%20do%20in%20${encodedDestination}`,
      insurance: `https://www.google.com/search?q=travel%20insurance%20for%20${encodedDestination}`
    };
    bookingUrl = fallbackUrls[currentBookingType] || 'https://www.google.com/travel';
  }
  
  // Open the booking URL in a new tab
  window.open(bookingUrl, '_blank');
  
  // Close the modal
  closeBookingModal();
  
  // Show confirmation message
  setTimeout(() => {
    alert(`Redirected to ${partner || 'booking partner'} for ${currentBookingType} in ${currentDestination}. The booking page should open in a new tab with your travel dates (${checkIn} to ${checkOut}) pre-filled.`);
  }, 500);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('bookingModal');
  if (event.target === modal) {
    closeBookingModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeBookingModal();
  }
});

// UI Helpers for interactive elements
window.UIHelpers = {
  openImageModal: function(imageUrl, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="image-modal-content">
        <span class="close-image-modal">&times;</span>
        <img src="${imageUrl}" alt="${alt || 'Destination image'}">
        <p class="image-modal-caption">${alt || ''}</p>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    modal.querySelector('.close-image-modal').onclick = () => {
      document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }
};

// Set minimum date to today for date inputs
document.addEventListener('DOMContentLoaded', function() {
  // Load destination database first, then load countries
  loadDestinationDatabase();
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').min = today;
  document.getElementById('endDate').min = today;
  
  // Update end date minimum when start date changes
  document.getElementById('startDate').addEventListener('change', function() {
    document.getElementById('endDate').min = this.value;
  });
  
  // Debug: Check if countries are loaded correctly after a short delay
  setTimeout(() => {
    console.log('Countries and cities data:', countriesAndCities);
    console.log('Destination database:', Object.keys(destinationDatabase));
  }, 1000);
});
