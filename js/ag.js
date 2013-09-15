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
		var offsetTop = 10 * i;
		$("#hotSpots").append('<div id="box'+i+'"class="box" style="top:'+offsetTop+'%; left:'+offset+'%">'+offset+'</div>');
		$("#box"+i).data("number", i);
	}

	$(".box").on('motion', function (ev, data) {
		if(current.mode !== 'harp' && data.confidence > 50) {
			current.chord = $(this).data("number");
            
            if (current.mode === 'medium') {
                onNoteChange();
            }
			//console.log(current.chord);
		}
	});

	// Make harp boxes
	for(var i = 0; i < 9; i++) {
		var offset = 9*i;
		$("#hotSpots").append('<div id="harp-note'+i+'" class="harp-note" style="top:'+offset+'%">'+offset+'</div>');
		$("#harp-note"+i).data("number", i);
	}

	$(".harp-note").on('motion', function (ev, data) {
		if(current.mode == 'harp' && data.confidence > 50) {
			//console.log($(this).data("number"));
			console.log($(this).data("number"));
			current.chord = $(this).data("number");
            onNoteChange();
			//console.log(current.chord);
		}
	});

	for(var i = 3; i < 9; i++) {
		var offset = 10*i;
		$("#hotSpots").append('<div class="harp-strings" style="top:'+offset+'%"></div>');
		//$("#harp-note"+i).data("number", i);
	}	

	$(".harp-strings").on('motion', function (ev, data) {
		//console.log('detected motion at', new Date(), 'with data:', data);
		if(data.confidence > 30 && current.mode === "harp") {
			var spot = $(data.spot.el);
			spot.addClass('active');
			//console.log(data.confidence);
			setTimeout(function(){
				spot.removeClass('active');
			}, 230);

		}
	})

	// Light up on activity.
	$(window).on('motion', function(ev, data){
		//console.log(current.chord);
		//console.log('detected motion at', new Date(), 'with data:', data);
		if(data.confidence > 90 && false) {
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
		if(data.confidence > 50 && current.mode != "harp") {
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

	$("#harp-string").on('motion', function(ev, data){
		console.log(current.mode);
		if(data.confidence > 50 && current.mode == "harp") {
			console.log("hiiii");
			if(((ev.timeStamp - current.lastStrumTime) > current.strumThreshold)) {
				onStrum();
				current.lastStrumTime = ev.timeStamp;
			}
		}
	});

})();
