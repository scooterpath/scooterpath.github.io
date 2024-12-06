const panorama = new PANOLENS.ImagePanorama( 'images/test0.png' );
const panorama2 = new PANOLENS.ImagePanorama('images/test1.png');
let imageContainer = document.querySelector('.image-container')


var infospotPositions = [
    new THREE.Vector3(-2136.06, 16.30, 890.14),
    new THREE.Vector3(-4236.06, 16.30, 890.14),
    
  ];

const viewer = new PANOLENS.Viewer({
    container: imageContainer,
    autoRotate: false,
    autoRotateSpeed: 0.3,
    controlBar: true,
});

panorama.link( panorama2, infospotPositions[0]);
panorama2.link( panorama, infospotPositions[1]);

viewer.add( panorama,panorama2 );
