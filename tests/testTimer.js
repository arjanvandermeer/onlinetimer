"use strict";

var assert = require("assert");
var sinon = require("sinon");
var blanket = require("blanket");
var Timer = require ("../libs/Timer.js");

describe('Timer', function(){
  var timer;
  describe('Create and query a timer', function(){
	  before ( function () {
//
	  });
	  beforeEach('Init', function() {
	    	timer = new Timer.Timer();
	    });	 
	    it('should initialize properly with valid hasStarted/hasFinished', function(){
	    	var started = timer.hasStarted();
	    	assert.equal(started,false);

	    	var ended = timer.hasFinished();
	    	assert.equal(ended,false);
	    });
	    it('should initialize properly with getRemaining()', function(){
	    	timer.setCountdown(30000);
	    	var remaining = timer.getRemaining();
	    	assert.equal(30000,remaining);
	    });
	    it('can set functions for callback', function(){
	    	timer.setInterval(500, function(){console.log('interval');})
	    	timer.setFinished(function(finished){console.log('finished '+(finished?'finished':'stopped'));})
	    });
  });
  describe('Let the timer run', function(){
	  var clock;
	  before ( function () {
		  clock = sinon.useFakeTimers();
	  });
	  after( function () {
	       clock.restore();
	  });
	  beforeEach('Init', function() {
	    	timer = new Timer.Timer();
	    	timer.setCountdown(60000);
	    });	 
	    it('With a timer set to 60 seconds, after 30 seconds there should be 30 seconds left and hassFinished should be false', function(){
	    	timer.start();
	    	clock.tick(30000);
	    	assert.equal(30000,timer.getRemaining());
	    	assert.equal(false, timer.hasFinished());
	    });
	    it('With a timer set to 60 seconds, after 90 seconds the getRemaining() should be 0 and the hassFinished should be true', function(){
	    	timer.start();
	    	clock.tick(90000);
	    	assert.equal(0,timer.getRemaining());
	    	assert.equal(true, timer.hasFinished());
	    });
  });
  describe('Test the callbacks', function(){
	  var clock;
	  var intervalSpy;
	  var finishSpy;
	  
	  before ( function () {
		  clock = sinon.useFakeTimers();
	  });
	  after( function () {
	       clock.restore();
	  });
	  beforeEach('Init', function() {
	    	timer = new Timer.Timer();
	    	timer.setCountdown(60000);
	    	
	    	intervalSpy = sinon.spy();
	    	finishSpy = sinon.spy();
	    	
	    	timer.setInterval ( 1000, intervalSpy );
	    	timer.setFinished ( finishSpy );
	    	
	    });	 
	    it('Interval spy should be called 30 + 1 times after 30 s, finish spy never', function(){
	    	timer.start();
	    	clock.tick(30000);
	    	assert.equal((30+1), intervalSpy.callCount);
	    	assert.equal(false, finishSpy.calledOnce);
	    });
	    it('Finishing: Interval spy should be called 60+1 times, finish spy called once with \'true\'', function(){
	    	timer.start();
	    	clock.tick(90000);
	    	assert.equal((60+1), intervalSpy.callCount);
	    	assert.equal(true, finishSpy.calledOnce);
	    	assert.equal(true, finishSpy.calledWith(true));
	    });
	    it('Stopping: Interval spy should be called 30+2 times, finish spy called once with \'false\'', function(){
	    	timer.start();
	    	clock.tick(30500);
	    	timer.stop();
	    	assert.equal((30+2), intervalSpy.callCount);
	    	assert.equal(true, finishSpy.calledOnce);
	    	assert.equal(true, finishSpy.calledWith(false));
	    });
	    it('Pause: Working pause function', function(){
	    	timer.start();
	    	clock.tick(30500);
	    	timer.pause();
	    	clock.tick(10000);
	    	assert.equal(29500, timer.getRemaining());
	    });
	    it('Pause: Working resume function', function(){
	    	timer.start();
	    	clock.tick(30500);
	    	timer.pause();
	    	clock.tick(5000);
	    	timer.resume();
	    	clock.tick(10000);
	    	assert.equal(19500, timer.getRemaining());
	    });
	    it('Pause: Working togglePause function', function(){
	    	timer.start();
	    	clock.tick(30500);
	    	timer.togglePause();
	    	clock.tick(5000);
	    	timer.togglePause();
	    	clock.tick(10000);
	    	assert.equal(19500, timer.getRemaining());
	    });
  });
});
