
// Medium:
// bike layer key: Dark green routes indicated dedicated bicycle routes. Light green routes indicate streets with dedicated “bike lanes.” Dashed routes indicate streets or paths otherwise recommended for bicycle usage.
// alt bike layer key? Solid Dark Green lines are for bike trails, Solid Light Green lines are for Dedicated Lanes, Dotted Green lines are for bicycle friendly roads or bike routes and Dark Red or Brown lines are for dirt/unpaved trails.
// logo design: bike lane symbol and bar symbol or tap Handle
// Change marker click info maybe
// Set marker image to match the type of brewery it is making sure that the default red waterdrop is not used for any of them, include a key
// Seperate data from code by putting data in .json file.  Do this in sudoku too
// Zoom map bounds tighter after bounds defined
// Add checkboxes to brewery text results area to include item as marker on map or not, default is checked

// Low:
// Upon finding a route with a brewery, I want to be allowed to trim the route to their desired length
// Multiple starting locations for friends to meet up at the brewery
// Create a printable / email-able itinerary
// As a returning user I want to be able to access saved routes
// As an admin I want to be able to gather users saved routes into a list to offer to users as a suggestion


let currentPage = 1;
let endMarkerIndex = -1;
let map;
let markers = [];
let markersInfo = [];
let bounds;
let infoWindow = null;
let directions = false;
let brewResults;
let routeResults;
let states;
let stateCode;
let googleKey = 'AIzaSyAIWwZQ6TOKQzmvnZPY4hMEoF3eBdAGckU';
let beerUrl = 'https://api.openbrewerydb.org/breweries?';
let geoUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=';
let geoKey = 'tAgL4sSNSMqpOGN4SQc8hISAmqpRroMi';
function define() {
  // Sample and reference data
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
  $('.searchSpouts').on('click', function() {
    event.preventDefault();
    $('.startingPoints').slideUp();
    getBrewSearchInfo();
  }); // Brewery search button

  $('.searchRoutes').on('click', function() {
    event.preventDefault();
    getRoutePoints();
  }); // Route search button

  $('.toggleTextDir').on('click', function() {
    event.preventDefault();
    $('#map').toggle();
    $('#textDirections').toggle();
  }); // Toggle Map vs Text Directions visibility

  window.addEventListener('resize', function(){
    const mq = window.matchMedia("(min-width: 600px)");
    if (mq.matches) {
      $('#map').show();
      $('#textDirections').show();
    } else {
      $('#map').show();
      $('#textDirections').hide();
    }
  }, true); // Toggle Map vs Text Directions placement on window resize

  $('#pagesButtons').on('click', 'button', function(event) {
    event.preventDefault();
    $('.searchForm').slideDown();
    $('.startingPoints').slideUp();
    $('#breweryText').val('');
    clearDirections();
    if (brewResults.length > 0) {
      currentPage = event.currentTarget.id.replace("brewPage", "");
      displayBrewResults(currentPage);
    }
  }); // Result page button navigation

  $('#resultsPerPage').on('change', function(event) {
    event.preventDefault();
    $('.searchForm').slideDown();
    $('.startingPoints').slideUp();
    $('#breweryText').val('');
    clearDirections();
    if (brewResults.length > 0) {
      displayBrewResults(1);
    }
  }); // Modify results per page

  $('.slideFriend').on('click', function(event) {
    let friendHTML = '';
    let latest = 5;
    let noMore = $(`.start5`).length == 0 ? false : true;
    for (let x = 2; x <= 5; x++) {
      if ($(`.start${x - 1}`).length != 0) {
        friendHTML += `
        <div class="friendBox friendBox${x}">
          <input type="text" placeholder="Friend" class="friendName">
          <label for="starting${x}Text" class="start${x}">'s Starting Point
            <input type="text" id="starting${x}Text">
          </label>
        </div>
        `;
      } else {
        latest = x - 1;
        x = 5;
      }
    }
    document.getElementById("otherPoints").innerHTML = friendHTML;
    $(`.friendName`).width(84);

    if (!noMore) {
      $(`.friendBox${latest}`).hide();
      $(`.friendBox${latest}`).slideDown(300);
    }
  }); // Add up to 5 starting points

  $('#resultsText').on('click', 'div', function(event) {
    event.preventDefault();
    if (directions) { clearDirections(); }
    // Clear directions

    $('#breweryText').val(this.id);
    // Send Brewery name to textbox

    endMarkerIndex = $(this).index() + (currentPage - 1) * $('#resultsPerPage').val();
    // Save index of brewery clicked

    markers.forEach(function(m) { m.setMap(null); });
    // Hide all markers
    
    markers[$(this).index()].setMap(map);
    // Make only clicked marker showing

    map.setCenter(new google.maps.LatLng(brewResults[endMarkerIndex].latitude, brewResults[endMarkerIndex].longitude));
    map.setZoom(13);
    // Zoom in to brewery marker

    $('.startingPoints').slideDown();
    // Show route search box

    $('.searchForm').slideUp();
    // Hide brewery search box
  }); // Handles brewery results entry click

  $('.backToSpouts').on('click', function(event) {
    $('.searchForm').slideDown();
    $('.startingPoints').slideUp();
  }); // Return to brew search
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
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
  
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
  } // Display on load markers
}
async function createMarkers(min, max) {
  // Define all the properties of the marker
  markers.forEach(function(m) { m.setMap(null); });
  markers = [];
  markersInfo = [];
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

    bounds.extend({lat:lat, lng:lng});
    // Add the current marker to the overall bounds of the map

    if (!noResults) {
      let marker = {
        position:{lat:lat, lng:lng},
        content:'<h1>' + name + '</h1>',
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
  if (pages == 0) { pages = 1; }
  for (let x = 1; x <= pages; x++) {
    pagesHTML += `<button id="brewPage${x}" class="brewPageButton"><label>${x}</label></button>`;
  }
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
  if ($('#starting1Text').val() == "") {
    $('.tipError2').fadeIn('slow', function(){
      $('.tipError2').delay(3000).fadeOut();
    });
    return false;
  } else { clearDirections(); }
  // Asks for more information or prepares map for search
  directions = true;

  let origin = encodeURIComponent($('#starting1Text').val());
  let res = await fetch(geoUrl + geoKey + "&location=" + origin);
  let data = await res.json();
  let lat = parseFloat(data.results[0].locations[0].latLng.lat);
  let lng = parseFloat(data.results[0].locations[0].latLng.lng);
  origin = lat + ',' + lng;
  // Get origin lat and lng

  let image = "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png&text=A&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1";
  let marker = new google.maps.Marker({
    position:{lat:lat, lng:lng},
    content:'<h1>' + $('#starting1Text').val() + '</h1>',
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
  // Add marker to origin
  
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
  directionsService.route({
    origin:origin,
    destination:destination,
    travelMode:'BICYCLING',
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      directionsDisplay.setOptions({
          suppressMarkers: true
      });
    } else {
      alert('Directions request failed due to ' + status);
    }
  });
}
function clearDirections() {
  // Clears previous directions on map and text directions

  if (!directions) { return false; }
  options = {
    zoom:map.zoom,
    center:map.center,
    mapTypeId:map.mapTypeId
  }
  map = new google.maps.Map(document.getElementById('map'), options);
  let bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);
  // Resets map to current location without and zoom without blue route line

  let markerIndex = endMarkerIndex % $('#resultsPerPage').val();
  markers[markerIndex].content = '<h1>' + brewResults[endMarkerIndex].name + '</h1>';
  addMarker(markers[markerIndex]);
  // Add marker to destination

  $('#textDirections').html('');
  // Clears text directions

  directions = false;
}

// Initial Setup
function initialSetup() {
  $(`.start2`).hide();
  $('.tipError').hide();
  define();
  addListeners();
  initMap();
  displayBrewResults(1); // Display sample data
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
