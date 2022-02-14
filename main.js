import './style.css';
import * as THREE from 'three';
import { MapControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';


let camera, controls, scene, renderer, object, texture;
const pi = 3.14;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
   // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(400, 200, 0);

    // controls
    controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 3.5;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.minAzimuthAngle = Math.PI / 2;

    // blocks
    //gltfLoader(url,posX,posY,posZ,rotX,rotY,rotZ);
    gltfLoader('/blocks/ECBlock.glb', -48, 0, -385, 0, pi * 0.5, 0, 1);//EC block
    gltfLoader('/blocks/library.glb', -155, 0, 145, 0, pi * 0.5, 0, 2.3);//library block

    //trial blocks
    //blocks(color,posX, posY, posZ, sclX, sclY, sclZ);
    blocks(0xffd700,-75,0,-315,20,25,50);  //canteen
    blocks(0xffd700,-45,0,-320,40,25,40);  //building infront of canteen
    blocks(0xffd700,-85,0,-165,40,60,220);  //Main block
    blocks(0xffd700,-85,0,320,40,60,220); //CS block
  //  blocks('0x000000',-160,0,135,55,40,80); //library block	
    blocks(0xffd700,-170,0,-15,30,20,105); //chem lab block
    blocks(0xffd700,-185,0,-110,30,20,70); //electical lab block
    blocks(0xffd700,205,0,-155,10,20,30); //Gate arch

    //planes
    //plane(url,posX,posY,posZ,rotX,rotY,rotZ,len,wid,repX,repY)
    plane("images/map.png",0,0,0,Math.PI*1.5,Math.PI,0,540,1170,1,1);


	light(0xffd700,0,0,-40);
	light(0x253fff,0,50,0);
	clouds();

    /*
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(0, 0.5, 0);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    
        for (let i = 0; i < 500; i++) {
    
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = Math.random() * 1600 - 800;
            mesh.position.y = 0;
            mesh.position.z = Math.random() * 1600 - 800;
            mesh.scale.x = 20;
            mesh.scale.y = Math.random() * 80 + 10;
            mesh.scale.z = 20;
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            scene.add(mesh);
        }
    */

    // lights

    const dirLight1 = new THREE.DirectionalLight(0x002288);
    dirLight1.position.set(100, 100, 100);
    scene.add(dirLight1);
    dirLight1.castShadow=true;

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(- 100, 100, - 100);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    window.addEventListener('resize', onWindowResize);
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}
function gltfLoader(url, posX, posY, posZ, rotX, rotY, rotZ, scale) {
    const gltfLoader = new GLTFLoader();
    //const url = 'ECBlock.glb';
    gltfLoader.load(url, (gltf) => {
        const root = gltf.scene;
        root.position.x = posX;
        root.position.y = posY;
        root.position.z = posZ;
        root.rotation.x = rotX;
        root.rotation.y = rotY;
        root.rotation.z = rotZ;
	root.scale.x = scale;
	root.scale.y = scale;
	root.scale.z = scale;
	root.traverse((o) => {
  if (o.isMesh) o.material.side = THREE.DoubleSide;
});
        scene.add(root);
    });
}
function blocks(clr,posX, posY, posZ, sclX, sclY, sclZ) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    const material = new THREE.MeshPhongMaterial({ color: clr, flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = posX;
    mesh.position.y = posY;
    mesh.position.z = posZ;
    mesh.scale.x = sclX;
    mesh.scale.y = sclY;
    mesh.scale.z = sclZ;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
}
function plane(url,posX,posY,posZ,rotX,rotY,rotZ,len,wid,repX,repY){
	const groundTexture = new THREE.TextureLoader().load(url);
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set(repX,repY);
	groundTexture.anisotropy = 16;
	groundTexture.encoding = THREE.sRGBEncoding;
	const geometry = new THREE.PlaneGeometry( len, wid );
	const material = new THREE.MeshBasicMaterial( {
		//color: 0xffff00,
		side: THREE.DoubleSide,
		map: groundTexture
	} );
	const plane = new THREE.Mesh( geometry, material );
	plane.rotation.x = rotX;
	plane.rotation.z = rotY;
	scene.add( plane );
}

function light(color,posX,posY,posZ){
	const particleTexture = new THREE.TextureLoader().load( "images/glow.png" );
	const spriteMaterial = new THREE.SpriteMaterial( { 
		map: particleTexture,
		color: color
	} );
	const sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set( 10, 10, 1.0 );
	sprite.material.blending = THREE.AdditiveBlending;
	/*sprite.position.x = 0;
	sprite.position.y = 10;
	sprite.position.z = 0;*/
	sprite.position.set(posX,posY,posZ);
	const light = new THREE.PointLight(color);
	light.position.set(posX,posY,posZ);
	scene.add(light);
	scene.add( sprite );
}

function ranCloud() {
	let val = (Math.random() - Math.random());
	return val;
}

function clouds(){
	for (var i = 0; i < 600; i++) {
		let cloudTex = new THREE.TextureLoader().load('images/cloud.png');
		let cloudMat = new THREE.SpriteMaterial({
			map: cloudTex,
			/*useScreenCoordinates: false,
			alignment: THREE.SpriteAlignment.topLeft,*/
			transparent:true,
			opacity:Math.random()*.9+.1
		});
		let sprite = new THREE.Sprite(cloudMat);
		sprite.position.set(ranCloud()*2000, (ranCloud()*100)+250, ranCloud()*2000);
		let scale = Math.random()*300;
		sprite.scale.set(scale, scale, scale);
		sprite.rotation.x = Math.random()*360;
		scene.add(sprite);
	}
}











