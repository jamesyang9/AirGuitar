(function(){
	current = new Object();
	current.lastStrumTime = 0;
	current.chord = 0;

	// consider using a debounce utility if you get too many consecutive events
	$(window).on('motion', function(ev, data){
		//console.log('detected motion at', new Date(), 'with data:', data);
		var spot = $(data.spot.el);
		spot.addClass('active');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

	// example using a class
	$('#strum').on('motion', function(ev, data){
		if(data.confidence > 60 && ((ev.timeStamp - current.lastStrumTime) > 600)) {
			console.log('motion detected on strum');
			//console.log(lastStrum);
			//console.log(ev);
			//console.log(data);
			current.lastStrumTime = ev.timeStamp;
		}

	});



})();