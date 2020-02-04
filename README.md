# NuberApp
# Discription of nuber app on readme

Demo on the following:
    https://protected-lake-84258.herokuapp.com/
    
    Or build your own.
    
    Items used: Node.js, express, mongoose, heroku, mongodb lab
    
    Add promise as well.

    Note: x-www-form-urlencoded used in postman

Rider Schema

    name

    currentDriver : id

    destination

    location

Driver Schema

    name

    assignedRider : id

    assignedRiderDestination

    assignedRiderLocation

    currentPosition

    availability
    
    rating

Admin Schema

    name


PUT:    /users/driver/:id/setLocation/

    Fulfills:	Drivers need to update their position
    
    Body:
    
        newLocation -> 1600 Amphitheatre Parkway, Mountain View, CA
        
GET:   /users/driver/:id/viewRiderLocationAndDestination/

    Fulfills: 	Drivers need to be able to see assigned Riders destination
    
	        Drivers need to be able to see assigned Riders location

PUT:    /users/driver/:id/setAvailability/

    Fulfills: Drivers need to update their availability
    
    Body:
    
        availability -> String (Unavailable, limited, free)

PUT:    /users/rider/:id/setLocation/

    Fulfills: Riders need to be able to set their location
    
    Body:
    
        newLocation -> 1400 Statesboro Place Circle, Statesboro, GA

Get:    /users/rider/:id/estimateCost/

    Fulfills: Extra feature
    
    Note: only works if Rider has configured location and destination

PUT:    /users/rider/:id/setDestination/

    Fulfills: Riders need to be able to set a destination
    
    Body:
    
        newDestination -> 1600 Amphitheatre Parkway, Mountain View, CA
	

GET:    /users/rider/:id/findNearByDrivers/

    Fulfilled: //none functional
    
GET:   /user/rider/:id/viewDriverLocation/

    Fulfilled: Riders need to be able to see where their selected driver is

PUT:   /user/rider/:id/rateCurrentlyAssignedDriver/

    Fulfilled: extra feature
    
    Body:
    
        rating -> String (EX: 1 star)

GET:    /user/rider/:id/viewEstimatedTime/

    Fulfilled: extra feature
    
    Note: only works if rider had assigned destination and location

PUT:    /users/rider/:id/setDriver/

    Fulfilled: Riders need to be able to select a driver
    
    Body:
    
        requestedDriverId -> ...

POST:   /users/admin/add/admin/

    Fulfilled: Admins need to be able to add/remove new Admins
    
    Body:
    
        name -> String

POST:   /users/admin/add/driver/

    Fulfilled: Admins need to be able to add/remove new drivers
    
    Body:
    
        name -> String
	
        assignedRider -> String rider ID
	
        assignedRiderDestination -> geocode response object or string //Note that other
	
        assignedRiderLocation -> geocode response object or string    //functions expect
	
        currentPosition -> geocode response object or string          //geocode object
	
        availability -> String (check above)
	
        rating -> String (EX:1 star)

POST:   /users/admin/add/rider/

      FulFilled: Admins need to be able to add/remove new riders
      
      Body:
      
          name -> String
	  
          driver -> String driver id
	  
          destination -> geocode response object or string (same deal as above)
	  
          location -> geocode response object or string

Below deletes given entry given ID

DELETE: /users/admin/del/admin/:id/

DELETE: /users/admin/del/rider/:id/

DELETE: /users/admin/del/driver/:id/

Below returns whole collection for viewing purposes

GET:    /users/admin/view/

GET:    /users/rider/view/

GET:    /users/driver/view/


