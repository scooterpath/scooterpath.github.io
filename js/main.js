import { setupPanolens } from './panolens.js';
import { saveSurveyAnswersToGitHub } from './githubresponse.js';

// Fetch the container and set up Panolens
const imageContainer = document.querySelector('.image-container');
const dataImages = imageContainer.dataset.images.split(','); // Convert CSV string to array
const imagePath = imageContainer.dataset.path; // Get the path for images

setupPanolens(imageContainer, dataImages, imagePath);

// Attach the save function to your Save button
let githubToken;

async function loadToken() {
    try {
        const response = await fetch('token.txt'); // Adjust path if token.txt is in another folder
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        githubToken = await response.text(); // Read file content as text
        console.log("Token Loaded:", githubToken.trim());
        // Use githubToken in your logic
    } catch (error) {
        console.error("Error loading token:", error);
    }
}

// Call the function to load the token
loadToken();

//const token = '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'; // Replace with your token
const repo = 'bikepathsurvey/BikePathSurvey'; // Replace with your GitHub repo
document.getElementById('save-btn').addEventListener('click', () => {
  saveSurveyAnswersToGitHub(githubToken, repo);
});
