'use strict'

var parismetromap = angular.module("parismetromap", []);

parismetromap.controller('AppCtrl', function AppCtrl($rootScope, $scope, $http) {
  $scope.locations = [];
  $scope.newLocation = {};
  $scope.showControls = false;
  $scope.lat = 48.853888;
  $scope.lon = 2.345581;
  $scope.deleteButtonVisible = false;
  $scope.layerManagerVisible = false;
  $scope.didGeolocate = false;
  $scope.showInfo = false;
  $scope.activeLocation = {};
  $scope.statusText = "";


  // load the points from local storage
  $scope.loadPoints = function() {
    if ($scope.supportsLocalStorage() && localStorage["dice.parismetromap.locations"]) {
      $scope.locations = JSON.parse(localStorage["dice.parismetromap.locations"]);
      if (!$scope.locations) {
        $scope.locations = { "type": "FeatureCollection",
          "features": []};
      }
      console.log("Controller: loaded points: ", $scope.locations);
    } else {
      $scope.locations = { "type": "FeatureCollection",
        "features": []};
    }
  }


  // handle writing the point to local storage
  $scope.saveLocation = function() {
    console.log("Controller: saving location: ", $scope.newLocation);
    if (!$scope.supportsLocalStorage()) { return false; }
    $scope.locations.features.push($scope.newLocation);

    localStorage.setItem("dice.parismetromap.locations", JSON.stringify($scope.locations));

    $scope.showControls = false;
    $scope.newLocation = {};
    return true;
  }


  $scope.cancel = function() {
    $scope.showControls = false;
    $scope.newLocation = {};
  }


  $scope.createNewLocation = function() {
    console.log("Controller: creating new newLocation");
    $scope.showControls = true;
    $scope.newLocation = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [$scope.center.lng, $scope.center.lat]
      },
      "properties": {
        "text": ""
      }
    };
  }


  // removes a point from $scope.locations and saves the resulting array to local storage
  $scope.deleteLocation = function() {
    var index = -1;

    for (var i = 0; i < $scope.locations.features.length; i++) {
      if ($scope.locations.features[i].properties.text == $scope.activeLocation._popup._content) {
        index = i;
      }
    }

    if (index > -1) {
      $scope.locations.features.splice(index, 1);
    }

    localStorage.setItem("dice.parismetromap.locations", JSON.stringify($scope.locations));
    $scope.deleteButtonVisible = false;
  }


  // Check to see if you can use HTML local storage
  $scope.supportsLocalStorage = function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }


  // Geolocation stuff
  $scope.getLocation = function() {
    console.log("Controller: in getLocaion");
    $scope.connectWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('getLocation', {}, function(response) {
        if (typeof response == "string") {
          console.log("conterting string to json object");
          response = JSON.parse(response);
        }
        console.log("Recieved callback from geolocation: " + response);
        console.log("Type of response: " + typeof response);
        if (response != null && response.success == "true") {
          $scope.setCoordinates(response);
          $scope.didGeolocate = true;
        } else { // no GPS? center on France
          console.log("No navigator, setting coordinates to defaults... " + response.message);
          $scope.lat = 48.853888;
          $scope.lon = 2.345581;
        }
      })
    })
  }


  $scope.setCoordinates = function(position) {
    console.log("Controller: Attempting to set coortinates lat: " + position.lat + " lon: " + position.lon);
    console.log("set coordinates: ", $scope);
    $scope.$apply(function () {
      $scope.lat = position.lat;
      $scope.lon = position.lon;
    });
  }


  // Javascript Bridge
  $scope.exportPoints = function() {
    console.log("fixin to export");
    $scope.statusText = "Exporting GeoJSON";
    $scope.connectWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('saveToFile', $scope.locations, function(response) {
        console.log("Recieved callback from data export: " + response);
        if (typeof response == "string") {
          console.log("conterting string to json object");
          response = JSON.parse(response);
        }
        $scope.statusText = response.message;
        $scope.$apply();
      })
    })
  }


  $scope.connectWebViewJavascriptBridge = function(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge);
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        callback(WebViewJavascriptBridge);
      }, false)
    }
  }


  $scope.initBridge = function() {
    $scope.connectWebViewJavascriptBridge(function(bridge) {
      bridge.init(function(message, responseCallback) {
        console.log('JS got a message', message)
      })
    })
  }


  $scope.dismissNotification = function() {
    $scope.statusText = "";
  }


  $scope.toggleInfo = function() {
    $scope.showInfo = !$scope.showInfo;
  }

  $scope.loadPoints();
  $scope.initBridge();
});
