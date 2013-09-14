onmessage = function(event) {
    for (var i = 0; i < factor; i++) {
        for (var j = 0; j < factor; j++) {
            var avg = getMotionAverage(event.data, i * rWidth, j * rHeight, (i + 1) * rWidth, (j + 1) * rHeight);
            if (avg > 100) {
                postMessage([i, j, avg]);
            }
        }
    }
}

var round = function(value){
    return (0.5 + value) << 0;
};


function getMotionAverage(data, x, y, w, h) {
    var average = 0;
    
    var step = 1;

    for (var i = ~~y, yk = ~~(y + h); i < yk; i += step) {
        for (var j = ~~x, xk = ~~(x + w), b; j < xk; j += step) {
            b = ~~(j * 4 + i * width * 4);
            average += (blendedData[b] + blendedData[b + 1] + blendedData[b + 2]) / 3;
        }
    }

    return round(average / ( (w / step) * (h / step) ));
}
