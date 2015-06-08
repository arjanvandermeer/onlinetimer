Timer = function ()
{
	var counter=0;
	var startdate=0;
	var enddate=0;
	
	var pausedate;
	
	var intervalCallback = 0;
	
	var intervalCallbackTimer;
	var finishedCallbackTimer;
	
	var intervalCallbackFunction;
	var finishedCallbackFunction;

///	var my = this;
	
	this.countdown = function (set)
	{
		counter = set;
	}
	this.start = function ()
	{
		startdate = new Date();
		enddate = new Date();
		
		enddate.setTime(startdate.getTime() + counter);
		var end =  enddate.getTime() - startdate.getTime();
		finishedCallbackTimer = setTimeout(this.end, end);
		if ( intervalCallbackFunction !== undefined && intervalCallback!== undefined)
		{
			setTimeout(intervalCallbackFunction, 0);
			intervalCallbackTimer = setInterval(intervalCallbackFunction,intervalCallback);
		}
	}
	this.end = function ()
	{
		startdate = undefined;
		enddate = undefined;
		if (  intervalCallbackTimer!== undefined)
			clearInterval(intervalCallbackTimer);
		if ( finishedCallbackFunction !== undefined )
		{
			// using async library would have been nicer here
			setTimeout(finishedCallbackFunction, 0);
		}
	}
	this.togglePause = function ()
	{
		if ( pausedate === undefined )
			this.pause();
		else
			this.resume();
	}
	this.pause = function ()
	{
		if ( pausedate === undefined )
		{
			pausedate = new Date();
			clearInterval(intervalCallbackTimer);
			clearTimeout(finishedCallbackTimer);
			// go to pause
		}
	}
	this.resume = function ()
	{
		var totalPausedTime = ( new Date().getTime() - pausedate.getTime());
		pausedate = undefined;
		
		enddate.setTime(enddate.getTime() + totalPausedTime);
		var end =  enddate.getTime() - (new Date()).getTime();
		finishedCallbackTimer = setTimeout(this.end, end);

		if ( intervalCallbackFunction !== undefined && intervalCallback!== undefined)
		{
			setTimeout(intervalCallbackFunction, 0);
			intervalCallbackTimer = setInterval(intervalCallbackFunction,intervalCallback);
		}

	}
	this.stop = function ()
	{
		if (  intervalCallbackTimer!== undefined)
			clearInterval(intervalCallbackTimer);
		startdate = undefined;
		enddate = undefined;
	}
	this.setInterval = function ( interval, func )
	{
		intervalCallbackFunction = func;
		intervalCallback = interval;
	}
	this.setFinished = function ( func )
	{
		finishedCallbackFunction = func;
	}
	this.hasStarted = function ()
	{
		return startdate !== undefined;
	}
	this.hasEnded = function ()
	{
		return (new Date()) >= enddate;
	}
	this.getRemaining = function ()
	{
		return ( this.hasEnded()? 0 : (enddate.getTime() - new Date().getTime()));
	}
}

var timer = new Timer();
timer.countdown(5000);
timer.setFinished(function(){console.log("YAY");});
setTimeout(function(){timer.togglePause();}, 2000);
setTimeout(function(){timer.togglePause();}, 4000);
timer.setInterval(1000,function () {
	console.log("la "+(timer.getRemaining()));
}/*.bind(timer)*/);
timer.start();
