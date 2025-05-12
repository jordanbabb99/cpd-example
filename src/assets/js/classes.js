// Create a Set of county names that should exist
var myParcels = [];
var myOtherShapes = [];
const existingCounties = new Set();

class othershapeBoundary {
  // Static property to hold instances
  static instances = {};
  constructor(county, url, layer, account, customStyle) {
    if (parcelBoundary.instances[county]) {
      console.warn(`An instance for ${county} already exists.`);
      return parcelBoundary.instances[county];
    }
    parcelBoundary.instances[county] = this;
    this.map = map
    this.mvtSource = null;
    this.options2 = { setSelected: true, delay: 5 }
    this.county = county;
    this.url = "https://tiles.datacrosspoint.com/services/" + String(url) + "/tiles/{z}/{x}/{y}.pbf";
    // this.url = `https://datacrosspointdev.com/gettiles/${String(url)}/tiles/{z}/{x}/{y}.pbf`;
    this.layer = layer;
    this.account = account;
    this.customStyle = customStyle;
    this.options = {
      url: String(this.url),
      style: this.customStyle || this.defaultStyle,
      cache: true,

    };
    this.init()
  }
  defaultStyle(feature) {
    var style = {}
    switch (feature.type) {
      case 1: //'Point'
        style.fillStyle = 'rgba(49,79,79,1)';
        style.radius = 5;
        style.selected = {
          fillStyle: 'rgba(255,255,0,0.5)',
          radius: 6
        }
        break;
      case 2: //'LineString'
        style.strokeStyle = 'rgba(85,205,236,1)';
        style.lineWidth = 3;
        style.selected = {
          strokeStyle: 'rgba(255,25,0,0.5)',
          lineWidth: 4
        }
        break;
      case 3: //'Polygon'
        style.fillStyle = 'rgba(255,255,255,0)';
        style.strokeStyle = 'rgba(79,166,240,1)';
        style.lineWidth = 1;
        style.selected = {
          fillStyle: 'rgba(255,140,0,0.3)',
          strokeStyle: 'rgba(255,140,0,1)',
          lineWidth: 2
        }
        break;
    }
    return style;
  }
  init() {
    console.log("Creating a new instance for: ", this.county)
    this.mvtSource = new MVTSource(map, this.options);
    map.overlayMapTypes.insertAt(0, this.mvtSource);
    // this.map.addListener("mousemove", (event) => {
    //   this.mvtSource.onMouseHover(event, ShowFeature, this.options2);
    // });
    // this.map.addListener("click", (event) => {
    //   this.mvtSource.onClick(event, ShowSelectedFeatures, this.options2);
    // });
  }
  remove() {
    if (this.mvtSource) {
      const index = map.overlayMapTypes.getArray().indexOf(this.mvtSource);
      if (index >= 0) {
        map.overlayMapTypes.removeAt(index);
      }
    }
    delete parcelBoundary.instances[this.county];
  }
}



class parcelBoundary {
  // Static property to hold instances
  static instances = {};
  constructor(county, url, layer, account, customStyle) {
    if (parcelBoundary.instances[county]) {
      console.warn(`An instance for ${county} already exists.`);
      return parcelBoundary.instances[county];
    }
    parcelBoundary.instances[county] = this;
    this.map = map
    this.mvtSource = null;
    this.options2 = { setSelected: true, delay: 1 }
    this.county = county;
    this.url = "https://tiles.datacrosspoint.com/services/" + String(url) + "/tiles/{z}/{x}/{y}.pbf";
    this.layer = layer;
    this.account = account;
    this.customStyle = customStyle;
    this.options = {
      url: String(this.url),
      // cache: true,
      getIDForLayerFeature: function (feature) {
        return feature.properties.cpdgeo
      },
      style: this.customStyle || this.defaultStyle

    };
    this.init()
  }
  defaultStyle(feature) {
    var style = {}
    switch (feature.type) {
      case 1: //'Point'
        style.fillStyle = 'rgba(49,79,79,1)';
        style.radius = 5;
        style.selected = {
          fillStyle: 'rgba(255,255,0,0.5)',
          radius: 6
        }
        break;
      case 2: //'LineString'
        style.strokeStyle = 'rgba(85,205,236,1)';
        style.lineWidth = 3;
        style.selected = {
          strokeStyle: 'rgba(255,25,0,0.5)',
          lineWidth: 4
        }
        break;
      case 3: //'Polygon'
        style.fillStyle = 'rgba(255,255,255,0)';
        style.strokeStyle = 'rgba(79,166,240,1)';
        style.lineWidth = 1;
        style.selected = {
          fillStyle: 'rgba(255,140,0,0.3)',
          strokeStyle: 'rgba(255,140,0,1)',
          lineWidth: 2
        }
        break;
    }
    return style;
  }
  init() {
    console.log("Creating a new instance for: ", this.county)
    // this.mvtSource = new MVTSource(map, this.options);
    // map.overlayMapTypes.insertAt(0, this.mvtSource);
    this.mvtSource = new MVTSource(this.map, this.options);
    // Add the source at a unique position based on the county
    const currentLayers = this.map.overlayMapTypes.getLength();
    this.map.overlayMapTypes.insertAt(currentLayers, this.mvtSource);


    // try to remove on click for non parcel counties ex: Cleveland
    if (this.county == "cleveland") {
      this.mvtSource.setStyle({
        fillStyle: 'rgba(255,255,255,0)',
        strokeStyle: 'rgba(79,166,240,1)',
        lineWidth: 1
      })
    }
    else if (this.county == "oklahoma") {
      this.mvtSource.setStyle({
        fillStyle: 'rgba(255,255,255,0)',
        strokeStyle: 'rgba(79,166,240,1)',
        lineWidth: 1
      })
    }
    else if (this.county == "payne") {
      this.mvtSource.setStyle({
        fillStyle: 'rgba(255,255,255,0)',
        strokeStyle: 'rgba(79,166,240,1)',
        lineWidth: 1
      })
    }
    else if (this.county == "tulsa") {
      this.mvtSource.setStyle({
        fillStyle: 'rgba(255,255,255,0)',
        strokeStyle: 'rgba(79,166,240,1)',
        lineWidth: 1
      })
    }





    // this.map.addListener("mousemove", (event) => {
    //   this.mvtSource.onMouseHover(event, ShowFeature, this.options2);
    // });
    // this.map.addListener("click", (event) => {
    //   this.mvtSource.onClick(event, ShowSelectedFeatures, this.options2);
    //   // Stop the event propagation to prevent the subsequent click event on the map
    // });
    this.addEventListeners();
  }
  setSelected(input) {
    this.mvtSource.setSelectedFeatures(input);
  }
  addEventListeners() {
    // this.mouseMoveListener = this.map.addListener("mousemove", (event) => {
    //   this.mvtSource.onMouseHover(event, ShowFeature, this.options2);
    // });
    var rightClickOptions = {
      multipleSelection: true, // Multiple feature selection
      setSelected: true, // set feature as selected
      delay: 0
    };
    this.clickListener = this.map.addListener("click", (event) => {
      function getReverseGeocodingData(lat, lng) {
        return new Promise(function (resolve, reject) {
          var latlng = new google.maps.LatLng(lat, lng);
          // This is making the Geocode request	
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            if (status !== google.maps.GeocoderStatus.OK) {
              alert(status);

            }
            // This is checking to see if the Geoeode Status is OK before proceeding	
            if (status == google.maps.GeocoderStatus.OK) {
              //////console.log(results);	
              resolve(results[0]);
            }
          });
        })
      }
      // this.mvtSource.onClick(event, ShowSelectedFeatures, rightClickOptions);
      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      // console.log(this.mvtSource)
      // console.log(event.feature.selected)
      this.mvtSource.onClick(event, (eventData) => {
        window.parcelClicked = true;
        if (eventData.feature) {
          if (eventData.feature.featureId == 14 || eventData.feature.featureId == 55 || eventData.feature.featureId == 60 || eventData.feature.featureId == 72) {
            // Cleveland County
            console.log("Reverse GeoCode for Cleveland at ", lat_global, " and ", long_global)
            getReverseGeocodingData(new google.maps.LatLng(lat_global, long_global)).then(function (resolve) {
              console.log(resolve);
              googleAddress = resolve;
              ShowSelectedFeaturesFromFilterSidebarSingle(0, 0)
              return resolve
              return fillInAddress(resolve);
            }).then(function (resolve) {
            })

          }
          else {
            ShowSelectedFeatures(eventData);
          }
        } else {
          console.warn("No features found in this layer.");
        }
      }, rightClickOptions);
    });
  }
  removeEventListeners() {
    if (this.mouseMoveListener) {
      google.maps.event.removeListener(this.mouseMoveListener);
      this.mouseMoveListener = null;
    }
    if (this.clickListener) {
      google.maps.event.removeListener(this.clickListener);
      this.clickListener = null;
    }
  }
  remove() {
    if (this.clickListener) {
      google.maps.event.removeListener(this.clickListener);
      this.clickListener = null;
    }

    if (this.mvtSource) {
      const index = map.overlayMapTypes.getArray().indexOf(this.mvtSource);
      if (index >= 0) {
        map.overlayMapTypes.removeAt(index);
      }
    }
    delete parcelBoundary.instances[this.county];

  }
  deselect_all_features() {
    this.mvtSource.deselectAllFeatures();
  }
}


function disableShapeClickListeners() {
  Object.values(parcelBoundary.instances).forEach(instance => { if (!instance.layer.includes("_")) { instance.removeEventListeners() } });
}

function enableShapeClickListeners() {
  Object.values(parcelBoundary.instances).forEach(instance => { if (!instance.layer.includes("_")) { instance.addEventListeners() } });
}