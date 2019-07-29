let map; // The google map
let bounds; // A google variable for the area to show on the map
let infoWindow = null; // The google variable for the popup info on a clicked map marker
let markers = []; // The google formated markers for each brewery result index
let markersLatLng = []; // Just the Lat and Lng for each marker for easier access
let endMarkerIndex = -1; // The marker index for the destination
let currentPage = 1; // The current page of the brewery results display
let directions = false; // Whether or not there are directions saved currently
let showMapOrDir = 'map'; // Which is showing the map or the directions
let brewResults; // The default sample data, then the results of the brewery api search
let keyArray; // Used to build the map key
let states; // Alphabetical list of the states
let stateCode; // The states abbreviations
let googleKey = 'AIzaSyAIWwZQ6TOKQzmvnZPY4hMEoF3eBdAGckU';
let beerUrl = 'https://api.openbrewerydb.org/breweries?';
let geoUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=';
let geoKey = 'tAgL4sSNSMqpOGN4SQc8hISAmqpRroMi';
function define() {
  // Sample and reference data
  keyArray = [
    ['micro', 'scooter icon', 'Micro', '< 15,000 barrels / year'],
    ['regional', 'truck icon', 'Regional', '> 15,000 and < 6,000,000 barrels / year'],
    ['large', 'boat icon', 'Large', '> 6,000,000 barrels / year'],
    ['brewpub', 'beer and burger icon', 'Brewpub', 'They serve their own beer and food too'],
    ['taproom', 'beer tap icon', 'Taproom', 'They serve their own beer, but no emphasis on food'],
    ['contract', 'contract icon', 'Contract', 'Brewery hired to produce specific beer'],
    ['proprietor', 'duplex icon', 'Proprietor', 'Shared brewery'],
    ['bar', 'billiards icon', 'Bar', 'Bar that brews their own beer'],
    ['planning', 'schematics icon', 'Planning', 'Brewery in planning'],
    ['bikeTrail', 'solid dark green line', 'Bike Route', 'Trails'],
    ['bikeDedicated', 'solid light green line', 'Bike Route', 'Dedicated lanes'],
    ['bikeFriendly', 'dotted green line', 'Bike Route', 'Bike friendly roads']
  ];

  brewResults = [
    { id: 5336,
      name: '13 Below Brewery',
      brewery_type: 'micro',
      street: '7391 Forbes Rd',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45233-1013',
      country: 'United States',
      longitude: '-84.7063481503403',
      latitude: '39.1263976398717',
      phone: '5139750613',
      website_url: 'http://www.13belowbrewery.com',
      updated_at: '2018-08-24T15:43:19.853Z',
      tag_list: [] },
    { id: 5348,
      name: 'Bad Tom Smith Brewing',
      brewery_type: 'micro',
      street: '4720 Eastern Ave',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45226-1893',
      country: 'United States',
      longitude: '-84.4180308597704',
      latitude: '39.1199575504541',
      phone: '5138714677',
      website_url: 'http://www.badtomsmithbrewing.com',
      updated_at: '2018-08-24T15:43:24.136Z',
      tag_list: [] },
    { id: 5353,
      name: 'Big Ash Brewing Company',
      brewery_type: 'planning',
      street: '',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45244-3244',
      country: 'United States',
      longitude: null,
      latitude: null,
      phone: '5133079688',
      website_url: 'http://www.BigAshBrewing.com',
      updated_at: '2018-08-11T21:38:55.931Z',
      tag_list: [] },
    { id: 5360,
      name: 'Boston Beer Co - DBA Samuel Adams Brewing Co',
      brewery_type: 'regional',
      street: '1625 Central Pkwy',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45214-2423',
      country: 'United States',
      longitude: '-84.5207651',
      latitude: '39.11257',
      phone: '6173685000',
      website_url: 'http://www.samueladams.com',
      updated_at: '2018-08-24T15:43:28.521Z',
      tag_list: [] },
    { id: 5370,
      name: 'Brewery in Planning - Cincinnati',
      brewery_type: 'planning',
      street: '',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45245-2833',
      country: 'United States',
      longitude: null,
      latitude: null,
      phone: '5855767169',
      website_url: '',
      updated_at: '2018-08-11T21:38:56.640Z',
      tag_list: [] },
    { id: 5385,
      name: 'Brink Brewing Company',
      brewery_type: 'micro',
      street: '5905 Hamilton Ave',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45224-3045',
      country: 'United States',
      longitude: '-84.545876',
      latitude: '39.192788',
      phone: '5138823334',
      website_url: 'http://www.brinkbrewing.com',
      updated_at: '2018-08-24T15:43:33.335Z',
      tag_list: [] },
    { id: 5394,
      name: 'Christian Moerlein Brewing Co',
      brewery_type: 'regional',
      street: '1621 Moore St',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45202-6438',
      country: 'United States',
      longitude: '-84.5153343213929',
      latitude: '39.113225087534',
      phone: '5138276025',
      website_url: 'http://www.christianmoerlein.com',
      updated_at: '2018-08-24T15:43:37.274Z',
      tag_list: [] },
    { id: 5409,
      name: 'Dead Low Brewing',
      brewery_type: 'planning',
      street: '',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45230',
      country: 'United States',
      longitude: null,
      latitude: null,
      phone: '5132909434',
      website_url: 'http://www.deadlowbrewing.com',
      updated_at: '2018-08-11T21:38:57.930Z',
      tag_list: [] },
    { id: 5427,
      name: 'Fibonacci Brewing Company',
      brewery_type: 'micro',
      street: '1445 Compton Rd',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45231-3559',
      country: 'United States',
      longitude: '-84.4805528',
      latitude: '39.218908',
      phone: '5138321422',
      website_url: 'http://fibbrew.com',
      updated_at: '2018-08-24T15:43:51.294Z',
      tag_list: [] },
    { id: 5429,
      name: 'Fifty West Brewing Co',
      brewery_type: 'brewpub',
      street: '7668 Wooster Pike',
      city: 'Cincinnati',
      state: 'Ohio',
      postal_code: '45227-3926',
      country: 'United States',
      longitude: '-84.4134859',
      latitude: '39.11952',
      phone: '5138348789',
      website_url: 'http://www.fiftywestbrew.com',
      updated_at: '2018-08-24T15:43:52.294Z',
      tag_list: [] }
  ];

  states = [
    "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING"
  ];

  stateCode = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];
}
function addListeners() {
  $('.go').on('click', function() {
    event.preventDefault();
    hideSplashPage();
  }); // Go button click

  $('.searchSpouts').on('click', function() {
    event.preventDefault();
    getBrewSearchInfo();
  }); // Brewery search button click

  $('.searchRoutes').on('click', function() {
    event.preventDefault();
    getRoutePoints();
  }); // Route search button click

  $('.toggleMapDir').on('click', function() {
    event.preventDefault();
    $('#map').toggle();
    $('#textDirections').toggle();
    if ($('#map').is(':visible')) {
      bounds = new google.maps.LatLngBounds();
      bounds.extend(markersLatLng[markersLatLng.length - 1]);
      bounds.extend(markersLatLng[endMarkerIndex]);
      map.fitBounds(bounds);
      // If map is now visible this zooms map to include just starting point and destination on un-hiding

      showMapOrDir = 'map';
    } else {
      showMapOrDir = 'dir';
    } // Record which is showing
  }); // Toggle Map or Directions button click

  $('.fullscreen').on('click', function() {
    event.preventDefault();
    openFullscreen("mapDir");
  }) // Fullscreen Map/Directions button click

  $('.showKey').on('click', function() {
    event.preventDefault();
    if ($('.key').html() == '') {
      let keyHTML = '';
      for (let x = 0; x <= 11; x++) {
        keyHTML += `
        <div class='keyRow'>
          <img class='keyIcon' src='resources/` + keyArray[x][0] + `.png' alt='` + keyArray[x][1] + `'>
          <p class='keySegment'>` + keyArray[x][2] + `</p>
          <p class='keyDescription'>` + keyArray[x][3] + `</p>
        </div>`;
      } // Create key

      keyHTML += `
      <img class='slideUp' src='resources/slideUp.png' alt='slide up arrow image button'>
      `; // Add slide up button

      $('.key').hide();
      $('.key').html(keyHTML);
      $('.slideUp').hide();
      $('.key').slideDown(1000, function(){
        $('.slideUp').show();
      });
    } else {
      $('.slideUp').hide();
      $('.key').slideUp(1000, function(){
        $('.key').delay().html('');
      });
    }
  }) // Show Map Key button click

  $(document).on('click', '.slideUp',function(){
    event.preventDefault();
    $('.slideUp').hide();
    $('.key').slideUp(1000, function(){
      $('.key').delay().html('');
    });
  })// Hide Map Key arrow image click

  window.addEventListener('resize', function(){
    const mq = window.matchMedia("(min-width: 600px)");
    if (mq.matches) {
      $('.toggleMapDir').addClass('hide');
      if ($('#map').css('display') == 'none') {
        $('#map').show();
        $('#map').removeClass('hideMap');
        // Shows map

        bounds = new google.maps.LatLngBounds();
        bounds.extend(markersLatLng[markersLatLng.length - 1]);
        bounds.extend(markersLatLng[endMarkerIndex]);
        map.fitBounds(bounds);
        // Zooms map to include just starting point and destination on un-hiding
      }
      if (directions) {
        $('#textDirections').show();
        $('#textDirections').removeClass('hideDirections');
        // Only shows directions if there are directions currently
      }
    } // If window is wide enough to show map and directions at the same time 
    else {
      if (directions) {
        $('.toggleMapDir').removeClass('hide');
      } // Turn off toggle button

      if (showMapOrDir == 'map') {
        if ($('#map').css('display') == 'none') {
          $('#map').show();
          $('#map').removeClass('hideMap');
          // Shows map

          bounds = new google.maps.LatLngBounds();
          bounds.extend(markersLatLng[markersLatLng.length - 1]);
          bounds.extend(markersLatLng[endMarkerIndex]);
          map.fitBounds(bounds);
          // Zooms map to include just starting point and destination on un-hiding
        }
        $('#textDirections').hide();
        $('#textDirections').addClass('hideDirections');
      } // If trying to show map
      else {
        $('#map').hide();
        $('#map').addClass('hideMap');
        $('#textDirections').show();
        $('#textDirections').removeClass('hideDirections');
      } // If trying to show directions
    } // If window is too small to show map and directions side by side
  }, true); // Toggle Map or Directions placement on window resize

  $('#pagesButtons').on('click', 'button', function(event) {
    event.preventDefault();
    clearDirections();
    if (brewResults.length > 0) {
      currentPage = event.currentTarget.id.replace("brewPage", "");
      displayBrewResults(currentPage);
    }
  }); // Result page button navigation

  $('#resultsPerPage').on('change', function(event) {
    event.preventDefault();
    clearDirections();
    if (brewResults.length > 0) {
      displayBrewResults(1);
    }
  }); // Modify results per page

  $('#resultsText').on('click', 'div', function(event) {
    event.preventDefault();
    $('.toggleMapDir').addClass('hide');
    if (directions) { clearDirections(); }
    // Clear directions

    $('#endPoint').val(this.id);
    // Send Brewery name to textbox

    endMarkerIndex = $(this).index() + (currentPage - 1) * $('#resultsPerPage').val();
    // Save index of brewery clicked

    markers.forEach(function(m) { m.setMap(null); });
    // Hide all markers
    
    markers[$(this).index()].setMap(map);
    // Make only clicked marker showing

    $('#map').show();
    $('#map').removeClass('hideMap');
    map.setCenter(new google.maps.LatLng(brewResults[endMarkerIndex].latitude, brewResults[endMarkerIndex].longitude));
    map.setZoom(13);
    showMapOrDir = 'map';
    // Zoom in to brewery marker

    $('.startingPoint').removeClass('hide');
    $('#startingText, .labelDestination, #endPoint, .searchRoutes').removeAttr("tabindex");
    // Make route form accessible
  }); // Handles brewery results entry click
}

// Tools
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function sortByKey(array, key) {
  // Sort array of objects by key
  return array.sort(function(a, b) {
    let x = a[key]; 
    let y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
function formatPhoneNumber(phoneNumberString) {
  // Input:  1234567890 
  // Output: (123) 456-7890
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    let intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
function openFullscreen(elementId) {
  // Make an Element Fullscreen
  let elem = document.getElementById(elementId);

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

// Maps
function initMap(options){
  // Load map with parameters
  if (options == undefined) {
    options = {
      zoom:10,
      center:{lat:39.1031,lng:-84.5120}, // Cincinnati
      mapTypeId: 'terrain'
    } // Define on load location
  }

  map = new google.maps.Map(document.getElementById('map'), options);
  // Sends on load map to containing element

  let bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);
  // Display bike layer

  if (!directions) {
    displayBrewResults(1);
  } // Display on load or current search markers
}
async function createMarkers(min, max) {
  // Define all the properties of the marker
  markers.forEach(function(m) { m.setMap(null); });
  markers = [];
  // Remove old markers

  bounds = new google.maps.LatLngBounds();
  // Define the bounds variable for later map area resizing
  
  let noResults = false;
  let lat;
  let lng;
  let name;
  if (max == 0) { 
    max = 1; 
    noResults = true; 
  } // Handles no results to show city instead

  for (let x = min; x < max; x++){
    if (!noResults) {
      lat = parseFloat(brewResults[x].latitude);
      lng = parseFloat(brewResults[x].longitude);
      name = brewResults[x].name;
    } // Define properties of marker

    if (noResults || !brewResults[x].latitude) {
      let address;
      if (!noResults) { 
        address = (brewResults[x].street == "" ? "" : brewResults[x].street + ",") + brewResults[x].city + "," + brewResults[x].state + "," + brewResults[x].postal_code;
      } else {
        address = $('#cityText').val() + ($('#stateText').val() == "" ? "" : ", " + $('#stateText').val()) + ", United States";
      }
      address = address.replace(/ /g, '+');
      address = formatQueryParams({
        address:address
      });
      // Format address search

      let res = await fetch(geoUrl + geoKey + "&location=" + address);
      let data = await res.json();
      // Search

      lat = parseFloat(data.results[0].locations[0].latLng.lat);
      lng = parseFloat(data.results[0].locations[0].latLng.lng);
      brewResults[x].latitude = lat;
      brewResults[x].longitude = lng;
    } // If coordinates not provided then find coordinates by address search

    markersLatLng[x] = {lat:lat, lng:lng};
    bounds.extend({lat:lat, lng:lng});
    // Add the current marker to the overall bounds of the map

    if (!noResults) {
      let marker = {
        position:{lat:lat, lng:lng},
        content:'<h1>' + name + ' (' + brewResults[x].brewery_type.charAt(0).toUpperCase() + brewResults[x].brewery_type.slice(1)
        + ')</h1>',
        iconImage:'resources/' + brewResults[x].brewery_type + '.png',
        map:map
      };
      addMarker(marker);
    } // Add each marker
  }
  
  markers.forEach(function(m) { m.setMap(map); });
  map.fitBounds(bounds);
  if (map.getZoom() > 14) { map.setZoom(14); }
  // Fit the map to include all the markers
}
function addMarker(marker){
  // Add marker to object array and map
  let gMarker = new google.maps.Marker({
    position:marker.position,
    map:map,
    icon:marker.iconImage,
    animation:google.maps.Animation.DROP
  }); // Add Position and Animation

  markers.push(gMarker);

  if (marker.iconImage) {
    gMarker.setIcon(marker.iconImage);
  } // Add Icon

  if (marker.content) {
    gMarker.addListener('click', function(){
      if (infoWindow) { 
        infoWindow.close(); 
      } // Close open infoWindows

      infoWindow = new google.maps.InfoWindow({
        content:marker.content
      });
      infoWindow.open(map, gMarker);
      // Open current infoWindow
    });
  } // Add Content
}

// Spouts
async function getBrewSearchInfo() {
  let city = $('#cityText').val();
  let state = $('#stateText').val();
  let brewery = $('#breweryText').val();
  // Get the search criteria

  if (city == "" && state == "" && brewery == "") {
    $('.tip1').fadeOut('slow', function(){
      $('.tip1').delay(3000).fadeIn();
    });
    $('.tipError1').fadeIn('slow', function(){
      $('.tipError1').delay(3000).fadeOut();
    });
    return false;
  } else { clearDirections(); }
  // Asks for more information or prepares map for search

  if (state.length == 2) {
    state = state.toUpperCase();
    if (stateCode.includes(state)) {
      state = states[stateCode.indexOf(state)].toLowerCase();
      $('#stateText').val(state);
    }
  } // If a state abbreviation is used then change it to the full state name

  let search = (city == "" ? "" : "by_city=" + city + "&") + (state == "" ? "" : "by_state=" + state + "&") + (brewery == "" ? "" : "by_name=" + brewery + "&");
  search = search.replace(/ /g, '_');
  // Format the search

  brewResults = [];
  brewResults = await brewSearch(beerUrl + search);
  // Reset results and search
 
  displayBrewResults(1);
  // Display results
}
async function brewSearch(search) {
  let page = 0;
  let currentLength = 0;
  do {
    page++;
    let res = await fetch(search + "page=" + page + "&per_page=50");
    let data = await res.json();
    brewResults = brewResults.concat(data);
    currentLength = data.length;
  } while (currentLength == 50);
  // Gather results from all searches into an array

  brewResults = sortByKey(brewResults, "name");
  // Sort results

  return brewResults;
}
function displayBrewResults(page) {
  document.getElementById("numberOfResults").innerHTML = brewResults.length + " Results Found";
  // Display number of results found

  let pages = Math.ceil(brewResults.length / $('#resultsPerPage').val());
  let pagesHTML = "";
  for (let x = 1; x <= pages; x++) {
    pagesHTML += `<button id="brewPage${x}" class="brewPageButton"><label>${x}</label></button>`;
  }
  if (brewResults.length <= parseInt($('#resultsPerPage').val(), 10)) { pagesHTML = ''; }
  document.getElementById("pagesButtons").innerHTML = pagesHTML;
  // Create page buttons to display results

  let min = $('#resultsPerPage').val() * (page - 1);
  let max = brewResults.length < $('#resultsPerPage').val() * page ? brewResults.length : $('#resultsPerPage').val() * page;
  // Define the array indices to display for the desired page

  let resultText = "";
  for (let x = min; x < max; x++) {
    let name = brewResults[x].name;
    let brewery_type = brewResults[x].brewery_type == "" ? "" : " (" + brewResults[x].brewery_type.charAt(0).toUpperCase() + brewResults[x].brewery_type.slice(1) + ")";
    let address = brewResults[x].street.length == 0 ? "Not Provided" : brewResults[x].street + " " + brewResults[x].city + ", " + brewResults[x].state + " " + brewResults[x].postal_code;
    let phone = brewResults[x].phone == "" ? "Not Provided" : formatPhoneNumber(brewResults[x].phone);
    let website = brewResults[x].website_url == "" ? "Not Provided" : brewResults[x].website_url;
    // Pull data from API result into variables
    
    resultText += `
    <div class="entry ${x}" id="${name}" >
      <h1>Brewery: ${name}${brewery_type} </h1>
      <h2>Address: ${address}</h2>
      <h2>Phone: ${phone}</h2>
      <h2>Website: ${website}</h2>
    </div>
    ` // Format data
  }
  document.getElementById("resultsText").innerHTML = resultText;
  // Display data in text form

  createMarkers(min, max);
  // Add markers to the map for the current page
}

// Routes
async function getRoutePoints() {
  let whichRoute = '';
  if ($('#startingText').val() == "") {
    $('.tipError2').fadeIn('slow', function(){
      $('.tipError2').delay(3000).fadeOut();
    });
    return false;
  } else { 
    clearDirections(); 
  }
  directions = true;
  // Asks for more information or prepares map for search

  let origin = encodeURIComponent($('#startingText').val());
  let res = await fetch(geoUrl + geoKey + "&location=" + origin);
  let data = await res.json();
  let lat = parseFloat(data.results[0].locations[0].latLng.lat);
  let lng = parseFloat(data.results[0].locations[0].latLng.lng);
  origin = lat + ',' + lng;
  markersLatLng.push({lat:lat, lng:lng});
  // Get origin lat and lng

  let image = "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png&text=A&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1";
  let marker = new google.maps.Marker({
    position:{lat:lat, lng:lng},
    content:'<h1>' + $('#startingText').val() + '</h1>',
    map:map,
    icon:image,
    animation:google.maps.Animation.DROP
  });
  markers.push(marker);
  marker.addListener('click', function(){
    if (infoWindow) { infoWindow.close(); }
    infoWindow = new google.maps.InfoWindow({
      content:marker.content
    });
    infoWindow.open(map, marker);
  });
  // Create marker for origin
  
  let destination = brewResults[endMarkerIndex].latitude + ',' + brewResults[endMarkerIndex].longitude;
  // Define destination by lat and lng

  routeSearchAndDisplay(origin, destination);
  // Call search
}
function routeSearchAndDisplay(origin, destination) {
  // Display map route and text directions
  let directionsService = new google.maps.DirectionsService;
  let directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('textDirections'));
  // Define where the response will be displayed

  directionsService.route({
    origin:origin,
    destination:destination,
    travelMode:'BICYCLING',
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      directionsDisplay.setOptions({
        suppressMarkers:true,
      });
      // Show route with no markers

      const mq = window.matchMedia("(max-width: 599px)");
      if (mq.matches) {
        $('#map').addClass('hideMap');
        $('#map').hide();
        showMapOrDir = 'dir';
        $('.toggleMapDir').removeClass('hide');
        $('.toggleMapDir').removeAttr("tabindex");
      } // If screen not wide enough to show directions and map then hide map

      $('#textDirections').removeClass('hideDirections');
      $('#textDirections').show();
      // Show directions
    } else {
      if (status == 'ZERO_RESULTS') {
        directions = false;
        $('.tipError3').fadeIn('slow', function(){
          $('.tipError3').delay(3000).fadeOut();
        });
        return false;
      }
    }
  }); // Get route and directions
}
function clearDirections() {
  // Clears previous directions on map and text directions
  showMapOrDir = 'map';
  $('.toggleMapDir').attr('tabindex', '-1');
  if (!directions) { return false; }
  options = {
    zoom:map.zoom,
    center:map.center,
    mapTypeId:map.mapTypeId
  }
  map = new google.maps.Map(document.getElementById('map'), options);
  let bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);
  // Resets map to current location and zoom without blue route line

  let markerIndex = endMarkerIndex % $('#resultsPerPage').val();
  markers[markerIndex].content = '<h1>' + brewResults[endMarkerIndex].name + '</h1>';
  markers[markerIndex].iconImage = 'resources/' + brewResults[endMarkerIndex].brewery_type + '.png';
  addMarker(markers[markerIndex]);
  // Add marker to destination

  $('#textDirections').html('');
  // Clears text directions

  $('#textDirections').addClass('hideDirections');
  $('#textDirections').hide();
  $('#map').removeClass('hideMap');
  // Make map full screen width

  directions = false;
}

// Initial Setup
function initialSetup() {
  $(`.start2`).hide();
  $('.tipError').hide();
  $('.key').hide();
  define();
  addListeners();
  initMap();
  loadSplashPage();

  let year = new Date().getFullYear();
  $('.copy').html(`&copy ${year} Patrick Quilty`);
  // Also updates copyright year
}
function loadSplashPage() {
  // Fade everything else to the back and show the splash page

  $('.mapDir, .searchContainer, .instructions, .breweryResults, #resultsText, .credits').addClass('showSplash no_select');
  document.body.style.overflow = 'hidden';
  $('body').show();
  // Show only splash page
  
  if (window.innerWidth / window.innerHeight > .75) {
    $('.logo').addClass('center');
  } else {
    $('.logo').addClass('stretch');
  } // Stretch or center based on window ratio on load

  window.addEventListener('resize', function(){
    if (window.innerWidth / window.innerHeight > .75) {
      $('.logo').addClass('center');
      $('.logo').removeClass('stretch');
    } else {
      $('.logo').addClass('stretch');
      $('.logo').removeClass('center');
    }
  }); // Stretch or center based on window ratio after resize
}
function hideSplashPage() {
  // Hide splash page and begin program
  $('.splashPage').fadeOut(500);
  $('.mapDir, .searchContainer, .instructions, .breweryResults, #resultsText, .credits').removeClass('showSplash no_select');
  $('.mapDir, .searchContainer, .instructions, .breweryResults, #resultsText, .credits').hide();
  $('.mapDir, .searchContainer, .instructions, .breweryResults, #resultsText, .credits').fadeIn(500);
  document.body.style.overflow = 'visible';
  $('#mapDir, #map, #textDirections, .searchContainer, .searchForm, #cityText, #stateText, #breweryText, .searchSpouts, .otherControls, .fullscreen, .showKey, .breweryResults, #showResults, #resultsPerPage, #pagesButtons, #resultsText').removeAttr('tabindex');
  // Undo everything the splash page did and let the program be runnable
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('#map').length > 0)
  {
    if (document.querySelector('html').lang) {
      lang = document.querySelector('html').lang;
    } else {
      lang = 'en';
    }

    let js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = `https://maps.googleapis.com/maps/api/js?callback=initialSetup&key=${googleKey}&language=` + lang;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
}); // Load initial setup after everything else is loaded for the correct order of map display
