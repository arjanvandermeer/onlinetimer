writeTime = function ( time )
{
	var totalSec = Math.round( parseInt(time) / 1000);
	var hours = parseInt(totalSec/3600);
	totalSec -= hours*3600;
	var mins = parseInt(totalSec/60);
	totalSec -= mins*60;
	return ''+(hours>9?hours:'0'+hours)+':'+(mins>9?mins:'0'+mins)+':'+(totalSec>9?totalSec:'0'+totalSec);
}
parseTime = function ( input )
{
		var d = input.split(":");
	
		if ( d[1] === undefined )
			d[1]=0;
		if ( d[2] === undefined )
			d[2]=0;
		return (parseInt(d[0])*60*60+parseInt(d[1])*60+parseInt(d[2]))*1000;	
}
load = function ( timer, fieldname )
{
	var field = document.getElementById(fieldname);
	if ( field !== undefined && timer !== undefined )
	{
		var value = localStorage.getItem(fieldname+".value");

		if ( value !== undefined && value !== null )
			field.value = writeTime(value);
		else
			store ( timer, fieldname );
	}
}
store = function ( timer, fieldname )
{
	var field = document.getElementById(fieldname);
	if ( field !== undefined && timer !== undefined )
	{
		localStorage.setItem(fieldname+".value", parseTime(field.value));
	}	
}
start = function ( timer, fieldname)
{
	var field = document.getElementById(fieldname);
	if ( field !== undefined && timer !== undefined )
	{
		field.disabled=true;
		field.classList.add ( 'countdown' );
		if ( field.classList.contains ('finished'))
			field.classList.remove ( 'finished' );

		setFields ( fieldname, false,true, true);

		var time = parseTime(field.value);
		timer.setCountdown(time);
		timer.setInterval ( 1000, function(){ field.value = writeTime(timer.getRemaining());});
		timer.setFinished ( function () { stop ( timer, fieldname, false ); });
		timer.start();
	}
}
pause = function ( timer, fieldname )
{
	var field = document.getElementById(fieldname);
	if ( field !== undefined && timer !== undefined )
	{
		if ( !timer.hasPaused() )
		{
			field.classList.add ( 'paused' );
			timer.pause();
		}else{
			field.classList.remove ('paused');
			timer.resume();
		}
	}
}
stop = function ( timer, fieldname, stopTimer )
{
	if ( timer !== undefined && (stopTimer === undefined || stopTimer === true ))
		timer.stop();
	
	var field = document.getElementById(fieldname);
	if ( field !== undefined && timer !== undefined )
	{
		field.disabled=false;
		field.classList.remove('countdown');
		field.classList.add('finished');
		load ( timer, fieldname);
		setFields ( fieldname, true, false, false);
	}
}
setFields = function ( fieldname, start, pause, stop )
{
	var startField = document.getElementById(fieldname+'.start');
	if ( startField !== undefined )
		startField.disabled=!start;
	var pauseField = document.getElementById(fieldname+'.pause');
	if ( pauseField !== undefined )
		pauseField.disabled=!pause;
	var stopField = document.getElementById(fieldname+'.stop');
	if ( stopField  !== undefined )
		stopField.disabled=!stop;

}
