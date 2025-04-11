// panolens.js

export function setupPanolens(imageContainer, dataImages, imagePath, enableInfospotToggle = false) {
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

  const addedInfospots = []; // store added infospot data
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  dataImages.forEach((image, index) => {
      const panorama = new PANOLENS.ImagePanorama(`${imagePath}${image}`);
      panoramas.push(panorama);
      viewer.add(panorama);

      // Link panoramas
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
              infospot.position.set(-point.x+100, point.y, point.z);
              infospot.addHoverText(description);
              currentPanorama.add(infospot);

              addedInfospots.push({
                  x: -point.x,
                  y: point.y,
                  z: point.z,
                  description: description,
                  image: currentPanorama.path
              });
          }
      });
  }

  return {
      viewer,
      addedInfospots
  };
}
