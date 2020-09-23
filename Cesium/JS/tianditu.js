if(!layers){
    const layers = viewer.scene.imageryLayers;
}
let tdt_key = 'c1d6b49adb2ba817109873dbc13becb4';

//天地图影像地图服务
let img_tdt = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/img_w/wmts?tk="+tdt_key,
    layer:'img',
    style:'default',
    tileMatrixSetID:'w',
    format:'tiles',
    minimumLevel: 0,
    maximumLevel: 2
}));

//天地图矢量地图服务
let raster_tdt=new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/vec_w/wmts?tk="+tdt_key,
    layer:'vec',
    style:'default',
    tileMatrixSetID:'w',
    format:'tiles',
    maximumLevel: 50,
    rectangle : Cesium.Rectangle.fromDegrees(100.0, 20.0, 120.0, 35.75)
});
//layers.addImageryProvider(raster_tdt);

//天地图中文注记服务
let cia_tdt= layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.gov.cn/cia_w/wmts?tk='+tdt_key,
    layer:'cia',
    style:'default',
    tileMatrixSetID:'w',
    format:'tiles',
    maximumLevel: 50
}));