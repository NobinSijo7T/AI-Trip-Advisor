# API Testing Guide for Trip Planner

This guide helps you verify that the Unsplash API integration and the country background images feature are working correctly.

## Prerequisites

1. Make sure the travel planner server is running
2. Open your browser's developer console (F12 or Ctrl+Shift+I) to monitor API requests and any errors

## Testing Unsplash API Integration

1. **Verify API Key:**
   - Check that you have a valid Unsplash API key in `api-integration.js`
   - Current key: `l9C2fGkxvfA03JTCRlzhSv4NwI-KjhwhBFWHCMUGqR8`

2. **Monitor API Requests:**
   - Open browser console
   - Select a destination in the trip planner (e.g., "France" > "Paris")
   - Fill out other form fields and submit
   - Check the console for logs related to Unsplash:
     - "Fetching images for query: 'Paris France tourism'"
     - "Enhanced image query: [varied search terms]"
     - "Found X Unsplash images"

3. **Verify Image Display:**
   - After submitting the form, scroll down to see if destination images appear
   - These should appear in the "Live Destination Photos" section
   - Images should have proper attribution (photographer name)

4. **Troubleshooting:**
   - If images don't appear, check the console for any errors
   - Verify rate limits haven't been exceeded
   - Try the enhanced debugging with verbose logs

## Testing Country Background Images

1. **Submit a Travel Plan:**
   - Select any country and city
   - Fill out the rest of the form and submit
   - The page background should change to show an image related to the country

2. **Visual Verification:**
   - The background should fade in smoothly
   - A semi-transparent overlay should ensure text remains readable
   - The header text should have a text shadow to make it stand out

3. **Test Different Countries:**
   - Try submitting the form with different countries
   - Each country should display a different background image
   - Check if the images are relevant to the selected country

4. **Troubleshooting:**
   - If no background appears, check the console for logs:
     - "Setting background for country: [country]"
     - "Setting background image: [URL]"
   - Verify that the `backgroundManager` object is available in the console
   - Try manually triggering `backgroundManager.setCountryBackground("France")`

## Expected Behavior

1. **Unsplash API:**
   - The application should display 3 relevant images for each destination
   - Images should load quickly and show appropriate attribution
   - If Unsplash API fails, fallback images should be displayed

2. **Background Images:**
   - Each country should have a unique, high-quality background image
   - The background should not interfere with reading the content
   - Background images should change when a new destination is selected
   - The transition between backgrounds should be smooth

## Testing Edge Cases

1. **No Internet Connection:**
   - Disconnect from the internet
   - Submit a travel plan
   - Application should gracefully fall back to demo images

2. **Invalid Destination:**
   - Try submitting with unusual or less popular destinations
   - The application should still attempt to find appropriate images
   - Fallback images should display if no specific images are found

3. **Multiple Fast Submissions:**
   - Submit multiple travel plans in quick succession
   - Verify that the background transitions properly between countries
   - Check that the correct images are displayed for the final destination

## Reporting Issues

If you encounter any problems:
1. Note the exact steps to reproduce the issue
2. Check browser console for any errors
3. Note your browser and OS details
4. Document expected vs. actual behavior
