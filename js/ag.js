(function () {
	current = {
		lastStrumTime : 0,
		chord : 0,
		boxSize : 15,
		chordDelay : 15,
        mode : 'easy',
		strumThreshold : 300
	}

    // Make guitar boxes

	for(var i = 0; i < 5; i++) {
		var offset = 15*i;
		$("#hotSpots").append('<div id="box'+i+'"class="box" style="top:'+offset+'%; left:'+offset+'%">'+offset+'</div>');
		$("#box"+i).data("number", i);
	}

	$(".box").on('motion', function (ev, data) {
		if(current.mode !== 'harp' && data.confidence > 50) {
			current.chord = $(this).data("number");
			//console.log(current.chord);
		}
	});

	// Make harp boxes
	for(var i = 0; i < 9; i++) {
		var offset = 10*i;
		$("#hotSpots").append('<div id="harp-note'+i+'" class="harp-note" style="top:'+offset+'%">'+offset+'</div>');
		$("#harp-note"+i).data("number", i);
	}

	$(".harp-note").on('motion', function (ev, data) {
		if(current.mode === 'harp' && data.confidence > 50) {
			//console.log($(this).data("number"));
			current.chord = $(this).data("number");
			//console.log(current.chord);
		}
	});

	// Light up on activity.
	$(window).on('motion', function(ev, data){
		//console.log('detected motion at', new Date(), 'with data:', data);
		if(data.confidence > 90) {
			var spot = $(data.spot.el);
			spot.addClass('active');
			//console.log(data.confidence);
			setTimeout(function(){
				spot.removeClass('active');
			}, 230);
		}
		
	});

	// example using a class
	$('#strum').on('motion', function(ev, data){
		if(data.confidence > 50) {
			if(((ev.timeStamp - current.lastStrumTime) > current.strumThreshold)) {
				onStrum();
				//console.log('motion detected on strum');
				//console.log(lastStrum);
				//console.log(ev);
				//console.log(data);
				current.lastStrumTime = ev.timeStamp;
			}
		}

	});
})();
