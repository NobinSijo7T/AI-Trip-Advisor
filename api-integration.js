// Real-time API Integration Module
// Fetches live data from multiple tourism APIs

// API Configuration
const API_CONFIG = {
  // Note: For demo purposes, using placeholder keys - Replace with actual keys for production
  googlePlaces: {
    key: 'DEMO_GOOGLE_PLACES_API_KEY', // Replace with actual key from Google Cloud Console
    baseUrl: 'https://maps.googleapis.com/maps/api/place'
  },
  foursquare: {
    key: 'DEMO_FOURSQUARE_API_KEY', // Replace with actual key from Foursquare
    baseUrl: 'https://api.foursquare.com/v3/places'
  },
  openTripMap: {
    key: 'DEMO_OPENTRIPMAP_API_KEY', // Replace with actual key from OpenTripMap
    baseUrl: 'https://api.opentripmap.com/0.1/en/places'
  },
  unsplash: {
    key: 'l9C2fGkxvfA03JTCRlzhSv4NwI-KjhwhBFWHCMUGqR8', // Replace with actual key from Unsplash
    baseUrl: 'https://api.unsplash.com'
  },
  pexels: {
    key: 'DEMO_PEXELS_API_KEY', // Replace with actual key from Pexels
    baseUrl: 'https://api.pexels.com/v1'
  }
};

// Utility Functions
class APIUtils {
  static async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  static showLoadingIndicator(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="api-loading">
          <div class="loading-spinner"></div>
          <p>Fetching real-time data...</p>
        </div>
      `;
    }
  }

  static showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="api-error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error: ${message}</p>
          <button onclick="location.reload()" class="retry-btn">Retry</button>
        </div>
      `;
    }
  }

  static formatRating(rating) {
    if (!rating) return 'N/A';
    return Math.round(rating * 10) / 10;
  }

  static truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

// Google Places API Integration
class GooglePlacesAPI {
  static async searchPlaces(city, country, type = 'tourist_attraction') {
    const query = `${city}, ${country}`;
    const url = `${API_CONFIG.googlePlaces.baseUrl}/textsearch/json?query=${encodeURIComponent(query + ' ' + type)}&key=${API_CONFIG.googlePlaces.key}`;
    
    try {
      const data = await APIUtils.fetchWithTimeout(url);
      return this.formatPlacesData(data.results || []);
    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  }

  static async getPlaceDetails(placeId) {
    const fields = 'name,rating,reviews,formatted_address,photos,price_level,opening_hours,website,formatted_phone_number';
    const url = `${API_CONFIG.googlePlaces.baseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${API_CONFIG.googlePlaces.key}`;
    
    try {
      const data = await APIUtils.fetchWithTimeout(url);
      return data.result || null;
    } catch (error) {
      console.error('Google Place Details error:', error);
      return null;
    }
  }

  static async getReviews(placeId) {
    const details = await this.getPlaceDetails(placeId);
    if (details && details.reviews) {
      return details.reviews.slice(0, 5).map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: new Date(review.time * 1000).toLocaleDateString(),
        profilePhoto: review.profile_photo_url
      }));
    }
    return [];
  }

  static formatPlacesData(places) {
    return places.slice(0, 10).map(place => ({
      id: place.place_id,
      name: place.name,
      rating: APIUtils.formatRating(place.rating),
      address: place.formatted_address,
      priceLevel: place.price_level,
      photos: place.photos ? place.photos.slice(0, 3) : [],
      types: place.types,
      source: 'google'
    }));
  }
}

// Foursquare Places API Integration
class FoursquareAPI {
  static async searchPlaces(city, country, categories = 'tourism') {
    const query = `${city}, ${country}`;
    const url = `${API_CONFIG.foursquare.baseUrl}/search?query=${encodeURIComponent(query)}&categories=${categories}&limit=10`;
    
    const headers = {
      'Authorization': API_CONFIG.foursquare.key,
      'Accept': 'application/json'
    };

    try {
      const data = await APIUtils.fetchWithTimeout(url, { headers });
      return this.formatPlacesData(data.results || []);
    } catch (error) {
      console.error('Foursquare API error:', error);
      return [];
    }
  }

  static formatPlacesData(places) {
    return places.map(place => ({
      id: place.fsq_id,
      name: place.name,
      rating: APIUtils.formatRating(place.rating),
      address: place.location?.formatted_address || 'Address not available',
      category: place.categories?.[0]?.name || 'General',
      distance: place.distance,
      source: 'foursquare'
    }));
  }
}

// OpenTripMap API Integration
class OpenTripMapAPI {
  static async searchPlaces(city, country) {
    try {
      // First get coordinates for the city
      const geoUrl = `${API_CONFIG.openTripMap.baseUrl}/geoname?name=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&apikey=${API_CONFIG.openTripMap.key}`;
      const geoData = await APIUtils.fetchWithTimeout(geoUrl);
      
      if (!geoData.lat || !geoData.lon) {
        throw new Error('Location not found');
      }

      // Get places around the coordinates
      const placesUrl = `${API_CONFIG.openTripMap.baseUrl}/radius?radius=5000&lon=${geoData.lon}&lat=${geoData.lat}&kinds=interesting_places&format=json&limit=20&apikey=${API_CONFIG.openTripMap.key}`;
      const placesData = await APIUtils.fetchWithTimeout(placesUrl);
      
      return this.formatPlacesData(placesData.features || []);
    } catch (error) {
      console.error('OpenTripMap API error:', error);
      return [];
    }
  }

  static async getPlaceDetails(xid) {
    const url = `${API_CONFIG.openTripMap.baseUrl}/xid/${xid}?apikey=${API_CONFIG.openTripMap.key}`;
    
    try {
      const data = await APIUtils.fetchWithTimeout(url);
      return data;
    } catch (error) {
      console.error('OpenTripMap details error:', error);
      return null;
    }
  }

  static formatPlacesData(places) {
    return places.map(place => ({
      id: place.properties.xid,
      name: place.properties.name || 'Unnamed Place',
      category: place.properties.kinds || 'attraction',
      distance: place.properties.dist,
      source: 'opentripmap'
    }));
  }
}

// Image APIs Integration
class ImageAPI {  static async fetchImages(query, count = 3) {
    try {
      console.log(`Fetching images for query: "${query}"`);
      
      // Try Unsplash first with broader search terms
      const enhancedQuery = this.enhanceSearchQuery(query);
      console.log(`Enhanced image query: "${enhancedQuery}"`);
      
      const unsplashImages = await this.fetchUnsplashImages(enhancedQuery, count * 2); // Fetch more for better selection
      if (unsplashImages.length > 0) {
        console.log(`Found ${unsplashImages.length} Unsplash images`);
        // Select the best images from results
        return unsplashImages.slice(0, count);
      }
      
      // Fallback to Pexels
      console.log('No Unsplash images found, trying Pexels');
      const pexelsImages = await this.fetchPexelsImages(enhancedQuery, count);
      if (pexelsImages.length > 0) {
        return pexelsImages;
      }
      
      // If no images found, use fallbacks
      console.log('No API images found, using fallbacks');
      return this.getFallbackImages(query, count);
    } catch (error) {
      console.error('Image fetch error:', error);
      return this.getFallbackImages(query, count);
    }
  }
  
  static enhanceSearchQuery(query) {
    // Extract city and country from query
    const parts = query.split(' ');
    let city, country;
    
    if (parts.length >= 3 && parts.includes('tourism')) {
      // Format is likely "city country tourism"
      const tourismIndex = parts.indexOf('tourism');
      if (tourismIndex >= 2) {
        city = parts[tourismIndex - 2];
        country = parts[tourismIndex - 1];
      }
    } else if (parts.length >= 2) {
      // Assume first two parts are city and country
      city = parts[0];
      country = parts[1];
    }
    
    // Create varied search queries for better results
    if (city && country) {
      // Create a few variations to increase chances of good results
      const queries = [
        `${city} ${country} landmarks`,
        `${city} skyline`,
        `${city} tourist attractions`,
        `${country} travel destination`
      ];
      return queries[Math.floor(Math.random() * queries.length)];
    }
    
    // If we can't parse the query, enhance it with tourism-related terms
    return `${query} landmarks travel destination`;
  }
  static async fetchUnsplashImages(query, count) {
    const url = `${API_CONFIG.unsplash.baseUrl}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
    const headers = {
      'Authorization': `Client-ID ${API_CONFIG.unsplash.key}`
    };

    try {
      console.log('Fetching images from Unsplash with URL:', url);
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Unsplash API response not OK:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Unsplash API raw response:', data);
      
      if (!data || !data.results || !Array.isArray(data.results)) {
        console.error('Unsplash API unexpected data structure:', data);
        throw new Error('Unexpected data structure from Unsplash API');
      }
      
      return data.results.map(photo => ({
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        alt: photo.alt_description || query,
        photographer: photo.user.name,
        source: 'unsplash'
      }));
    } catch (error) {
      console.error('Unsplash API error:', error);
      return [];
    }
  }

  static async fetchPexelsImages(query, count) {
    const url = `${API_CONFIG.pexels.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
    const headers = {
      'Authorization': API_CONFIG.pexels.key
    };

    try {
      const data = await APIUtils.fetchWithTimeout(url, { headers });
      return data.photos.map(photo => ({
        url: photo.src.large,
        thumbnail: photo.src.medium,
        alt: photo.alt || query,
        photographer: photo.photographer,
        source: 'pexels'
      }));
    } catch (error) {
      console.error('Pexels API error:', error);
      return [];
    }
  }

  static getFallbackImages(query, count) {
    // Fallback placeholder images
    const placeholderImages = [];
    for (let i = 0; i < count; i++) {
      placeholderImages.push({
        url: `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(query)}`,
        thumbnail: `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(query)}`,
        alt: query,
        photographer: 'Placeholder',
        source: 'placeholder'
      });
    }
    return placeholderImages;
  }
}

// Main API Integration Class
class TourismDataAPI {
  static async fetchAllData(city, country) {
    try {
      APIUtils.showLoadingIndicator('realTimeData');
      
      // Check if we have demo keys or real keys
      const hasRealKeys = this.hasValidAPIKeys();
      
      if (!hasRealKeys) {
        console.log('Using demo data - API keys not configured');
        const demoData = this.generateDemoData(city, country);
        await this.renderAllData(demoData);
        return;
      }
      
      // Try to fetch from real APIs
      const [
        googleAttractions,
        googleRestaurants,
        googleHotels,
        foursquarePlaces,
        openTripMapPlaces,
        cityImages
      ] = await Promise.allSettled([
        GooglePlacesAPI.searchPlaces(city, country, 'tourist_attraction'),
        GooglePlacesAPI.searchPlaces(city, country, 'restaurant'),
        GooglePlacesAPI.searchPlaces(city, country, 'lodging'),
        FoursquareAPI.searchPlaces(city, country, 'tourism,food,hotels'),
        OpenTripMapAPI.searchPlaces(city, country),
        ImageAPI.fetchImages(`${city} ${country} tourism`, 3)
      ]);

      const compiledData = {
        attractions: this.mergeResults([
          googleAttractions.status === 'fulfilled' ? googleAttractions.value : [],
          foursquarePlaces.status === 'fulfilled' ? foursquarePlaces.value.filter(p => p.category.toLowerCase().includes('tourism')) : [],
          openTripMapPlaces.status === 'fulfilled' ? openTripMapPlaces.value : []
        ]),
        restaurants: googleRestaurants.status === 'fulfilled' ? googleRestaurants.value : [],
        hotels: googleHotels.status === 'fulfilled' ? googleHotels.value : [],
        images: cityImages.status === 'fulfilled' ? cityImages.value : []
      };

      // If no real data was fetched, use demo data
      if (this.isDataEmpty(compiledData)) {
        console.log('No real API data available, using demo data');
        const demoData = this.generateDemoData(city, country);
        await this.renderAllData(demoData);
      } else {
        await this.renderAllData(compiledData);
      }
      
    } catch (error) {
      console.error('Error fetching tourism data:', error);
      // Fallback to demo data on error
      const demoData = this.generateDemoData(city, country);
      await this.renderAllData(demoData);
    }
  }
  static hasValidAPIKeys() {
    // Check if we have at least one valid API key (Unsplash or other APIs)
    const hasUnsplashKey = !API_CONFIG.unsplash.key.includes('DEMO');
    const hasGooglePlacesKey = !API_CONFIG.googlePlaces.key.includes('DEMO');
    const hasFoursquareKey = !API_CONFIG.foursquare.key.includes('DEMO');
    
    // Log API key status to help with debugging
    console.log('API Key Status:', {
      unsplash: hasUnsplashKey ? 'Valid' : 'Demo/Missing',
      googlePlaces: hasGooglePlacesKey ? 'Valid' : 'Demo/Missing',
      foursquare: hasFoursquareKey ? 'Valid' : 'Demo/Missing'
    });
    
    // Return true if we have at least one valid API key
    return hasUnsplashKey || hasGooglePlacesKey || hasFoursquareKey;
  }

  static isDataEmpty(data) {
    return data.attractions.length === 0 && 
           data.restaurants.length === 0 && 
           data.hotels.length === 0;
  }

  static generateDemoData(city, country) {
    const attractions = [
      {
        id: 'demo-1',
        name: `${city} Historic Center`,
        rating: 4.5,
        address: `Historic District, ${city}, ${country}`,
        category: 'Historical Site',
        source: 'demo'
      },
      {
        id: 'demo-2', 
        name: `${city} Art Museum`,
        rating: 4.3,
        address: `Museum Quarter, ${city}, ${country}`,
        category: 'Museum',
        source: 'demo'
      },
      {
        id: 'demo-3',
        name: `${city} Central Park`,
        rating: 4.6,
        address: `City Center, ${city}, ${country}`,
        category: 'Park',
        source: 'demo'
      }
    ];

    const restaurants = [
      {
        id: 'demo-r1',
        name: `Traditional ${country} Cuisine`,
        rating: 4.4,
        address: `Restaurant District, ${city}, ${country}`,
        category: 'Traditional',
        priceLevel: 2,
        source: 'demo'
      },
      {
        id: 'demo-r2',
        name: `${city} Fine Dining`,
        rating: 4.7,
        address: `Upscale Area, ${city}, ${country}`,
        category: 'Fine Dining',
        priceLevel: 4,
        source: 'demo'
      },
      {
        id: 'demo-r3',
        name: 'Local Street Food Market',
        rating: 4.2,
        address: `Market Square, ${city}, ${country}`,
        category: 'Street Food',
        priceLevel: 1,
        source: 'demo'
      }
    ];

    const hotels = [
      {
        id: 'demo-h1',
        name: `${city} Grand Hotel`,
        rating: 4.5,
        address: `Hotel District, ${city}, ${country}`,
        category: 'Luxury Hotel',
        priceLevel: 4,
        source: 'demo'
      },
      {
        id: 'demo-h2',
        name: `Boutique Inn ${city}`,
        rating: 4.3,
        address: `Historic Quarter, ${city}, ${country}`,
        category: 'Boutique Hotel',
        priceLevel: 3,
        source: 'demo'
      },
      {
        id: 'demo-h3',
        name: `Budget Stay ${city}`,
        rating: 4.0,
        address: `Budget Area, ${city}, ${country}`,
        category: 'Budget Hotel',
        priceLevel: 2,
        source: 'demo'
      }
    ];

    const images = [
      {
        url: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop`,
        thumbnail: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop`,
        alt: `${city} cityscape`,
        photographer: 'Demo Image',
        source: 'demo'
      },
      {
        url: `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop`,
        thumbnail: `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=200&fit=crop`,
        alt: `${city} architecture`,
        photographer: 'Demo Image',
        source: 'demo'
      },
      {
        url: `https://images.unsplash.com/photo-1594736797933-d0a9ee1963a1?w=800&h=600&fit=crop`,
        thumbnail: `https://images.unsplash.com/photo-1594736797933-d0a9ee1963a1?w=300&h=200&fit=crop`,
        alt: `${city} tourism`,
        photographer: 'Demo Image',
        source: 'demo'
      }
    ];

    return { attractions, restaurants, hotels, images };
  }

  static mergeResults(resultArrays) {
    const merged = [];
    const seen = new Set();
    
    resultArrays.forEach(array => {
      array.forEach(item => {
        const key = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(item);
        }
      });
    });
    
    return merged.slice(0, 12); // Limit results
  }
  static async renderAllData(data) {
    const container = document.getElementById('realTimeData') || this.createRealTimeContainer();
    
    const isDemoData = data.attractions.some(item => item.source === 'demo');
    
    container.innerHTML = `
      <div class="real-time-section">
        <h3><i class="fas fa-globe-americas"></i> ${isDemoData ? 'Sample Tourism Data' : 'Live Tourism Data'}</h3>
        ${isDemoData ? '<p class="demo-notice"><i class="fas fa-info-circle"></i> Showing sample data. Configure API keys for live data.</p>' : ''}
        
        ${data.images.length > 0 ? this.renderImages(data.images) : ''}
        
        <div class="tourism-tabs">
          <button class="tab-btn active" onclick="TourismDataAPI.showTab('attractions')">
            <i class="fas fa-camera"></i> Attractions (${data.attractions.length})
          </button>
          <button class="tab-btn" onclick="TourismDataAPI.showTab('restaurants')">
            <i class="fas fa-utensils"></i> Restaurants (${data.restaurants.length})
          </button>
          <button class="tab-btn" onclick="TourismDataAPI.showTab('hotels')">
            <i class="fas fa-bed"></i> Hotels (${data.hotels.length})
          </button>
        </div>
        
        <div id="attractions" class="tab-content active">
          ${this.renderPlaces(data.attractions, 'attraction')}
        </div>
        
        <div id="restaurants" class="tab-content">
          ${this.renderPlaces(data.restaurants, 'restaurant')}
        </div>
        
        <div id="hotels" class="tab-content">
          ${this.renderPlaces(data.hotels, 'hotel')}
        </div>
      </div>
    `;

    // Add reviews functionality
    this.addReviewsListeners();
  }

  static renderImages(images) {
    return `
      <div class="destination-images">
        <h4><i class="fas fa-images"></i> Live Destination Photos</h4>
        <div class="image-grid">
          ${images.map(img => `
            <div class="image-card">
              <img src="${img.thumbnail}" alt="${img.alt}" onclick="TourismDataAPI.openImageModal('${img.url}', '${img.alt}')">
              <div class="image-credit">© ${img.photographer}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  static renderPlaces(places, type) {
    if (places.length === 0) {
      return `<div class="no-data">No ${type}s found. Try a different destination.</div>`;
    }

    return `
      <div class="places-grid">
        ${places.map(place => `
          <div class="place-card" data-place-id="${place.id}" data-source="${place.source}">
            <div class="place-header">
              <h4>${place.name}</h4>
              <div class="place-rating">
                ${place.rating !== 'N/A' ? `
                  <div class="stars">${this.generateStars(place.rating)}</div>
                  <span>${place.rating}</span>
                ` : '<span class="no-rating">No rating</span>'}
              </div>
            </div>
            
            <div class="place-details">
              <p class="place-address">
                <i class="fas fa-map-marker-alt"></i>
                ${APIUtils.truncateText(place.address)}
              </p>
              
              ${place.category ? `
                <p class="place-category">
                  <i class="fas fa-tag"></i>
                  ${place.category}
                </p>
              ` : ''}
              
              ${place.priceLevel ? `
                <p class="price-level">
                  <i class="fas fa-dollar-sign"></i>
                  ${'$'.repeat(place.priceLevel)}
                </p>
              ` : ''}
            </div>
            
            <div class="place-actions">
              <button class="action-btn" onclick="TourismDataAPI.showReviews('${place.id}', '${place.source}')">
                <i class="fas fa-comments"></i> Reviews
              </button>
              <button class="action-btn" onclick="TourismDataAPI.getDirections('${encodeURIComponent(place.address)}')">
                <i class="fas fa-directions"></i> Directions
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static generateStars(rating) {
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

  static createRealTimeContainer() {
    const container = document.createElement('div');
    container.id = 'realTimeData';
    container.className = 'real-time-container';
    
    // Insert after the cost breakdown section
    const costSection = document.querySelector('.cost-breakdown');
    if (costSection) {
      costSection.parentNode.insertBefore(container, costSection.nextSibling);
    } else {
      // Fallback: insert in results container
      const resultsContainer = document.getElementById('results');
      if (resultsContainer) {
        resultsContainer.appendChild(container);
      }
    }
    
    return container;
  }

  static showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[onclick="TourismDataAPI.showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
  }

  static async showReviews(placeId, source) {
    const modal = this.createReviewModal();
    modal.style.display = 'block';
    
    const reviewsContainer = modal.querySelector('.reviews-content');
    reviewsContainer.innerHTML = '<div class="loading-reviews">Loading reviews...</div>';
    
    try {
      let reviews = [];
      
      if (source === 'google') {
        reviews = await GooglePlacesAPI.getReviews(placeId);
      }
      
      if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<div class="no-reviews">No reviews available for this place.</div>';
        return;
      }
      
      reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              ${review.profilePhoto ? `<img src="${review.profilePhoto}" alt="${review.author}" class="reviewer-avatar">` : '<div class="reviewer-avatar-placeholder"></div>'}
              <div>
                <h5>${review.author}</h5>
                <div class="review-rating">${this.generateStars(review.rating)}</div>
              </div>
            </div>
            <span class="review-date">${review.time}</span>
          </div>
          <p class="review-text">${review.text}</p>
        </div>
      `).join('');
      
    } catch (error) {
      console.error('Error loading reviews:', error);
      reviewsContainer.innerHTML = '<div class="review-error">Failed to load reviews.</div>';
    }
  }

  static createReviewModal() {
    let modal = document.getElementById('reviewModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'reviewModal';
      modal.className = 'review-modal';
      modal.innerHTML = `
        <div class="review-modal-content">
          <div class="review-modal-header">
            <h3>Place Reviews</h3>
            <span class="close-review-modal">&times;</span>
          </div>
          <div class="reviews-content"></div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add close functionality
      modal.querySelector('.close-review-modal').onclick = () => modal.style.display = 'none';
      modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
      };
    }
    
    return modal;
  }

  static getDirections(address) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(mapsUrl, '_blank');
  }

  static openImageModal(imageUrl, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="image-modal-content">
        <span class="close-image-modal">&times;</span>
        <img src="${imageUrl}" alt="${alt}">
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

  static addReviewsListeners() {
    // Additional event listeners can be added here
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tourism API Integration loaded');
});

// Export for use in main script
// Country Background Images Feature
class BackgroundImageManager {
  constructor() {
    this.currentBackground = null;
    this.backgroundElement = null;
    this.createBackgroundElement();
  }
  
  createBackgroundElement() {
    // Create background container if not exists
    const existingBg = document.getElementById('country-background');
    if (existingBg) {
      this.backgroundElement = existingBg;
      return;
    }
    
    // Create background element
    this.backgroundElement = document.createElement('div');
    this.backgroundElement.id = 'country-background';
    this.backgroundElement.className = 'country-background';
    document.body.prepend(this.backgroundElement);
    
    // Add styles if not already added
    if (!document.getElementById('background-image-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'background-image-styles';
      styleEl.innerHTML = `
        .country-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.5s ease-in-out, background-image 1s ease-in-out;
          filter: blur(0px);
        }
        
        .country-background:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
        }
        
        .country-background.active {
          opacity: 1;
        }
        
        /* Enhance header to work well with backgrounds */
        .header {
          position: relative;
          z-index: 1;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
          color: white;
        }
        
        /* Make containers more transparent to see background */
        .form-container, .results-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
  
  async setCountryBackground(country) {
    if (!country) return;
    
    try {
      console.log(`Setting background for ${country}`);
      const query = `${country} landscape scenic`;
      
      // Try to get a high-quality background image
      const images = await ImageAPI.fetchUnsplashImages(query, 5);
      
      if (images && images.length > 0) {
        // Choose a random image from results
        const randomIndex = Math.floor(Math.random() * images.length);
        const imageUrl = images[randomIndex].url;
        
        console.log(`Setting background image: ${imageUrl}`);
        
        // Set the background image
        this.backgroundElement.style.backgroundImage = `url(${imageUrl})`;
        
        // Add active class after a short delay to trigger transition
        setTimeout(() => {
          this.backgroundElement.classList.add('active');
        }, 100);
        
        this.currentBackground = country;
      } else {
        console.log('No background images found');
      }
    } catch (error) {
      console.error('Error setting country background:', error);
    }
  }
}

// Initialize the background manager
const backgroundManager = new BackgroundImageManager();

// Export APIs to window
window.TourismDataAPI = TourismDataAPI;
window.backgroundManager = backgroundManager;
window.ImageAPI = ImageAPI;
