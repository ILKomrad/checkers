export default class Renderer {
    constructor(range) {
        this.camera; 
        this.scene;
        this.renderer;
        this.container;
        this.maxFps = 100;
        this.fps = this.maxFps + 1;
        this.fpsControl = true;
    }

    createEnvironment(range) {
        this.container = document.getElementById('container');
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.enableRotate = false;
        this.scene = new THREE.Scene();
        this.camera.lookAt(new THREE.Vector3(0.89, 0, 10));
       
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 1;
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        if (+range === 1) {
            this.camera.position.set(-1, 90, -120);
            spotLight.position.set(0, 120, -100);
        } else {
            this.camera.position.set(1, 110, 110);
            spotLight.position.set(20, 80, 100);
        }
        
        const pointLight = new THREE.PointLight(0xffFFFF, 1.5, 130);
        pointLight.position.set(0, 200, 0);
        this.scene.add( pointLight );
        pointLight.castShadow = true;

        this.renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.localClippingEnabled = true;

        if (window.devicePixelRatio>1) {
            this.renderer.setPixelRatio(1);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio );
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild( this.renderer.domElement );
    }

    disableRotate() {
       // this.controls.enableRotate = false;
    }

    enableRotate() {
       // this.controls.enableRotate = true;
    }

    switchFpsControl(flag) {
        this.fpsControl = flag;
    }

    render() {
       // if (!this.fpsControl) {
            this.show();
            this.fps = 0;
        //} 
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
    }

    addToScene(mesh) {
        this.scene.add(mesh);
    }

    removeFromScene(mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = undefined;
    }

    getScene() {
        return this.scene;
    }

    getDomElement() {
        return this.renderer.domElement;
    }

    getRenderer() {
        return this.renderer;
    }

    getCamera() {
        return this.camera;
    }

    getControls() {
        return this.controls;
    }
}