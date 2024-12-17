import { setupPanolens } from './panolens.js';
import { saveSurveyAnswersToGitHub } from './githubresponse.js';

// Fetch the container and set up Panolens
const imageContainer = document.querySelector('.image-container');
const dataImages = imageContainer.dataset.images.split(','); // Convert CSV string to array
const imagePath = imageContainer.dataset.path; // Get the path for images

setupPanolens(imageContainer, dataImages, imagePath);

// Attach the save function to your Save button
function decrypt(input) {
  const shift = 4;
  let decrypted = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char.match(/[a-zA-Z]/)) { // Check if the character is a letter
      const base = char === char.toUpperCase() ? 65 : 97; // 'A' = 65, 'a' = 97
      // Perform the reverse shift and wrap around using modulo
      decrypted += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    } else {
      // Non-alphabetic characters are added as-is
      decrypted += char;
    }
  }

  return decrypted;
}

const token = decrypt("klt_d9OfiJfPnPAhv6uPy06h3AEEsMlzNo2rn4z0");

//const token = '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'; // Replace with your token
const repo = 'bikepathsurvey/BikePathSurvey'; // Replace with your GitHub repo
