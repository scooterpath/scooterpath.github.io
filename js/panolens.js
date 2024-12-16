// panolens.js

export function setupPanolens(imageContainer, dataImages, imagePath) {
    // Viewer Configuration
    const viewerConfig = {
      autoRotate: false,
      autoRotateSpeed: 0.3,
      controlBar: true,
    };
  
    // Dynamically Create Panoramas
    const panoramas = [];
    const viewer = new PANOLENS.Viewer({
      container: imageContainer,
      ...viewerConfig,
    });
  
    // Predefined Positions
    const forwardPosition = new THREE.Vector3(-2000, -700, 0);
    const backwardPosition = new THREE.Vector3(2000, -700, 0);
  
    // Generate panoramas and link them
    dataImages.forEach((image, index) => {
      const panorama = new PANOLENS.ImagePanorama(`${imagePath}${image}`);
      panoramas.push(panorama);
      viewer.add(panorama);
  
      // Linking logic
      if (index > 0) {
        panoramas[index - 1].link(panorama, forwardPosition); // Link previous to current
        panorama.link(panoramas[index - 1], backwardPosition); // Link current back to previous
      }
    });
  
    // Set the first panorama
    if (panoramas.length > 0) {
      viewer.setPanorama(panoramas[0]);
    }
  }
  