import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase setup
const SUPABASE_URL = "https://kehcaqsammqdmypnfrke.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaGNhcXNhbW1xZG15cG5mcmtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzOTYwNjgsImV4cCI6MjA1NDk3MjA2OH0.zvRddX9uDnu3RA0jwK4Mg4baRoIcRZ-tDIIdmEPdcmg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

// Viewer + Infospot Setup
function setupPanolens(imageContainer, dataImages, imagePath, enableInfospotToggle = false) {
  const viewerConfig = {
    autoRotate: false,
    autoRotateSpeed: 0.3,
    controlBar: true,
  };

  const panoramas = [];
  const viewer = new PANOLENS.Viewer({
    container: imageContainer,
    ...viewerConfig,
  });

  const forwardPosition = new THREE.Vector3(-2000, -700, 0);
  const backwardPosition = new THREE.Vector3(2000, -700, 0);

  const addedInfospots = [];
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  dataImages.forEach((image, index) => {
    const panorama = new PANOLENS.ImagePanorama(`${imagePath}${image}`);
    panoramas.push(panorama);
    viewer.add(panorama);

    if (index > 0) {
      panoramas[index - 1].link(panorama, forwardPosition);
      panorama.link(panoramas[index - 1], backwardPosition);
    }
  });

  if (panoramas.length > 0) {
    viewer.setPanorama(panoramas[0]);
  }

  if (enableInfospotToggle) {
    viewer.container.addEventListener("click", (event) => {
      const toggle = document.getElementById("toggle-infospot");
      if (!toggle || !toggle.checked) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, viewer.camera);

      const currentPanorama = viewer.panorama;
      const intersects = raycaster.intersectObject(currentPanorama, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const description = prompt("Enter infospot description:");
        if (!description) return;

        const infospot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Info);
        infospot.position.set(-point.x + 150, point.y+400, point.z); // optional offset
        infospot.addHoverText(description,-200);
        currentPanorama.add(infospot);
        addedInfospots.push({
          x: -point.x,
          y: point.y,
          z: point.z,
          description: description,
          image: currentPanorama.src.split('/').pop(),
        });
      }
    });
  }

  return {
    viewer,
    addedInfospots
  };
}

// Setup the viewer and expose necessary data
const imageContainer = document.querySelector('.image-container');
const dataImages = imageContainer.dataset.images.split(',');
const imagePath = imageContainer.dataset.path;

const { addedInfospots, getCurrentImage } = setupPanolens(
  imageContainer,
  dataImages,
  imagePath,
  true
);

window.getInfospots = () => addedInfospots;
window.getCurrentImage = getCurrentImage;

// Submit infospots to Supabase (exposed globally)
window.submitInfospotsToSupabase = async function () {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Please log in first.");
    return;
  }
  
  const infospots = window.getInfospots();
  console.log(infospots.length)
  if (!infospots.length) return;

  for (const spot of infospots) {
    console.log(spot.image)
    const { error } = await supabase
      .from('coordinates') // <-- make sure this matches your actual table
      .insert({
        picture_id: spot.image,
        x_coord: spot.x,
        y_coord: spot.y,
        z_coord: spot.z,
        description: spot.description,
        user_uuid: user.id
      });
      
    if (error) {
      console.error("Insert error:", error.message);
    }
  }

  infospots.length = 0; // Clear array after submission
};
