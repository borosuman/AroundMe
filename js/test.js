var zoom;
var mapCenter;
var infowindow;
var currLat;
var currLon;
var sort;

function getLocation() {
  
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(showPosition);
	  } else {
	    alert("Geolocation is not supported by this browser.");
	  }
}
function showPosition(position) {
	  var lat = position.coords.latitude;
	  var lng = position.coords.longitude;
	  currLat=lat;
	  currLon=lng;
	  initialize(lat,lng);

}


function initialize(lat,lng) {

	  var currentLocation = new google.maps.LatLng(lat,lng);
	  mapCanvas = document.getElementById('currMapholder');
	  mapCanvas.style.height = '360px';
	  mapCanvas.style.width = '290px';

	  map = new google.maps.Map(document.getElementById('currMapholder'), { mapTypeId: google.maps.MapTypeId.ROADMAP,
	    center: currentLocation,
	    zoom: 15
	  });

	  var currentMarker = new google.maps.Marker({
		    map: map,
		    position: currentLocation,
		    title:'Current Location',
		    icon: {
		        url: " http://maps.google.com/mapfiles/dd-start.png",
		        size: new google.maps.Size(71, 71),
		        anchor: new google.maps.Point(3.5, 3.5)
		      }
		  });
	
}
function getInput()
{
	
	$('#list').empty();
	$( "#currMapholder" ).hide();
		
	var input,key=' ',flag;
	
        $(".panel1List a").live('click',function(e){
        	 e.stopImmediatePropagation();
            input = $(this).attr('id');
            if (document.getElementById('sortByDistance').checked) {
          	  sort = document.getElementById('sortByDistance').value;
          	}
           else if (document.getElementById('sortByRating').checked) {
        	  sort = document.getElementById('sortByRating').value;
      	    }
            flag='false';
            performSearch(input,sort,key,flag);
        });
       
        $(".key a").live('click',function(e){
        	key= $("#input").val();
        	input=' ';
            flag='true';
            performSearch(input,sort,key,flag);
        });
    
}
function performSearch(input,sort,key,flag) {

	
  var latlon = new google.maps.LatLng(currLat, currLon);
  mapCanvas = document.getElementById('searchMapholder');
  mapCanvas.style.height = '360px';
  mapCanvas.style.width = '290px';

  map = new google.maps.Map(document.getElementById('searchMapholder'), { mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latlon,
    zoom: 15
  });
  
  var currentMarker = new google.maps.Marker({
	    map: map,
	    position: latlon,
	    title:'Current Location',
	    icon: {
	        url: " http://maps.google.com/mapfiles/dd-start.png",
	        size: new google.maps.Size(71, 71),
	        anchor: new google.maps.Point(3.5, 3.5)
	      }
	  });
 
  if(sort =='sortByDistance'){
	  var request = {
			    location: latlon,
			    types: [input],
			    rankBy: google.maps.places.RankBy.DISTANCE
			  };
	  infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
	  service.nearbySearch(request, callback);
	  sort=' ';
	  
	  
	    
  }
  else if(sort=='sortByRating') {
	  
	  var request = {
			    location: latlon,
			    types: [input],
			    radius:2000,
			    rankBy: google.maps.places.RankBy.PROMINENCE
			  };
	  infowindow = new google.maps.InfoWindow();
	  var service = new google.maps.places.PlacesService(map);
	  service.nearbySearch(request, callback);
	  sort=' ';
  }
  else if(flag=='true') {
	  
	  var request = {
			    location: latlon,
			    radius:5000,
			    keyword:key,
			  };
	  infowindow = new google.maps.InfoWindow();
	  var service = new google.maps.places.PlacesService(map);
	  service.nearbySearch(request, callback);
	  
	  
  }

  
}

function callback(results,status) {
	
  var nameResult = [];
  var distanceResult = [];
  var ratingResult = [];
  var lat=[];
  var lon=[];
  
  
  var latlon = new google.maps.LatLng(currLat, currLon);
  var bounds = new google.maps.LatLngBounds();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	 
    for (var i = 0; i < results.length; i++) {
    	createMarker(results[i],bounds);
    	var placeLatlon;
        placeLatlon=results[i].geometry.location;
        var calculatedDistance=google.maps.geometry.spherical.computeDistanceBetween(latlon,placeLatlon);
       
        nameResult[i]=results[i].name;
	    distanceResult[i]=calculatedDistance;
	    ratingResult[i]=results[i].rating;
	    lat[i]=results[i].geometry.location.lat();
	    lon[i]=results[i].geometry.location.lng();
	    
    }
    bounds.extend(latlon); 
    map.fitBounds(bounds);
    zoom=map.getZoom();
    mapCenter=map.getBounds().getCenter();
    resultDisplay(nameResult,distanceResult,ratingResult,lat,lon);
    
  }
  else{
	  $( "#currMapholder" ).hide();
	  alert("Results not found");

  }
}

function createMarker(place,bounds) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position:  place.geometry.location,
    title: place.name,
    icon: {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
        },
  	animation: google.maps.Animation.DROP
  });
  bounds.extend(placeLoc);
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  
 
}

function resultDisplay(name,distance,rating,lat,lon) {

		for(var i=0;i<name.length;i++){
			var nameList=name[i];
			var distanceList=distance[i];
			var ratingList=rating[i];
			var lat1=lat[i];
			var lon1=lon[i];
			var u=$("#list");
			var a=$('<li>').html(nameList);
			var c=$('<li>').html(distanceList);
			var d=$('<li>').html(ratingList);
		
			u.append(a,c,d);
			u.append('<a data-role="button" onclick="showDirection(' + lat1 + ',' + lon1 + ')" >View directions</a>','<br><hr>');
			
		}
	$( "#listResult" ).show();
	$( "#searchMapholder" ).hide();
	$( "#currMapholder" ).hide();
	
	
}

function showDirection(lat1,lon1){
	
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var start = new google.maps.LatLng(currLat, currLon);
	
    var end=new google.maps.LatLng(lat1,lon1);
	var currentLocation = new google.maps.LatLng(currLat, currLon);
	  mapCanvas = document.getElementById('dirMapholder');
	  mapCanvas.style.height = '360px';
	  mapCanvas.style.width = '290px';

	  map = new google.maps.Map(document.getElementById('dirMapholder'), { mapTypeId: google.maps.MapTypeId.ROADMAP,
	    center: currentLocation,
	    zoom: 15
	  });
	 
	   directionsDisplay.setMap(map);
	 
	  var request = {
		      origin:start,
		      destination:end,
		      travelMode: google.maps.TravelMode.WALKING
		  };
		  directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		     
		    }
		    else
		    	alert("not OK");
		  });

		  $( "#dirMapholder" ).show();
		  $( "#back" ).show();
		  $( "#listResult" ).hide();
		  google.maps.event.trigger(map, 'resize');
}

function mapSwitch(){

 
	$( "#searchMapholder" ).show();
    $( "#back" ).show();
 
    $( "#currMapholder" ).hide();
    $( "#listResult" ).hide();
    $( "#dirMapholder").hide();
  
    google.maps.event.trigger(map, 'resize');
    map.setCenter(mapCenter);
    map.setZoom(zoom);
    
}
function listSwitch(){
	
	 $( "#dirMapholder").hide();
	 $( "#currMapholder" ).hide();
	 $( "#searchMapholder" ).hide();
	 $( "#back" ).hide();
	 $( "#listResult" ).show();
}
//google.maps.event.addDomListener(window, 'load', initialize);

