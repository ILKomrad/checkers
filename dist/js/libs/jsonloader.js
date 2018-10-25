class JsonLoader {
  constructor() {
    this.objects = [];
  }

async load(path,textures,placeToScene,castShadow,receiveShadow) {
  if (typeof placeToScene=== 'undefined') {
    placeToScene = true;
  }
  var that = this;
  this.objects.length = 0;
  var parsedItems = [];
  var loader = new THREE.ObjectLoader();
  var p = new Promise(function (resolve, reject) {
    loader.load( path, function ( object ) {
      var fmaterial = new THREE.MeshPhongMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: 0.5,
        color: 0x250000,
        specular: 0x888888,
        //shininess: 10000
      });
      var chrome = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular:0xffffff,
        combine: THREE.MultiplyOperation,
        shininess: 50,
        reflectivity: 0.4
      });
      var gold = new THREE.MeshPhongMaterial({
        color: 0x845b21,
        specular:0xffffff,
        combine: THREE.MultiplyOperation,
        shininess: 40,
        reflectivity: 0.9
      });
      var wood = new THREE.MeshPhongMaterial({
        color: 0x090202,
        specular:0xffffff,
        combine: THREE.MultiplyOperation,
        shininess: 4,
        reflectivity: 0.1
      });
    //  fmaterial.side = THREE.DoubleSide;
      //var mirrorMaterial = new THREE.MeshPhongMaterial( { color: 0x444444, envMap: camera.renderTarget } );

      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            //console.log("added",child);
            child.position.x = -child.position.x;
            child.position.z = -child.position.z;
            THREE.ImageUtils.crossOrigin = '';

            if (typeof textures[child.name]!=='undefined' )  {
              child.material = textures[child.name];
              //child.material.side = THREE.DoubleSide;
              //console.log("Loaded ",child.name);
              if (child.name === "Floor") {
                  child.material.shininess= 300;
                  child.receiveShadow = true;
              }
              if (child.name === "Tablo") {
                  child.material.shininess= 300;
              }
              if (child.name === "Desk") {
              //  var shmaterial = new THREE.ShadowMaterial();
                child.material = fmaterial
                child.receiveShadow = true;
                //child.castShadow = true;
              }
              if (child.name === "Dividers") {
                child.material = chrome
                //child.castShadow = true;
              }
            }
            else {
              child.material = fmaterial;
              //var mirror = new THREE.Reflector( child.geometry, mirrorMaterial);
              //scene.add(mirror)
              console.log("Warning: not found texture for ",child.name,textures);
            }
            if ((child.name === "Dividers")||(child.name === "Circle")||(child.name === "Spindle")||(child.name === "Spindle")||(child.name === "Handels")) {
              child.material = chrome
            }
            if ((child.name === "Smoker1")||(child.name === "Smoker2")||(child.name === "Smoker3")) {
              child.material = gold
            }
            if ((child.name === "Panel1")||(child.name === "Panel2")||(child.name === "Panel3")||(child.name === "Plate1")) {
              child.material = wood
            }
            child.material.side = THREE.DoubleSide;
            child.material.shadowSide  = THREE.DoubleSide;
          //  child.material.needsUpdate = true;
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }});
          object.children = object.children.filter(function(item){if
            (
              (item.name!='Desk1')
              // &&(item.name!='Base')
              // &&(item.name!='Floor')
              // &&(item.name!='Panel1')
              // &&(item.name!='Panel2')
              // &&(item.name!='Panel3')
              // &&(item.name!='Plate')
              // &&(item.name!='Tablo')
              // &&(item.name!='Smoker1')
              // &&(item.name!='Smoker2')
              // &&(item.name!='Smoker3')
              // &&(item.name!='BallReceiver')
              // &&(item.name!='Circle')
              // &&(item.name!='Dividers')
              // &&(item.name!='Spindle')
              // &&(item.name!='SpindleTop')
              // &&(item.name!='SpinnerBase')
              // &&(item.name!='Handels')
              // &&(item.name!='"SpinnerNumbers"')
              // &&(item.name!='"Diamond2"')
        ) return item} );
          if (placeToScene) scene.add(object);
          parsedItems.push(object)
          console.log("Loaded ",object.children.length," items from Scene",object.children);
           resolve(parsedItems);
        });
  });
  // var b = await p;
  // console.log("resolved",this.objects,b);
  return  await p;
}


}
