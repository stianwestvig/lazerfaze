var enemyMaterials = [
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/marte.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/michael.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/rune.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/bergis.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/nikhil.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/stian.png'), color: 0xffffff } ),
    new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/enemies/sverre.png'), color: 0xffffff } ),
];

var boxThing = new THREE.BoxGeometry(3, 3, 3);
var enemies = enemyMaterials.map((enemy => new THREE.Mesh( boxThing, enemy )));
