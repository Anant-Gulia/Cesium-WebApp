Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNGFkN2FmNi1mNDc5LTQxOTktOTg0YS0zZDc0OTZlMTE5YmEiLCJpZCI6NTkzMzcsImlhdCI6MTYyNDAwMjM3Nn0.xVccRtRECdJWPrjR6Aqa1pOLBFOCziWBe5p_7mmB2Rc';
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

var positions = Cesium.Cartesian3.fromDegreesArray([-75, 37,
    -85, 37]);

var redLine = viewer.entities.add({
name : 'Red line on the surface',
polyline : {
positions : positions,
width : 5,
material : Cesium.Color.RED
}
});

viewer.zoomTo(viewer.entities);

var start = -85.0;
var lat = 37.0;

setInterval(function() {
start -= 1.0;
positions.push(Cesium.Cartesian3.fromDegrees(start, lat));
console.log("Pushed...");
redLine.polyline.positions = positions;
}, 500);