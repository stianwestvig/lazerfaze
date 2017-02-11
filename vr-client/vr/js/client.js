var camera, scene, renderer;
var effect, controls;
var element, container, gui;
var players = [];
var raycaster, crosshairs;
var score;

var clock = new THREE.Clock();
// var socket = io('http://localhost:3000');

// socket.on('welcome', function (data) {
//   console.log('registered as player:', data);
//   socket.emit('my other event', { my: 'data' });
// });
//
// socket.on('connect', function(){
//   console.log('connected to server.');
// });
//
// socket.on('all-players', function(data){
//   console.log('got message to all-players:', data);
// });
//
// socket.on('disconnect', function(){
//   console.log('disconnected from server.');
// });

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('app');
    container.appendChild(element);

    score = 0;

    gui1 = document.getElementById('gui1');
    gui2 = document.getElementById('gui2');

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    // controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);

    raycaster = new THREE.Raycaster();
    console.log('raycaster', raycaster);
    // TODO: the width/height might be off
    const width = container.innerWidth / 4;
    const height = container.innerHeight / 4;
    crosshairs = new THREE.Vector2(width, height);

    var light = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.6);
    scene.add(light);

    var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture,
        transparent: true,
        opacity: 0.2
    });

    var geometry = new THREE.PlaneGeometry(1000, 1000);

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);



    // Jel√ya radio!
    objMat = new THREE.Texture();
    objTexLoad = new THREE.ImageLoader();
    objTexLoad.load('fasade.jpg', function(image) {
        objMat.image = image;
        objMat.needsUpdate = true;
    });


    var objLoader = new THREE.OBJLoader();
    objLoader.load('fasadesmall.obj', function(obj) {
        //obj.position.y = 10;
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material.map = objMat;
            }
        });
        scene.add(obj);
    });

/*
    // v0.84 skybox
    var textureLoader = new THREE.TextureLoader();
    var materials = [
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/px.jpg' ) } ), // right
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/nx.jpg' ) } ), // left
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/py.jpg' ) } ), // top
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/ny.jpg' ) } ), // bottom
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/pz.jpg' ) } ), // back
        new THREE.MeshBasicMaterial( { map: textureLoader.load( 'textures/cube/skybox/nz.jpg' ) } )  // front
    ];
    var skymesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 7, 7, 7 ), new THREE.MultiMaterial( materials ) );
    skymesh.scale.x = - 1;
    scene.add(skymesh);
*/

    // v0.68 skybox
    var materials = [
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/px.jpg'), side: THREE.BackSide } ), // right
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/nx.jpg'), side: THREE.BackSide } ), // left
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/py.jpg'), side: THREE.BackSide } ), // top
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/ny.jpg'), side: THREE.BackSide } ), // bottom
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/pz.jpg'), side: THREE.BackSide } ), // back
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/cube/skybox/nz.jpg'), side: THREE.BackSide } )  // front
    ];
    var skyGeometry = new THREE.BoxGeometry( 500, 500, 500 );
    var skyMaterial = new THREE.MeshFaceMaterial( materials );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );

    for (var i = 0; i < employees.length; i++) {
      const increment = i * 3;
      scene.add(employees[i]);
      employees[i].position.x = 8 + increment;
      employees[i].position.y = 3 + increment;
    }

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);
}

var i = 0;
function render(dt) {
    // socket.emit('player-pos-update', {playerId: 1, position: camera.rotation});

    i+= 0.05;

    // BOUNCE! frikafrikafrikafrika!
    // bouncer.position.y = 10*Math.abs(Math.sin(i));
    // bouncer.rotation.y = 10*Math.abs(Math.sin(i));

    // update employees for render:
    for (var j = 0; j < employees.length; j++) {
      employees[j].rotation.y = Math.abs(Math.sin(i));
      employees[j].position.x = 15 + 5*Math.sin(i * 2 + j);
      employees[j].position.z = 20+ 10*Math.sin(i + j);
    }


    // update the picking ray with the camera and crosshairs position
    raycaster.setFromCamera( crosshairs, camera );

    var intersects = raycaster.intersectObjects( scene.children );
    for (let obj of intersects) {
        obj.object.material.color.setHex( 0xff0000 );
        ++score;
    }


    gui1.innerHTML = 'Poeng: ' + score;
    gui2.innerHTML = 'Poeng: ' + score;

    effect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}

// document.addEventListener('mousemose', (e) => {
//     raycaster.x = (e.clientX / window.innerWidth) * 2 - 1;
//     raycaster.y = (e.clientY / window.innerHeight) * 2 + 1;
// });
