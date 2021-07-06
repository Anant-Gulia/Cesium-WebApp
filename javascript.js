Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGFkN2FmNi1mNDc5LTQxOTktOTg0YS0zZDc0OTZlMTE5YmEiLCJpZCI6NTkzMzcsImlhdCI6MTYyNDAwMjM3Nn0.xVccRtRECdJWPrjR6Aqa1pOLBFOCziWBe5p_7mmB2Rc';
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

let flagPolyline = 0;
let flagCircle = 0;
let flagPolygon4Sides = 0;
let selectedLocationOfA = 0;
let selectedLocationOfB = 0;
let selectedLocationOfC = 0;
let selectedLocationOfD = 0;
let mousePosition = 0;
let arrCartographic = 0;
let selectedLocationOfCenter = 0;
let selectedLocationOfRadius = 0;
let objectMarkerA;
let objectMarkerB;
let objectMarkerC;
let objectMarkerD;

function removeEventListeners() {
    viewer.scene.canvas.removeEventListener('click', callPolyLine, false);
    viewer.scene.canvas.removeEventListener('click', callCircle, false);
    viewer.scene.canvas.removeEventListener('click', viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
        if (Cesium.defined(selectedEntity))
                viewer.entities.remove(selectedEntity);
    }), false);
    viewer.selectedEntityChanged.removeEventListener(function(selectedEntity) {
        if (Cesium.defined(selectedEntity))
                viewer.entities.remove(selectedEntity);
    });
    viewer.scene.canvas.removeEventListener('click', callPolygonWith4Sides, false);
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
    var entity = viewer.entities.getById('mou');
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(e.clientX, e.clientY), ellipsoid);
    if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
        entity.position = cartesian;
        entity.label.show = false;
        entity.label.font_style = 10;
        //entity.position= Cesium.Cartesian2.ZERO; 
        entity.label.text = 'Longitude: ' + longitudeString + ' Latitude: ' + latitudeString + '';
        var result = entity.label.text; 
        document.getElementById("demo").innerHTML = result;
    } else {
        entity.label.show = false;
    }
});

function createPolyline(selectedLocationOfA, selectedLocationOfB) {
    let arr1 = Cesium.Cartographic.fromCartesian(selectedLocationOfA);
    let arr2 = Cesium.Cartographic.fromCartesian(selectedLocationOfB);
    viewer.entities.add({
        name: 'Red Polyline',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([arr1.longitude / Math.PI * 180, arr1.latitude / Math.PI * 180, arr2.longitude / Math.PI * 180, arr2.latitude / Math.PI * 180]),
            width: 5,
            material: Cesium.Color.RED,
            clampToGround : true
        }
    });
    //viewer.entity.merge(objectMarkerA, objectMarkerB);
    viewer.flyTo(viewer.entities);
}

function createPolygonWith4Sides(selectedLocationOfA, selectedLocationOfB, selectedLocationOfC, selectedLocationOfD, height) {
    let arr1 = Cesium.Cartographic.fromCartesian(selectedLocationOfA);
    let arr2 = Cesium.Cartographic.fromCartesian(selectedLocationOfB);
    let arr3 = Cesium.Cartographic.fromCartesian(selectedLocationOfC);
    let arr4 = Cesium.Cartographic.fromCartesian(selectedLocationOfD);
    viewer.entities.add({
        name: "Red polygon with 4 sides",
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights([
                arr1.longitude / Math.PI * 180, arr1.latitude / Math.PI * 180, height,
                arr2.longitude / Math.PI * 180, arr2.latitude / Math.PI * 180, height,
                arr3.longitude / Math.PI * 180, arr3.latitude / Math.PI * 180, height,
                arr4.longitude / Math.PI * 180, arr4.latitude / Math.PI * 180, height]),
            extrudedHeight: 0,
            perPositionHeight: true,
            material : Cesium.Color.RED.withAlpha(0.75),
            //outline : true,
            outlineColor : Cesium.Color.BLACK,
            clampToGround : true
        }
    });
    viewer.flyTo(viewer.entities);
}

function setMarkerInPosA(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    objectMarkerA = viewer.entities.add({
        name: 'Point A',
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
            text: 'Point A',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function setMarkerInPosB(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    objectMarkerB = viewer.entities.add({
        name: 'Point B',
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
            text: 'Point B',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function setMarkerInPosC(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    objectMarkerC = viewer.entities.add({
        name: 'Point C',
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
            text: 'Point C',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function setMarkerInPosD(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    objectMarkerD = viewer.entities.add({
        name: 'Point D',
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
            text: 'Point D',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function setCenterMarker(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    viewer.entities.add({
        name: 'Center',
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
            text: 'Center',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function setRadiusMarker(positionCartographic) {
    viewer.pickTranslucentDepth = true;
    viewer.entities.add({
        name: 'Radius',
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
            text: 'Radius',
            font: '15pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
    });
}

function drawCircle() {
    alert("A circle will now be drawn with center and radius as mouse clicks");
    viewer.scene.canvas.addEventListener('click', callCircle, false);
}

function drawPolyline() {
    alert("A polyline will now be drawn");
    viewer.scene.canvas.addEventListener('click', callPolyLine, false);
}

function deleteEntity() {
    alert('Select any entity to delete');
    viewer.scene.canvas.addEventListener('click', viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
        console.log(selectedEntity);
        if (Cesium.defined(selectedEntity))
                viewer.entities.remove(selectedEntity);
    }), false);
}

function drawPolygonWith4Sides() {
    alert('Select 4 points to create a polygon');
    viewer.scene.canvas.addEventListener('click', callPolygonWith4Sides, false);
}

// let callDeleteFunction = viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
//     console.log(selectedEntity);
//     if (Cesium.defined(selectedEntity))
//             viewer.entities.remove(selectedEntity);
// });

let callPolygonWith4Sides = function PolygonAsArgument (event) {
    event.preventDefault();
    flagPolygon4Sides++;
    if(flagPolygon4Sides === 1) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfA = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosA(Cesium.Cartographic.fromCartesian(selectedLocationOfA));
    } else if(flagPolygon4Sides === 2) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfB = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosB(Cesium.Cartographic.fromCartesian(selectedLocationOfB));
    } else if(flagPolygon4Sides === 3) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfC = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosC(Cesium.Cartographic.fromCartesian(selectedLocationOfC));
    } else if(flagPolygon4Sides === 4) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfD = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosD(Cesium.Cartographic.fromCartesian(selectedLocationOfD));
        let height = Number(window.prompt("Enter height of polygon (in metres)", ""));
        createPolygonWith4Sides(selectedLocationOfA, selectedLocationOfB, selectedLocationOfC, selectedLocationOfD, height);
        flagPolygon4Sides = 0;
    }
}

let callPolyLine = function polylineAsArgument (event) {
    event.preventDefault();
    flagPolyline++;
    if (flagPolyline === 1) {
        //For Point A
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfA = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosA(Cesium.Cartographic.fromCartesian(selectedLocationOfA));
    } else if (flagPolyline === 2) {
        //For Point B
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfB = viewer.scene.pickPosition(mousePosition);
        setMarkerInPosB(Cesium.Cartographic.fromCartesian(selectedLocationOfB));
        createPolyline(selectedLocationOfA, selectedLocationOfB);
        flagPolyline = 0;
    }
}

let callCircle = function circleAsArgument (event) {
    event.preventDefault();
    flagCircle++;
    if(flagCircle === 1) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfCenter = viewer.scene.pickPosition(mousePosition);
        arrCartographicOfCenter = Cesium.Cartographic.fromCartesian(selectedLocationOfCenter);
        setCenterMarker(arrCartographicOfCenter);
    } else if(flagCircle === 2) {
        mousePosition = new Cesium.Cartesian2(event.clientX, event.clientY);
        selectedLocationOfRadius = viewer.scene.pickPosition(mousePosition);
        arrCartographicOfRadius = Cesium.Cartographic.fromCartesian(selectedLocationOfRadius);
        setRadiusMarker(arrCartographicOfRadius);
        let temp = Cesium.Cartesian3.fromDegreesArray([arrCartographicOfCenter.longitude / Math.PI * 180, arrCartographicOfCenter.latitude / Math.PI * 180]);
        viewer.entities.add({
            position: temp[0],
            name: "Red Circle",
            ellipse: {
                semiMinorAxis: Math.sqrt(Math.pow((selectedLocationOfRadius.x - selectedLocationOfCenter.x),2) + Math.pow((selectedLocationOfRadius.y - selectedLocationOfCenter.y),2) + Math.pow((selectedLocationOfRadius.z - selectedLocationOfCenter.z),2)),
                semiMajorAxis: Math.sqrt(Math.pow((selectedLocationOfRadius.x - selectedLocationOfCenter.x),2) + Math.pow((selectedLocationOfRadius.y - selectedLocationOfCenter.y),2) + Math.pow((selectedLocationOfRadius.z - selectedLocationOfCenter.z),2)),
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        })
    viewer.flyTo(viewer.entities);
    flagCircle = 0;
    }
}

function editPolyline() {
    viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
        //if (Cesium.defined(selectedEntity))
    })
}

function editEntity() {
    alert('Editing not added yet');
}
