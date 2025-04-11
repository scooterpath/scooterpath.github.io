import { setupPanolens } from './panolens.js';

// Fetch the container and set up Panolens
const imageContainer = document.querySelector('.image-container');
const dataImages = imageContainer.dataset.images.split(',');
const imagePath = imageContainer.dataset.path;

// Set up Panolens with infospot toggle enabled
const { addedInfospots } = setupPanolens(imageContainer, dataImages, imagePath, true);

// Optional: expose to window for debugging or future submit
window.getInfospots = () => addedInfospots;
