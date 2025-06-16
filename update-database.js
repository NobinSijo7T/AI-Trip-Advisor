// Script to add new destinations using the web scraper

import { DestinationScraper, bulkScrapeDestinations } from './destination-scraper.js';
import fs from 'fs';

// List of new destinations to add
const newDestinations = [
  { city: 'Trivandrum', country: 'India' },
  { city: 'Kochi', country: 'India' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Jaipur', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Varanasi', country: 'India' },
  { city: 'Agra', country: 'India' },
  { city: 'Goa', country: 'India' }
];

// File path for database
const DB_FILE_PATH = './destinations-database.json';

/**
 * Main function to update the database with new destinations
 */
async function updateDatabase() {
  try {
    console.log('Starting destination database update...');
    
    // Read existing database
    let dbData;
    try {
      const rawData = fs.readFileSync(DB_FILE_PATH, 'utf8');
      dbData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading database file:', error);
      console.log('Creating new database file...');
      dbData = { destinations: {}, countries_and_cities: {} };
    }
    
    // Scrape data for all new destinations
    console.log(`Scraping data for ${newDestinations.length} destinations...`);
    const scrapedData = await bulkScrapeDestinations(newDestinations);
    
    // Update database with scraped data
    let updatedCount = 0;
    for (const destData of scrapedData) {
      if (destData && destData.key && destData.data) {
        // Add destination to database
        dbData.destinations[destData.key] = destData.data;
        
        // Update countries and cities
        const country = destData.data.country;
        const city = destData.data.name.split(',')[0].trim();
        
        if (!dbData.countries_and_cities[country]) {
          dbData.countries_and_cities[country] = [];
        }
        
        if (!dbData.countries_and_cities[country].includes(city)) {
          dbData.countries_and_cities[country].push(city);
        }
        
        updatedCount++;
      }
    }
    
    // Write updated database back to file
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbData, null, 2), 'utf8');
    
    console.log(`Database update complete. Added ${updatedCount} new destinations.`);
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

// Run the update
updateDatabase().then(() => {
  console.log('Database update process finished.');
}).catch(err => {
  console.error('Fatal error during database update:', err);
});
