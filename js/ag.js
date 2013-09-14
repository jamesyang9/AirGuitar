(function () {
	current = new Object();
	current.lastStrumTime = 0;
	current.chord = 0;
	current.boxSize = 15;

    var strumThreshold = 100;

	$(document).ready(function () {

		for(var i = 0; i < 5; i++) {
			var offset = 15*i;
			$("#hotSpots").append('<div id="box'+i+'"class="box" style="top:'+offset+'%; left:'+offset+'%">'+offset+'</div>');
			$("#box"+i).data("number", i);
			$("#box"+i).on('motion', function (ev, data) {
				if(data.confidence > 50) {
					current.chord = $(this).data("number");
					//console.log(current.chord);
				}
			});
		}
	});

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
		if(data.confidence > 60 && ((ev.timeStamp - current.lastStrumTime) > strumThreshold)) {
            onStrum();
			//console.log('motion detected on strum');
			//console.log(lastStrum);
			//console.log(ev);
			//console.log(data);
			current.lastStrumTime = ev.timeStamp;
		}

	});
})();
