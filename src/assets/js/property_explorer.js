
var singleCountyFilter = ''
var parcelfilters = true

let markers = [];
let allMarkers = [];
let openInfoWindow = null; // Track the currently open info window

map = ''

if (map == '') {
  initializeMap()
}

function initializeMap() {

  window.initMap = function () {
    const center = { lat: 35.2216, lng: -97.4446 };
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 9,
      tilt: 0,
      center: center,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_LEFT,
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      options: {
        minZoom: 5,
        maxZoom: 19,
        gestureHandling: 'greedy'
      }
    });
    map.addListener("zoom_changed", function (event) {
      if (map.getZoom() >= 15) {
        logVisibleCounties()
      }
    });


    if (window.location.search.match("viewall") || typeof response_data != 'undefined') {
      //http://localhost:8080/properties/?route=viewall
      if (window.location.search.match("viewall") && typeof response_data == 'undefined') {
        map.setZoom(9)
      }
      if (map.getZoom() >= 15) {
        google.maps.event.addListenerOnce(map, 'idle', () => {
          logVisibleCounties()
        })
      }
      let newurl = window.location.protocol + "//" + window.location.host + "/properties";
      window.history.pushState({ path: newurl }, '', newurl);
      if (myOtherShapes.some(shape => shape.account === "aa_ok_counties_outline")) {
      }
      else {
        const customStyle = function (feature) {
          var style = {};
          switch (feature.type) {
            case 1: //'Point'
              style.fillStyle = 'rgba(0,128,0,1)';
              style.radius = 5;
              style.selected = {
                fillStyle: 'rgba(255,0,0,0.5)',
                radius: 6
              }
              break;
            case 2: //'LineString'
              style.strokeStyle = 'rgba(0,0,255,1)';
              style.lineWidth = 3;
              style.selected = {
                strokeStyle: 'rgba(255,0,0,0.5)',
                lineWidth: 4
              }
              break;
            case 3: //'Polygon'
              style.fillStyle = 'rgba(255,255,255,0)';
              style.strokeStyle = 'rgba(0,189,255,1)';
              style.lineWidth = 6;
              style.selected = {
                fillStyle: 'rgba(255,0,0,0.3)',
                strokeStyle: 'rgba(255,0,0,1)',
                lineWidth: 2
              }
              break;
          }
          return style;
        };

        myOtherShapes.push(new othershapeBoundary('aa_ok_counties_outline', 'aa_ok_counties_outline', 'aa_ok_counties_outline', 'aa_ok_counties_outline', customStyle));
      }
    }
  }

}


function logVisibleCounties() {
  if (singleCountyFilter != '') {//if county has been set by url remove all layers and only allow the proper one
    myParcels = myParcels.filter(parcel => {
      if (singleCountyFilter == parcel.county || parcel.county.includes(singleCountyFilter)) {
        return true;
      } else {
        parcel.remove();
        return false; // Remove it from `myParcels`
      }
    });
    if (!myParcels.some(parcel => parcel.county === singleCountyFilter)) {
      myParcels.push(new parcelBoundary(singleCountyFilter, singleCountyFilter, singleCountyFilter, singleCountyFilter));
    }
  }
  else {
    if (map.getZoom() >= 15) {


      const bounds = map.getBounds();
      const ne = bounds.getNorthEast(); // Top right corner
      const sw = bounds.getSouthWest(); // Bottom left corner

      const url = `http://127.0.0.1:5000/intersections?sw_lon=${sw.lng()}&sw_lat=${sw.lat()}&ne_lon=${ne.lng()}&ne_lat=${ne.lat()}`;

      // Send a GET request to the Flask server
      if (parcelfilters) {
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON data from the response
          })
          .then(data => {
            // Assuming `features` is an array in the fetched data
            // console.log('Intersecting features:', data.features);

            // Extract the county names from the fetched data
            const fetchedCountyNames = new Set(data.features.map(county => county.name));

            // Add any new counties not already in `myParcels`

            if (parcelfilters) {
              data.features.forEach((county) => {
                const countyName = county.name;
                if (!myParcels.some(parcel => parcel.county === countyName)) {
                  // Add the new county to `myParcels`
                  const newParcel = new parcelBoundary(countyName, countyName, countyName, countyName)
                  myParcels.push(newParcel);
                  // Select cpdgeo values for this parcel
                  // selectFeaturesForParcel(newParcel);
                  console.log('New parcel added:', newParcel);
                }
              });
            }

            // Remove parcels that are no longer in the fetched data
            myParcels = myParcels.filter(parcel => {
              if (fetchedCountyNames.has(parcel.county)) {
                return true; // Keep it in `myParcels`
              } else {
                parcel.remove(); // Assuming `remove` is a method in the `parcelBoundary` class
                return false; // Remove it from `myParcels`
              }
            });

            // Display the final set of parcels
            // console.log('Remaining parcels:', myParcels);
          })
          .catch(error => console.error('Error fetching data:', error));
      }
    }
  }
}

