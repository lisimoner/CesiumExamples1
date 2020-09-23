function createEle(){
    const container = document.getElementById('cesiumContainer');
    let disLonLat = document.createElement('div');
    disLonLat.id = 'inputText';
    disLonLat.style.border = 'none';
    disLonLat.style.zIndex = 5;
    disLonLat.style.position = 'absolute';
    disLonLat.style.bottom = 0;
    disLonLat.style.lineHeight = 18 + 'px';
    disLonLat.style.left = 0;
    disLonLat.style.backgroundColor = '#707266';
    disLonLat.style.fontSize = 16 + 'px';
    disLonLat.style.color = 'white';
    disLonLat.style.width = 100 + 'vw';
    disLonLat.style.height = 20 + 'px';

    container.appendChild(disLonLat);
}
createEle();

var inputText=document.getElementById('inputText');
new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction(function(event){
    //屏幕坐标转世界坐标
    let ray=viewer.camera.getPickRay(event.endPosition);
    let cartesian=viewer.scene.globe.pick(ray,viewer.scene);
    if(cartesian){
        //将笛卡尔坐标转换为地理坐标
        let cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        //将弧度转换为度的十进制表示
        let lon=Cesium.Math.toDegrees(cartographic.longitude);
        let lat=Cesium.Math.toDegrees(cartographic.latitude);
        //获取海拔高度
        let height = cartographic.height;
        //let height=viewer.scene.globe.getHeight(cartographic);
        //viewer.scene.debugShowFramesPerSecond = false;  //是否展示FPS和MS

        //显示坡度和坡向
        let slope = getHeigthByLonLat(lat, lon, height);
        //let aspect = getAspect(lat, lon, height);

        inputText.innerText=`经度：${lon.toFixed(3)}，纬度：${lat.toFixed(3)}，高程：${height.toFixed(3)}，坡度：${slope}°`;
    }
},Cesium.ScreenSpaceEventType.MOUSE_MOVE);

/*function getSlope(lon , lat, height) {
    let resutls = [];
    let lon1 = lon + 0.00005;
    let temp1 = Math.abs(getHeigthByLonLat(lon1, lat)-height);
    resutls.push(Math.atan(temp1/5));
    let lon2 = lon - 0.00005;
    let temp2 = Math.abs(getHeigthByLonLat(lon2, lat)-height);
    resutls.push(Math.atan(temp2/5));
    let lat1 = lat + 0.00005;
    let temp3 = Math.abs(getHeigthByLonLat(lon, lat1)-height);
    resutls.push(Math.atan(temp3/5));
    let lat2 = lat - 0.00005;
    let temp4 = Math.abs(getHeigthByLonLat(lon, lat2)-height);
    resutls.push(Math.atan(temp4/5));
    return Math.max.apply(resutls);
}*/

function getHeigthByLonLat(lon, lat, height) {
    let result = [];
    let terrainProvider = Cesium.createWorldTerrain();
    let positions = [
        Cesium.Cartographic.fromDegrees(lon+0.00005, lat),
        Cesium.Cartographic.fromDegrees(lon-0.00005, lat),
        Cesium.Cartographic.fromDegrees(lon, lat+0.00005),
        Cesium.Cartographic.fromDegrees(lon, lat-0.00005),
    ];
    var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
    Cesium.when(promise, function(updatedPositions) {
        for(let i =0;i<updatedPositions.length;i++){
            let temp = Math.atan(Math.abs(((updatedPositions[i].height-height)/5)));
            result.push(temp);
        }
        let max = Math.max.apply(Math, result);
        let aspect = '';
        if(max){
            if(max>0 && max<22.5){
                aspect = '北(N)';
            }else if(max>22.5 && max<45){
                aspect = '东北(NE)';
            }else if(max>45 && max<135){
                aspect = '东(E)';
            }else if(max>135 && max<180){
                aspect = '东南(SE)';
            }else if(max>180 && max<225){
                aspect = '南(S)';
            }else if(max>225 && max<270){
                aspect = '西南(SW)';
            }else if(max>270 && max<315){
                aspect = '西(W)';
            }else if(max>315 && max<337.5){
                aspect = '西北(NW)';
            }else if(max>337.5 && max<360){
                aspect = '北(N)';
            }
            /*switch (max) {
                case max>0 && max<22.5:
                    aspect = '北(N)';
                    break;
                case max>22.5 && max<45:
                    aspect = '东北(NE)';
                    break;
                case max>45 && max<135:
                    aspect = '东(E)';
                    break;
                case max>135 && max<180:
                    aspect = '东南(SE)';
                    break;
                case max>180 && max<225:
                    aspect = '南(S)';
                    break;
                case max>225 && max<270:
                    aspect = '西南(SW)';
                    break;
                case max>270 && max<315:
                    aspect = '西(W)';
                    break;
                case max>315 && max<337.5:
                    aspect = '西北(NW)';
                    break;
                case max>337.5 && max<360:
                    aspect = '北(N)';
                    break;
            }*/
            inputText.innerText=`经度：${lon.toFixed(3)}，纬度：${lat.toFixed(3)}，高程：${height.toFixed(3)}，坡度：${max.toFixed(3)}°，坡向：${aspect}`;
        }
        return Math.max.apply(Math, result);
    });
}