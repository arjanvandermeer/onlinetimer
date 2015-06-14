"use strict";

var Timer = function ()
{
	var counter=30000;
	var startdate;
	var enddate;
	
	var pausedate;
	
	var intervalCallback;
	var intervalCallbackTimer;
	var intervalCallbackFunction;
	
	var finishedCallbackTimer;
	var finishedCallbackFunction;

	this.setCountdown = function (set)
	{
		counter = set;
	}
	this.start = function ()
	{
		if ( pausedate === undefined )
		{
			startdate = new Date();
			enddate = new Date();
			enddate.setTime(startdate.getTime() + counter);
		}
		else
		{
			var totalPausedTime = ( new Date().getTime() - pausedate.getTime());
			enddate.setTime(enddate.getTime() + totalPausedTime);
			pausedate = undefined;
		}
		
		var endTimer =  enddate.getTime() - (new Date()).getTime();
		finishedCallbackTimer = setTimeout(this.stop.bind(this), endTimer);
		
		if ( intervalCallbackFunction !== undefined && intervalCallback!== undefined)
		{
			setTimeout(intervalCallbackFunction, 0);
			intervalCallbackTimer = setInterval(intervalCallbackFunction,intervalCallback);
		}
	}
	this.stop = function ()
	{
		var finished = this.hasFinished();
		
		if (  intervalCallbackTimer!== undefined)
		{
			clearInterval(intervalCallbackTimer);
			intervalCallbackFunction();
			
//			setTimeout(intervalCallbackFunction, 0);
		}
//		startdate = undefined;
//		enddate = undefined;
		if ( finishedCallbackFunction !== undefined )
		{
			clearTimeout(finishedCallbackTimer);
			finishedCallbackFunction(finished);
//			setTimeout(finishedCallbackFunction, 0, true);
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
		}
	}
	this.resume = function ()
	{
		this.start();
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
		return startdate !== undefined && (new Date()) >= startdate;
	}
	this.hasFinished = function ()
	{
		return (new Date()) >= enddate;
	}
	this.getRemaining = function ()
	{
		if (! this.hasStarted() )
			return counter;
		if ( this.hasFinished() )
			return 0;

		var totalPausedTime = 0;
		
		if ( pausedate !== undefined )
			var totalPausedTime = ( new Date().getTime() - pausedate.getTime());
			
		return ( this.hasFinished()? 0 : totalPausedTime+ (enddate.getTime() - new Date().getTime()));
	}
}
/*
// my cute test code
var timer = new Timer();
timer.countdown(5000);
timer.setFinished(function(value){console.log("finished "+value);});
setTimeout(function(){timer.togglePause();}, 2000);
setTimeout(function(){timer.togglePause();}, 4000);
timer.setInterval(1000,function () {
	console.log("remaining: "+(timer.getRemaining()));
}/ *.bind(timer)* /);
timer.start();
*/

// if in node.js mode
if (typeof exports !== 'undefined') 
	exports.Timer=Timer;
