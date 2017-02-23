

/***************************Start Google Maps Function********************************/
      //This function draws the Google Map and runs the ViewModel
      function initMap() {
        
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.666183, lng: -73.705188},
          zoom: 16
        });

        ko.applyBindings(new MapViewModel());

      }

//FourSquare Client_id 2SHKTO3HIH24X2G5QMV3ZECOQPSFHL0H4TCOT5J5IOCP2PMA

//FourSuare Client Secret F0OGW5JUOWZWNLKYS21LDQRGBQRIHEKR0PEX51MQF0OO3XIT

//https://api.foursquare.com/v2/venues/explore?ll=40.7,-74&client_id=2SHKTO3HIH24X2G5QMV3ZECOQPSFHL0H4TCOT5J5IOCP2PMA&client_secret=F0OGW5JUOWZWNLKYS21LDQRGBQRIHEKR0PEX51MQF0OO3XIT&v=20170126

/***************************Ends Google Maps Function********************************/

/*
 *A Place is a Location which has a name, a google maps marker and a isVisible property.
 *@input - string, the name of the place
 *@input - object, Google Maps Marker Object
 *@return void
 **/

function Place(name, marker){
  var self = this;
  self.name = name;
  self.marker = marker;
  self.isVisible = ko.observable(true);
}

/**The Knockout Js ViewModel**/

function MapViewModel(){
  var self = this;

        /*
         * This function makes a Google Maps Marker
         * @input object - position object which includes lattitude and longitude of a place.
         * @input string - title of a place on a map
         * @return object - a google maps marker
         */

         var makeMarker = function (position, titleStr){
            marker = new google.maps.Marker({
            position: position,
            draggable: true,
            animation: google.maps.Animation.DROP,
            map: map,
            title: titleStr,
            visible: true
            });        
            return marker;
         };

         //Make 5 Google Map Markers

        marker1 = makeMarker({lat: 40.666183, lng: -73.705188}, 'Home!');

        marker2 = makeMarker({lat: 40.669092, lng: -73.706459}, 'King Kullen Grocery Store'); 

        marker3 = makeMarker({lat: 40.669019, lng: -73.699743}, 'Hendrickson Park');  

        marker4 = makeMarker({lat: 40.661939, lng: -73.702522}, 'Post Office'); 

        marker5 = makeMarker({lat: 40.667542, lng: -73.706808}, 'Valley Stream Wine and Liquor'); 

        self.markers = [marker1, marker2, marker3, marker4, marker5,];

        // make a list of places using the Place() function.

        self.places = ko.observableArray([
          new Place('Home!', marker1),
          new Place('King Kullen Grocery Store', marker2),
          new Place('Hendrickson Park', marker3),
          new Place('Post Office', marker4),
          new Place('Valley Stream Wine and Liquor Store', marker5),
        ]);

        /*
         * This function adds BOUNCE animation to an element.
         * An AJAX request is also sent to FourSquare API to get a list of
         * recommended venues near the marker location 
         * @input object - A DOM element
         * @input - double - lattitude of the marker
         * @input - double - longitude of the marker
         * @return void
         */

        var bounceOnClick = function (element, lat, lng){
        //add a click listener to the element
        element.addListener('click', function() {
        //if element has an animation set it to null
        if (element.getAnimation() !== null) {
          element.setAnimation(null);
        } else {
        //set BOUNCE animation to the element
          element.setAnimation(google.maps.Animation.BOUNCE);
        //stop animation after 300 ms
          window.setTimeout(function(){element.setAnimation(null);}, 700);
        }

        //send AJAX request to FourSquare API to get recommended places near the location
        $.ajax({
          url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&client_id=2SHKTO3HIH24X2G5QMV3ZECOQPSFHL0H4TCOT5J5IOCP2PMA&client_secret=F0OGW5JUOWZWNLKYS21LDQRGBQRIHEKR0PEX51MQF0OO3XIT&v=20170126",
          type: "GET",
          success: function(data){
          //Retrieve the names of five recommended venues near the location
          var venueStr = "";
          for(var i =0; i < 5; i++){
            if(data.response.groups[0].items[i].venue.name){
              venueStr += data.response.groups[0].items[i].venue.name + "<br>";
            }
          }

          var infowindow = new google.maps.InfoWindow({
          content: venueStr
          });
          infowindow.open(map, element);
          },
          error: function(){
          var infowindow = new google.maps.InfoWindow({
          content: "Could not get data from FourSquare API."
          });
          infowindow.open(map, element);            
          }
        });

        });



        };

        //add a click Listener to all the markers

        bounceOnClick(marker1, 40.666183, -73.705188);

        bounceOnClick(marker2, 40.669092, -73.706459);

        bounceOnClick(marker3, 40.669019, -73.699743);

        bounceOnClick(marker4, 40.661939, -73.702522);

        bounceOnClick(marker5, 40.667542, -73.706808);

        //when a list element is clicked trigger bounceOnClick
        //for the corressponding marker
        self.triggerBounce = function(data, event){
          google.maps.event.trigger(data.marker, 'click');
        };

        //for the input textbox
        //placeName is binded to the input box
        self.placeName = ko.observable("");

        //when the Search Button is clicked
        self.searchPlaces = function(){
        //make all places invisible

        for (var i = 0, j = self.places().length; i < j; i++) {
        self.places()[i].isVisible(false);
        //console.log(self.places()[i]);
        }

        //make markers invisible
        marker1.setVisible(false);    
        marker2.setVisible(false);
        marker3.setVisible(false);
        marker4.setVisible(false);
        marker5.setVisible(false);

        for(var i = 0; i < self.places().length; i++){
          //console.log(self.places()[i].name.toLowerCase());
          if(self.places()[i].name.toLowerCase().indexOf(self.placeName().toLowerCase())>=0){
            //console.log("YY");
            //make the matched marker visible
            self.places()[i].marker.setVisible(true);
            //make the matched place visible
            self.places()[i].isVisible(true);
          }
        }

        };


}
