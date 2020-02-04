// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Promise = require('promise');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var admin = require('./AdminUser');
var driver = require('./DriverUser');
var rider = require('./RiderUser');
var googleMapsClient = require('@google/maps').createClient({key: 'AIzaSyBe_mwAQy1usqFpFeQmmZZb3iqNmk2Hvwk'});

//driver stuff
//location must be like 1600 'Amphitheatre Parkway, Mountain View, CA'
router.put('/driver/:id/setLocation/', function (req, res) {
	googleMapsClient.geocode({
		address : req.body.newLocation
	}, function(err, response) {
        if (!err) {
			console.log(response.json.results);
			
            driver.findByIdAndUpdate (req.params.id, {currentPosition : response.json.results}, {new: true}, 
			function (err, user) {
			    if (err) return res.status(500).send("There was a problem updating the user.");
		        res.status(200).send(user);
	        });
            driver.markModified('location');
            driver.save();			
        }
		else{
			console.log("Here it is:" + err)
		}
    });
});	

//view rider destination and location
router.get('/driver/:id/viewRiderLocationAndDestination/', function (req, res) {
    driver.findById (req.params.id, function (err, myDriver) {
	    rider.findById(myDriver.assignedRider, function(err, myRider) {
			if (err)return res.status(500).send("There was a problem viewing location and destination.");
			var destinationAndLocation = 
			{
				destination : myRider.destination[0].formatted_address,
				location : myRider.location[0].formatted_address
			}
			
		    res.send(destinationAndLocation);

		});
	});

});

//Availability list:
// Unavailable
// Limited
// Free
router.put('/driver/:id/setAvailability/', function (req, res) {
    driver.findByIdAndUpdate (req.params.id, {availability : req.body.availability}, {new: true},
	function (err, user) {
	    if (err) return res.status(500).send("There was a problem seting availability.");
		res.status(200).send(user);
	});
});	

//Rider stuff
//location must be like 1600 'Amphitheatre Parkway, Mountain View, CA'
//ex: 1400 Statesboro Place Circle, Statesboro, GA
//in body params : newLocation
router.put('/rider/:id/setLocation/', function (req, res) {
    googleMapsClient.geocode({
		address : req.body.newLocation
	}, function(err, response) {
        if (!err) {
			
            rider.findByIdAndUpdate (req.params.id, {location : response.json.results}, {new: true}, 
			function (err, user) {
			    if (err) return res.status(500).send("There was a problem updating the user.");
		        res.status(200).send(user);
	        });
            driver.markModified('location');
            driver.save();			
        }
		else{
			console.log("Here it is:" + err)
		}
    });
});

//estimate cost
router.get('/rider/:id/estimateCost/', function (req, res) {
    rider.findById (req.params.id, function (err, myRider) {
		if (err) return res.status(500).send("There was a problem rating the driver.");
		if (myRider.location[0].formatted_address == 'undefined') 
			return res.status(500).send("The selected rider does not have a position configured");
		if (myRider.destination[0].formatted_address == 'undefined') 
			return res.status(500).send("The selected rider does not have a destination configured");
        googleMapsClient.distanceMatrix( 
	    {
			origins : myRider.location[0].formatted_address,
			destinations : myRider.destination[0].formatted_address,
			mode : 'driving',
			units : "imperial"
		}, function (err, response) {
   
			const serviceFee = 25;
            const estimatedValuePerMile = 2;
			const price = parseFloat(response.json.rows[0].elements[0].distance.text.replace(/,/g, "")) * estimatedValuePerMile + serviceFee;
			
			res.send({price});
			
		})
		
        
    });
});


//location must be like 1600 'Amphitheatre Parkway, Mountain View, CA'
//ex: 
//in body params : newDestination
router.put('/rider/:id/setDestination/', function (req, res) {
    googleMapsClient.geocode({
		address : req.body.newDestination
	}, function(err, response) {
        if (!err) {
            rider.findByIdAndUpdate (req.params.id, {destination : response.json.results}, {new: true}, 
			function (err, user) {
			    if (err) return res.status(500).send("Rider could not be found.");
		        res.status(200).send(user);
	        });
            driver.markModified('location');
            driver.save();			
        }
		else{
			res.status(500).send("There was a problem with geocode");
			console.log("Here it is:" + err)
		}
    });
});

//Rider can view driver location
router.get('/rider/:id/viewDriverLocation/', function (req, res) {
    rider.findById (req.params.id, function (err, myRider) {
        if (err) return res.status(500).send("Rider could not be found.");
	    driver.findById(myRider.currentDriver, function(err, myDriver) {
			if (err) return res.status(500).send("Driver could not be found.");
		    res.send(myDriver.currentPosition[0].formatted_address);

		});
	});

});

//rider can rate the driver they are assigned to
//body:
//rating : ...
router.put('/rider/:id/rateCurrentlyAssignedDriver/', function (req, res) {
    rider.findById (req.params.id, function (err, myRider) {
		if (err) return res.status(500).send("Rider could not be found.");
	    driver.findByIdAndUpdate(myRider.currentDriver, {rating : req.body.rating}, {new: true},
		function (err, myDriver) {
		    if (err) return res.status(500).send("There was a problem rating the driver.");
            else{
			    res.status(200).send(myDriver);
			
			}
		});
	});

});


//estimating time of trip for rider
router.get('/rider/:id/viewEstimatedTime/', function (req, res) {
    rider.findById (req.params.id, function (err, myRider) {
		if (err) return res.status(500).send("The rider could not be found");
		if (myRider.location[0].formatted_address == 'undefined') 
			return res.status(500).send("The selected rider does not have a position configured");
		if (myRider.destination[0].formatted_address == 'undefined') 
			return res.status(500).send("The selected rider does not have a destination configured");
        googleMapsClient.distanceMatrix( 
	    {
			origins : myRider.location[0].formatted_address,
			destinations : myRider.destination[0].formatted_address,
			mode : 'driving',
			units : "imperial"
		}, function (err, response) {
			if (err) return res.status(500).send("There was a problem estimating time");
			else {
			    res.status(200).send(response.json.rows[0].elements[0].duration.text);
			}
		})
    });

});


/*
//Returns the drivers within 10 miles of rider
//don't know...
router.get('/rider/:id/findNearByDrivers/', function (req, res) {
	var num;
	var end;
	var driverInRange = new Array();
	var answers = []
	
	rider.findById (req.params.id, function (err, myRider) {
		if (err) return res.status(500).send("There was a problem finding rider.");
		else {
		    var start = JSON.stringify(myRider.location[0].formatted_address)
			
		    driver.find({}, function (err, drivers) {
		        if (err) return res.status(500).send("There was a problem iterating through drivers.");
				else{
				    drivers.map(function(currentDriver){
					    end = JSON.stringify(currentDriver.currentPosition[0].formatted_address)
				        
						console.log(currentDriver);
						
					    googleMapsClient.distanceMatrix(
		                {
				            origins: start,
				            destinations: end,
                            mode: 'driving',
                            units: 'imperial'			
			            }, function (err, response) {
						//console.log("Made it into disMatrix"); //debug
						//console.log(err);
						console.log(response);
						//return response;
						//answers.push(reponse.json.rows[0].elements[0].distance.value);
						    if (parseFloat(reponse.json.rows[0].elements[0].distance.text.replace(/,/g, "")) <= 10){
					            res.send(currentDriver);                        
				            }     
				        });	
					
					
					});
				        
				    
				
				}
	
			});
		}	
	});	   
});
*/	

//Driver id must be in body of request
//requestedDriverId : ...
router.put('/rider/:id/setDriver/', function (req, res) {
	driver.findById (req.body.requestedDriverId, function (err, myDriver) {
        if (!err) {
			rider.findByIdAndUpdate (req.params.id, {currentDriver : myDriver.id}, {new: true},
			function (err, myRider) {
				if (err) return res.status(500).send("There was a problem updating the user.");
			    else {
				    res.status(200).send(myRider);
					myDriver.assignedRider = myRider.id
					myDriver.assignedRiderDestination = myRider.destination
					myDriver.assignedRiderLocation = myRider.location
				}
				myDriver.markModified('assignedRider');
				myDriver.markModified('assignedRiderDestination');
				myDriver.markModified('assignedRiderLocation');
                myDriver.save();
		    });		
		}	
        else {
            return res.status(500).send("Can't find Driver.");
		}			
	});		
	 
});	

//Admin add
router.post('/admin/add/admin', function (req, res) {
    admin.create({
            name : req.body.name
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.post('/admin/add/driver', function (req, res) {
    driver.create({
            name : req.body.name,
            assignedRider : req.body.assignedRider,
			assignedRiderDestination : req.body.assignedRiderDestination,
			assignedRiderLocation : req.body.assignedRiderLocation,
			currentPosition : req.body.currentPosition,
			availability : req.body.availability,
			rating : req.body.rating
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.post('/admin/add/rider', function (req, res) {
    rider.create({
            name : req.body.name,
            currentDriver : req.body.driver,
			destination : req.body.destination,
			location : req.body.location
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});


//admin remove Note: Needs to be updated to discriminate between people who have the same name
router.delete('/admin/del/admin/:id', function (req, res) {
	admin.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User was deleted.");
	});
});

router.delete('/admin/del/rider/:id', function (req, res) {
	rider.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User was deleted.");
	});
});	

router.delete('/admin/del/driver/:id', function (req, res) {
	driver.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User was deleted.");
	});
});


//gets all (May need to remove/change in the future
router.get('/admin/view', function (req, res) {
    admin.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

router.get('/rider/view', function (req, res) {
    rider.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

router.get('/driver/view', function (req, res) {
    driver.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


module.exports = router;	