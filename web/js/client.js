var camera, scene, renderer;
var effect, controls;
var element, container;

const player = {
    velocity: {
        x: 0,
        z: 0,
    }
};

function rand() {
    return Math.random() - 0.5;
}

function calc2Dist(vector) {
   return Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
}

function calc3Dist(vector) {
   return calc2Dist({x:calc2Dist({x:vector.x,y:vector.y}),y:vector.z});
}

var clock = new THREE.Clock();

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('app');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xefd1b5, 0.004 );

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    // todo: resetGame

    controls = new THREE.OrbitControls(camera, element);
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

    var light = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.6);
    scene.add(light);

    var textureLoader = new THREE.TextureLoader();

    var texture = textureLoader.load('textures/patterns/checker.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(10, 10);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture,
        transparent: true,
        opacity: 0.8
    });
    var geometry = new THREE.PlaneGeometry(400, 400);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -10;
    scene.add(mesh);

    // skybox
    var materials = [
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_rt.jpg'), side: THREE.BackSide } ), // right
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_lf.jpg'), side: THREE.BackSide } ), // left
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_up.jpg'), side: THREE.BackSide } ), // top
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_dn.jpg'), side: THREE.BackSide } ), // bottom
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_bk.jpg'), side: THREE.BackSide } ), // back
        new THREE.MeshBasicMaterial( { map: textureLoader.load('textures/skybox/cwd_ft.jpg'), side: THREE.BackSide } )  // front
    ];
    var skyGeometry = new THREE.BoxGeometry( 600, 600, 600 );
    var skyMaterial = new THREE.MultiMaterial( materials );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );

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

    camera.position.x += player.velocity.x;
    camera.position.z += player.velocity.z;

    controls.update(dt);
    camera.updateProjectionMatrix();
}

function render(dt) {
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
