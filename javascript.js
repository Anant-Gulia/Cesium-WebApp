Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGFkN2FmNi1mNDc5LTQxOTktOTg0YS0zZDc0OTZlMTE5YmEiLCJpZCI6NTkzMzcsImlhdCI6MTYyNDAwMjM3Nn0.xVccRtRECdJWPrjR6Aqa1pOLBFOCziWBe5p_7mmB2Rc';
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

let flagPolyline = 0;
let flagCircle = 0;
let markerName = 'A';
let polylineLocations = [];
let circleLocations = [];
let polygonLocations = [];
let polygonLocationsEntities = [];
let polygonEntities = [];
let polylineEntities = [];
let lastPolylineEntity = [];
let removeRotateCameraEventListener = 0;

// document.getElementById("thirdSubMenu").style.cssText = "display: none; position: absolute; top: 0; right: 0; transform: translate(100%,0)";

// document.getElementById("option4").onmouseover = function() {
//     document.getElementById("thirdSubMenu").style.display = "block";
// }


function removeEventListeners() {
    viewer.scene.canvas.removeEventListener('click', callPolyLine, false);
    viewer.scene.canvas.removeEventListener('click', callCircle, false);
    viewer.scene.canvas.removeEventListener('click', callDeleteEntity, false);
    // viewer.selectedEntityChanged.removeEventListener(function(selectedEntity) {
    //     if (Cesium.defined(selectedEntity))
    //             viewer.entities.remove(selectedEntity);
    // });
    viewer.scene.canvas.removeEventListener('click', callPolygon, false);
    viewer.scene.canvas.removeEventListener('contextMenu', callCreatePolygon, false);
    viewer.scene.canvas.removeEventListener('click', callFlyAround, false);
}

viewer.entities.add({
    id: 'mou',
    label: {
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        position : Cesium.Cartesian2.ZERO, 
        show: true,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
    }
});

viewer.scene.canvas.addEventListener('mousemove', function(e) {
    let camera = viewer.scene.camera;
    let heightUnit = ' km';
    let cameraHeight = 0;
    var entity = viewer.entities.getById('mou');
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(e.clientX, e.clientY), ellipsoid);
    if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
        if (camera.positionCartographic.height < 3000) {
            heightUnit = ' m';
            cameraHeight = Math.round(camera.positionCartographic.height);
        } else {
            heightUnit = ' km';
            cameraHeight = Math.round(camera.positionCartographic.height / 1000);
        }
        entity.position = cartesian;
        entity.label.show = false;
        entity.label.font_style = 10;
        //entity.position= Cesium.Cartesian2.ZERO; 
        entity.label.text = 'Latitude: ' + latitudeString + ' Longitude: ' + longitudeString + '' + ' Camera Height: ' + cameraHeight + heightUnit;
        var result = entity.label.text; 
        document.getElementById("demo").innerHTML = result;
    } else {
        entity.label.show = false;
    }
});

function createPolyline(polylineLocations, length) {
    let unitName = ' m';
    if(length >= 10000) {
        length /= 1000;
        unitName = ' km';
    }
    length = Math.round(length);
    let arr1 = Cesium.Cartographic.fromCartesian(polylineLocations[0]);
    let arr2 = Cesium.Cartographic.fromCartesian(polylineLocations[1]);
    let labelPosition = [];
    labelPosition.push((arr2.longitude + arr1.longitude) / 2);
    labelPosition.push((arr2.latitude + arr1.latitude) / 2);
    let polylineEntity = viewer.entities.add({
        name: 'Red Polyline',
        position: Cesium.Cartesian3.fromRadians(labelPosition[0], labelPosition[1], 10),
        polyline: {
            positions: Cesium.Cartesian3.fromRadiansArray([arr1.longitude, arr1.latitude, arr2.longitude, arr2.latitude]),
            width: 5,
            material: Cesium.Color.RED,
            clampToGround : true
        },
        label: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            text: 'Length: ' + length + unitName,
            font: '12pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
    polylineEntities.push(polylineEntity);
    lastPolylineEntity.push(polylineEntity);
    viewer.flyTo(viewer.entities);
}

function createCircle(centerPosition, circleLocations) {
    viewer.entities.add({
        position: centerPosition[0],
        name: "Red Circle",
        ellipse: {
            semiMinorAxis: Math.sqrt(Math.pow((circleLocations[1].x - circleLocations[0].x),2) + Math.pow((circleLocations[1].y - circleLocations[0].y),2) + Math.pow((circleLocations[1].z - circleLocations[0].z),2)),
            semiMajorAxis: Math.sqrt(Math.pow((circleLocations[1].x - circleLocations[0].x),2) + Math.pow((circleLocations[1].y - circleLocations[0].y),2) + Math.pow((circleLocations[1].z - circleLocations[0].z),2)),
            material: Cesium.Color.RED.withAlpha(0.5),
            clampToGround : true
        }
    });
    viewer.flyTo(viewer.entities);
}

let callCreatePolygon = function createPolygon() {
    let height = Number(window.prompt("Enter height of polygon (in metres)", ""));
    let temp = 0, arrayPolygonLocations = [];
    for(let i = 0; i < polygonLocations.length; i++) {
        temp = Cesium.Cartographic.fromCartesian(polygonLocations[i]);
        arrayPolygonLocations.push(temp.longitude);
        arrayPolygonLocations.push(temp.latitude);
        arrayPolygonLocations.push(height);
    }
    let polygonEntity = viewer.entities.add({
        name: "Red polygon with 4 sides",
        polygon : {
            hierarchy : Cesium.Cartesian3.fromRadiansArrayHeights(arrayPolygonLocations),
            extrudedHeight: 0,
            perPositionHeight: true,
            material : Cesium.Color.RED.withAlpha(0.75),
            //outline : true,
            outlineColor : Cesium.Color.BLACK,
            clampToGround : true
        },
        label: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            text: 'Test',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
    viewer.flyTo(viewer.entities);
    polygonEntities.push(polygonEntity);
    polygonLocations.length = 0;
    polygonLocationsEntities.length = 0;
    markerName = 'A';
}

function setMarker(positionCartographic, localMarkerName) {
    viewer.pickTranslucentDepth = true;
    let markerEntity = viewer.entities.add({
        name: localMarkerName,
        position: Cesium.Cartesian3.fromRadians(positionCartographic.longitude, positionCartographic.latitude, 10),
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        },
        label: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            text: localMarkerName,
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
    polygonLocationsEntities.push(markerEntity);
    polylineEntities.push(markerEntity);
    lastPolylineEntity.push(markerEntity);
}

function drawCircle() {
    alert("A circle will now be drawn with center and radius as mouse clicks");
    viewer.scene.canvas.addEventListener('click', callCircle, false);
}

function drawPolyline() {
    alert("Left click to select a point");
    viewer.scene.canvas.addEventListener('click', callPolyLine, false);
}

function drawPolygon() {
    alert('Left click to select the point and Right click to make the polygon');
    viewer.scene.canvas.addEventListener('contextmenu', callCreatePolygon, false);
    viewer.scene.canvas.addEventListener('click', callPolygon, false);
}

function flyAround() {
    alert('Select a point to fly around');
    viewer.scene.canvas.addEventListener('click', callFlyAround, false);
}

function deleteEntity() {
    alert('Select any entity to delete');
    viewer.scene.canvas.addEventListener('click', callDeleteEntity, false);
}

let callDeleteEntity = function deleteEntityAsArgument() {
    viewer.selectedEntityChanged.addEventListener(function (selectedEntity) {
        if (Cesium.defined(selectedEntity)) 
            viewer.entities.remove(selectedEntity);
    })
}

let callPolygon = function PolygonAsArgument (event) {
    event.preventDefault();
    let mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
    let selectedLocation = viewer.scene.pickPosition(mousePosition);
    polygonLocations.push(selectedLocation);
    let selectedLocationCartographic = Cesium.Cartographic.fromCartesian(selectedLocation);
    setMarker(selectedLocationCartographic, 'Point ' + markerName);
    markerName = String.fromCharCode(markerName.charCodeAt() + 1);
}

let callPolyLine = function polylineAsArgument (event) {
    event.preventDefault();
    let selectedLocation = 0;
    mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
    flagPolyline++;
    if (flagPolyline === 1) {
        //For Point A
        selectedLocation = viewer.scene.pickPosition(mousePosition);
        polylineLocations.push(selectedLocation);
        lastPolylineEntity.push(selectedLocation);
        setMarker(Cesium.Cartographic.fromCartesian(selectedLocation), 'Point ' + markerName);
        markerName = String.fromCharCode(markerName.charCodeAt() + 1);
    } else if (flagPolyline === 2) {
        //For Point B
        selectedLocation = viewer.scene.pickPosition(mousePosition);
        setMarker(Cesium.Cartographic.fromCartesian(selectedLocation), 'Point ' + markerName);
        polylineLocations.push(selectedLocation);
        let length = Math.sqrt(Math.pow((polylineLocations[1].x - polylineLocations[0].x),2) + Math.pow((polylineLocations[1].y - polylineLocations[0].y),2) + Math.pow((polylineLocations[1].z - polylineLocations[0].z),2))
        createPolyline(polylineLocations, length);
        markerName = 'A';
        polylineLocations.length = 0;
        flagPolyline = 0;
    }
}

let callCircle = function circleAsArgument (event) {
    event.preventDefault();
    let mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
    let selectedLocation = 0;
    let locationCartographic = 0;
    flagCircle++;
    if(flagCircle === 1) {
        selectedLocation = viewer.scene.pickPosition(mousePosition);
        circleLocations.push(selectedLocation);
        locationCartographic = Cesium.Cartographic.fromCartesian(selectedLocation);
        setMarker(locationCartographic, 'Center');
    } else if(flagCircle === 2) {
        selectedLocation = viewer.scene.pickPosition(mousePosition);
        circleLocations.push(selectedLocation);
        locationCartographic = Cesium.Cartographic.fromCartesian(selectedLocation);
        setMarker(locationCartographic, 'Radius');
        let temp = Cesium.Cartesian3.fromRadiansArray([Cesium.Cartographic.fromCartesian(circleLocations[0]).longitude, Cesium.Cartographic.fromCartesian(circleLocations[0]).latitude]);
        createCircle(temp, circleLocations);
        circleLocations.length = 0;
        flagCircle = 0;
    }
}

let callFlyAround = function flyAroundAsArgument(event) {
    event.preventDefault();
    let camera = viewer.scene.camera;
    let mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
    let selectedLocation = viewer.scene.pickPosition(mousePosition);
    let locationCartographic = Cesium.Cartographic.fromCartesian(selectedLocation);
    setMarker(locationCartographic, 'Point ' + markerName);
    markerName = String.fromCharCode(markerName.charCodeAt() + 1);
    let center = Cesium.Cartesian3.fromRadians(locationCartographic.longitude, locationCartographic.latitude, locationCartographic.height);
    let transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    viewer.scene.camera.lookAtTransform(transform, new Cesium.HeadingPitchRange(camera.heading, camera.pitch, camera.positionCartographic.height));
    removeRotateCameraEventListener = viewer.clock.onTick.addEventListener(function(clock) {
        viewer.scene.camera.rotateRight(0.004);
    });
}

function stopFlyingAroundAPoint() {
    alert('flying stopped');
    markerName = 'A';
    removeRotateCameraEventListener();
}

function deleteLastPolygonPoint() {
    if(polygonLocations.length == 0)
        alert('No points left to be deleted');
    else {
        viewer.entities.remove(polygonLocationsEntities.pop());
        polygonLocations.pop();
        markerName = String.fromCharCode(markerName.charCodeAt() - 1);
    }
}

function deleteLastPolygon() {
    if(polygonEntities.length == 0)
        alert('No Polygons left to be deleted');
    else
        viewer.entities.remove(polygonEntities.pop());
}

function editLastPolyline() {
    viewer.entities.remove(lastPolylineEntity.pop());
    viewer.entities.remove(lastPolylineEntity.pop());
    viewer.entities.remove(lastPolylineEntity.pop());
    let locationPointA = lastPolylineEntity.pop();
    polylineEntities.pop();
    polylineEntities.pop();
    polylineEntities.pop();
    setMarker(Cesium.Cartographic.fromCartesian(locationPointA), 'Point ' + markerName);
    polylineLocations.push(locationPointA);
    markerName = String.fromCharCode(markerName.charCodeAt() + 1);
    flagPolyline++;
    lastPolylineEntity.push(locationPointA);
    drawPolyline();
}

function deleteLastPolyline() {
    if(polylineEntities.length == 0)
        alert('No Polylines left to be deleted');
    else {
        viewer.entities.remove(polylineEntities.pop());
        viewer.entities.remove(polylineEntities.pop());
        viewer.entities.remove(polylineEntities.pop());
    }
}

function editEntity() {
    alert('Editing not added yet');
    removeEventListeners();
}
