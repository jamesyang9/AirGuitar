(function() {
    'use strict';

    var 
    canvas = document.getElementById('canvas'),
    webcam = document.getElementById('webcam'),
    detector = new MotionDetector(webcam);

    var width = 800,
        height = 600,
        factor = 10,
        rWidth = 400 / factor,
        rHeight = 400 / factor,
        threshold = 80;


    function render() {
        detector.update();

        var maxAvg = 0, maxI = 0, maxJ = 0;
        for (var i = 0; i < factor; i++) {
            for (var j = 0; j < factor; j++) {
                var avg = detector.getMotionAverage(i * rWidth, j * rHeight, rWidth, rHeight, 4);
                if (avg > maxAvg) {
                    maxAvg = avg;
                    maxI = i;
                    maxJ = j;
                }

            }
        }

        if (maxAvg > threshold) {
            var dist = Math.sqrt(maxI*maxI + maxJ*maxJ);
            onNoteChange(dist);
            console.log('moving', dist);
        }
        
        var bottomLeft = detector.getMotionAverage(width - 200, height - 200, 200, 200, 4);
        if (bottomLeft > threshold) {
            onStrum(bottomLeft);
        }

        setTimeout(render, 100);
    }
    
    function onStrum(avg) {
        
    }

    function onNoteChange(dist) {

    }

    navigator.webkitGetUserMedia({video: true}, function(stream) {
        webcam.src = window.webkitURL.createObjectURL(stream);
        render();
    });
})();
