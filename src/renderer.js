export default class Renderer {
    constructor() {
        this.camera; 
        this.scene;
        this.renderer;
        this.container;
    }

    createEnvironment() {
        this.container = document.getElementById('container');
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-1, 90, -120);
        //this.camera.position.set(1, 55, 94);

        this.controls = new THREE.OrbitControls(this.camera);

        this.scene = new THREE.Scene();
        this.camera.lookAt(new THREE.Vector3(0.89, 0, 10));
    
        let spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.position.set(20, 50, 60);
        spotLight.position.set(0, 120, -100);
        spotLight.intensity = 1;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        
        // const pointLight = new THREE.PointLight(0xffFFFF, 1.5, 130);
        // pointLight.position.set(0, 200, 0);
        // this.scene.add( pointLight );
        // pointLight.castShadow = true;
        // console.log( pointLight.position )

        this.renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.localClippingEnabled = true;

        if (window.devicePixelRatio>1) {
            this.renderer.setPixelRatio(1);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio );
        }
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
    }

    disableRotate() {
        this.controls.enableRotate = false;
    }

    enableRotate() {
        this.controls.enableRotate = true;
    }

    render() {
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
    }

    addToScene(mesh) {
        this.scene.add(mesh);
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