(function() {
    'use strict';

    var 
    canvas = document.getElementById('canvas'),
    webcam = document.getElementById('webcam'),
    detector = new MotionDetector(webcam);

    var width = 800,
        height = 600,
        factor = 5,
        rWidth = width / factor,
        rHeight = height / factor,
        threshold = 20;


    function render() {
        detector.update();
        for (var i = 0; i < factor; i++) {
             for (var j = 0; j < factor; j++) {
                var avg = detector.getMotionAverage(i * rWidth, j * rHeight, (i + 1) * rWidth, (j + 1) * rHeight, 4);
                if (avg > threshold) {
                    motion(i, j, avg);
                }
            }
        }
        setTimeout(render, 100);
    }
    
    function motion(i, j, avg) {
        if (i >= 4 && j >= 2) {
            console.log('strumming', i, j);
        } else  {
            console.log('note change', i, j);
        }
    }

    navigator.webkitGetUserMedia({video: true}, function(stream) {
        webcam.src = window.webkitURL.createObjectURL(stream);
        render();
    });
})();
