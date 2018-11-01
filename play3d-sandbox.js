"use strict";

var RT = (function() {
    var camera = null,
        scene, renderer;
    var animationID = null;
    var update = null;

    function clear3d() {
        if (animationID) {
            cancelAnimationFrame(animationID);
            animationID = null;
        }
        //camera = null;
        scene = new THREE.Scene();
        //renderer = null;
        update = null;
    }

    function create3d() {
        // 1 micrometer to 100 billion light years in one scene, with 1 unit = 1 meter?  preposterous!  and yet...
        var NEAR = 1e-6, FAR = 1e27;

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, NEAR, FAR);
        camera.position.z = 1;
        camera.position.x = 1;
        camera.position.y = 1;
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.update();
    }

    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        if (renderer && scene && camera) {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
    }

    clear3d();
    create3d();

    var obj = {
        clear3d: clear3d,
        render: render,
    };
    Object.defineProperties(obj, {
        scene: {
            get: function() { return scene; }
        }
    });
    return obj;
})();

window.addEventListener('message', function(e) {
    var mainWindow = e.source;
    RT.clear3d();
    var result = null;
    try {
        var f = new Function('scene', 'RT', 'e', e.data);
        f.bind({})(RT.scene);
    } catch( err ) {
        result = err.stack;
    }
    mainWindow.postMessage(result, '*');
    RT.render();
});
