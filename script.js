let map; // The google map
let savedMap; // The map specs before directions are requested
let bounds; // Google variable for the area to show on the map
let infoWindow = null; // Google variable for the popup info on a clicked map marker
let markers = []; // Google formated markers for each brewery result index
let markersLatLng = []; // Just the Lat and Lng for each marker for easier access
let endMarkerIndex = -1; // The marker index for the destination
let currentPage = 1; // The current page of the brewery results display
let directions = false; // Whether or not there are directions saved currently
let showMapOrDir = 'map'; // Which is showing the map or the directions
let clearing = false; // Used while clearing the directions
let brewResults = []; // The results of the brewery api search
let originalHeight = 0; // For tiling the brewery results entries
const googleKey = import.meta.env.VITE_GOOGLE_KEY;;
const beerUrl = 'https://api.openbrewerydb.org/breweries?';
const geoUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=';
const geoKey = import.meta.env.VITE_GEO_KEY;

// Listeners
function addListeners() {
  goButtonClick();
  brewerySearchButtonClick();
  routeSearchButtonClick();
  toggleMapDirButtonClick();
  fullscreenButtonClick();
  showMapKeyButtonClick();
  hideMapKeyArrowImageClick();
  handleMapDirOnWindowResize();
  pageButtonNavigation();
  resultsPerPageChange();
  breweryResultsLinkClick();
  breweryResultsEntryClick();
}
function goButtonClick() {
  $('.go').on('click', function() {
    event.preventDefault();
    hideSplashPage();
    loadRowsOrTiles();
  });
}
function brewerySearchButtonClick() {
  $('.searchSpouts').on('click', function() {
    event.preventDefault();
    getBrewSearchInfo();
  });
}
function routeSearchButtonClick() {
  $('.searchRoutes').on('click', function() {
    event.preventDefault();
    getRoutePoints();
  });
}
function toggleMapDirButtonClick() {
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
  });
}
function fullscreenButtonClick() {
  $('.fullscreen').on('click', function() {
    event.preventDefault();
    openFullscreen("mapDir");
  })
}
function showMapKeyButtonClick() {
  $('.showKey').on('click', function() {
    event.preventDefault();
    if ($('.key').html() == '') {
      let keyArray = [
        ['micro', 'scooter icon', 'Micro', '< 15,000 barrels / year'],
        ['regional', 'truck icon', 'Regional', '> 15,000 and < 6,000,000 barrels / year'],
        ['large', 'boat icon', 'Large', '> 6,000,000 barrels / year'],
        ['brewpub', 'beer and burger icon', 'Brewpub', 'They serve their own beer and food too'],
        ['taproom', 'beer tap icon', 'Taproom', 'They serve their own beer, but no emphasis on food'],
        ['contract', 'contract icon', 'Contract', 'Brewery hired to produce specific beer'],
        ['proprietor', 'duplex icon', 'Proprietor', 'Shared brewery'],
        ['bar', 'billiards icon', 'Bar', 'Bar that brews their own beer'],
        ['planning', 'schematics icon', 'Planning', 'Brewery in planning'],
        ['bikeTrail', 'solid dark green line', 'Route', 'Trails'],
        ['bikeDedicated', 'solid light green line', 'Route', 'Dedicated lanes'],
        ['bikeFriendly', 'dotted green line', 'Route', 'Bike friendly roads']
      ];
      let keyHTML = '';
      for (let x = 0; x <= 11; x++) {
        keyHTML += `
        <div class='keyRow'>
          <img class='keyIcon' src='` + keyArray[x][0] + `.png' alt='` + keyArray[x][1] + `'>
          <p class='keySegment'>` + keyArray[x][2] + `</p>
          <p class='keyDescription'>` + keyArray[x][3] + `</p>
        </div>`;
      } // Create key

      keyHTML += `
      <img class='slideUp' src='slideUp.png' alt='slide up arrow image button'>
      `; // Add slide up button

      $('.key').hide();
      $('.key').html(keyHTML);
      $('.slideUp').hide();
      $('.key').slideDown(1000, function(){
        $('.slideUp').show();
        loadRowsOrTiles();
      });
    } else {
      $(".slideUp").click();
    }
  })
}
function hideMapKeyArrowImageClick() {
  $(document).on('click', '.slideUp',function(){
    event.preventDefault();
    $('.slideUp').hide();
    $('.key').slideUp(1000, function(){
      $('.key').delay().html('');
      loadRowsOrTiles();
    });
  })
}
function handleMapDirOnWindowResize() {
  window.addEventListener('resize', function(){
    loadRowsOrTiles();
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
    } // If window is too small then show map and directions side by side
  }, true);
}
function pageButtonNavigation() {
  $('#pagesButtons').on('click', 'button', function(event) {
    event.preventDefault();
    if (!clearing) { clearDirections(); }
    $('#endPoint').val('');
    if (brewResults.length > 0) {
      currentPage = event.currentTarget.id.replace('brewPage', '');
      displayBrewResults();
    }
  });
}
function resultsPerPageChange() {
  $('#resultsPerPage').on('change', function(event) {
    event.preventDefault();
    clearDirections();
    $('#endPoint').val('');
    if (brewResults.length > 0) {
      currentPage = 1
      displayBrewResults();
    }
  });
}
function breweryResultsLinkClick() {
  $('#resultsText').on('click', 'a', function(event) {
    event.preventDefault();
    window.open($(this).html(),'_blank');
  });
}
function breweryResultsEntryClick() {
  $('#resultsText').on('click', 'div', async function(event) {
    event.preventDefault();
    let markerIndex = $(this).index();
    let chill = await clearDirections();
    google.maps.event.trigger(markers[markerIndex], 'click');
    // Clear directions and call marker click event
  });
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
    getBrewSearchInfo();
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
        address = ($('#cityText').val() == "" ? "" : $('#cityText').val()) + ($('#stateText').val() == "" ? "" : ", " + $('#stateText').val()) + ", United States";
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
      if (noResults) {
        bounds.extend({lat:lat, lng:lng});
        map.fitBounds(bounds);
        map.setZoom(11);
        return;
      } // Show city coordinates if no brewery results

      brewResults[x].latitude = lat;
      brewResults[x].longitude = lng;
    } // If coordinates not provided then set coordinates by address search

    markersLatLng[x] = {lat:lat,lng:lng};
    bounds.extend({lat:lat, lng:lng});
    // Add the current marker to the overall bounds of the map
    
    if (!noResults) {
      let marker = {
        position: { lat: lat, lng: lng },
        content: '<h1>' + name + ' (' + brewResults[x].brewery_type.charAt(0).toUpperCase() + brewResults[x].brewery_type.slice(1)
        + ')</h1>',
        iconImage: brewResults[x].brewery_type + '.png',
        map: map,
        label: x
      };
      addMarker(marker);
    } // Add each marker
  }
  
  markers.forEach(function(m) { m.setMap(map); });
  map.fitBounds(bounds);
  if (map.getZoom() > 14) { map.setZoom(14); }
  // Fit the map to include all the markers
  return true;
}
function addMarker(marker){
  // Add marker to object array and map
  let gMarker = new google.maps.Marker({
    position:marker.position,
    map:map,
    icon:marker.iconImage,
    animation:google.maps.Animation.DROP
  }); // Add position and animation

  markers.push(gMarker);

  if (marker.iconImage) {
    gMarker.setIcon(marker.iconImage);
  } // Add icon

  if (marker.content) {
    gMarker.addListener('click', function(){
      if (infoWindow) { infoWindow.close(); } // Close any open infoWindows
      
      infoWindow = new google.maps.InfoWindow({ content:marker.content });
      infoWindow.open(map, gMarker);
      // Open current marker infoWindow

      $('#endPoint').val(marker.content.slice(4, marker.content.indexOf('(') - 1));
      // Print brewery name from marker content

      endMarkerIndex = marker.label;
      // Save index of brewery clicked
      
      $('.toggleMapDir').addClass('hide');
      $('.startingPoint').removeClass('hide');
      $('#startingText, .labelDestination, #endPoint, .searchRoutes').removeAttr("tabindex");
      // Make route form accessible
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
    $('.tipError1').fadeIn('slow', function(){
      $('.tipError1').delay(3000).fadeOut();
    });
    return false;
  } else { 
    clearDirections();
    $('#endPoint').val('');
  }
  // Asks for more information or prepares map for search

  if (state.length == 2) {
    state = state.toUpperCase();
    let states = [
      "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING"
    ];
    let stateCode = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];
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
 
  currentPage = 1
  displayBrewResults();
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
async function displayBrewResults() {
  document.getElementById("numberOfResults").innerHTML = brewResults.length + " Results Found";
  // Display number of results found

  let pages = Math.ceil(brewResults.length / $('#resultsPerPage').val());
  let pagesHTML = "";
  for (let x = 1; x <= pages; x++) {
    let highlight = x == currentPage ? ' highlight' : '';
    pagesHTML += `<button id="brewPage${x}" class="brewPageButton${highlight}"><label>${x}</label></button>`;
  }
  if (brewResults.length <= parseInt($('#resultsPerPage').val(), 10)) {
    $('#pagesButtons').hide();
  } else {
    $('#pagesButtons').show();
  }
  document.getElementById("pagesButtons").innerHTML = pagesHTML;
  // Create page buttons to display results

  let min = $('#resultsPerPage').val() * (currentPage - 1);
  let max = brewResults.length < $('#resultsPerPage').val() * currentPage ? brewResults.length : $('#resultsPerPage').val() * currentPage;
  // Define the array indices to display for the desired page

  let resultText = "";
  for (let x = min; x < max; x++) {
    let name = brewResults[x].name;
    let brewery_type = brewResults[x].brewery_type == "" ? "" : " (" + brewResults[x].brewery_type.charAt(0).toUpperCase() + brewResults[x].brewery_type.slice(1) + ")";
    let address = brewResults[x].street ? brewResults[x].street + " " + brewResults[x].city + ", " + brewResults[x].state + " " + brewResults[x].postal_code : "Not Provided";
    let phone = brewResults[x].phone == "" ? "Not Provided" : formatPhoneNumber(brewResults[x].phone);
    let website = brewResults[x].website_url == "" ? "Not Provided" : 
    "<a href=" + brewResults[x].website_url + ">" + brewResults[x].website_url + "</a>";
    // Pull data from API result into variables

    resultText += `<div class="entry ${x} tileEntry" id="${name}" >
      <h1>${name}${brewery_type}</h1>
      <h2>Address: ${address}</h2>
      <h2>Phone: ${phone}</h2>
      <h2>Website: ${website}</h2>
    </div>` // Format data
  }
  document.getElementById("resultsText").innerHTML = resultText;
  if (originalHeight == 0) { originalHeight = $('.entry').height(); }
  loadRowsOrTiles();
  // Display data in text form in tiles or rows

  $('*').addClass('wait');
  let chill = await createMarkers(min, max);
  createMarkers(min, max);
  $('*').removeClass('wait');
  // Add markers to the map for the current page, but wait until they are all loaded so clicking will call them by the right index
}
function loadRowsOrTiles() {
  // Make brewery entries into inline tiles or just rows
  const mq = window.matchMedia("(min-width: 500px)");
  if (mq.matches) {
    let entriesPerRow = Math.floor($('body').width() / 175);
    $('.entry').width(($('body').width() / entriesPerRow) - 2);
    // Normalize width

    let min = $('#resultsPerPage').val() * (currentPage - 1);
    let max = brewResults.length < $('#resultsPerPage').val() * currentPage ? brewResults.length : $('#resultsPerPage').val() * currentPage;
    let maxHeight = 0;
    $('.entry').height('unset');
    for (let x = min; x < max; x++) {
      if ($('.entry.' + x).height() > maxHeight) { maxHeight = $('.entry.' + x).height(); }
    }
    $('.entry').height(maxHeight);
    // Normalize height

    $('.entry').removeClass('evenOdd');
    if (entriesPerRow % 2 == 0) {
      for (let x = min; x < max; x++) {
        if (Math.floor(x / entriesPerRow) % 2 == 0) {
          if (x % 2 == 1) { $('.entry.' + x).addClass('evenOdd'); }
        } else {
          if (x % 2 != 1) { $('.entry.' + x).addClass('evenOdd'); }
        }
      }
    } else {
      for (let x = min; x < max; x++) {
        if (x % 2 == 1) {
          $('.entry.' + x).addClass('evenOdd');
        }
      }
    }
    // Repaint entries to alternate
  } else {
    $('.entry').removeClass('even1, even2, odd');
    // Repaint entries to alternate

    if ($('.entry').height() > originalHeight) { 
      $('.entry').height(originalHeight);
      $('.entry').height('unset'); 
    }
    $('.entry').width($('body').width() - 2);
    // Reset original height and width
  }
}

// Routes
async function getRoutePoints() {
  let whichRoute = '';
  if ($('#startingText').val() == "") {
    $('.showKey').css('z-index', '0');
    $('.tipError2').fadeIn('slow', function(){
      $('.tipError2').delay(3000).fadeOut();
    });
    return false;
  } else { 
    savedMap = {
      zoom:map.zoom,
      center:map.center,
      mapTypeId:map.mapTypeId
    };
    clearDirections();
    infoWindow.close();
    markers.forEach(function(m) { m.setMap(null); });
    // Hide all markers
    
    markers[endMarkerIndex - (currentPage - 1) * $('#resultsPerPage').val()].setMap(map);
    // Make only clicked marker showing
  }
  directions = true;
  // Asks for more information or prepares map for search

  let origin = encodeURIComponent($('#startingText').val());
  let res = await fetch(geoUrl + geoKey + "&location=" + origin);
  let data = await res.json();
  let lat = parseFloat(data.results[0].locations[0].latLng.lat);
  let lng = parseFloat(data.results[0].locations[0].latLng.lng);
  origin = lat + ',' + lng;
  markersLatLng.push({lat:lat,lng:lng});
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
        $('.showKey').css('z-index', '0');
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
  $('#map').show();
  $('#map').removeClass('hideMap');
  showMapOrDir = 'map';
  $('.toggleMapDir').addClass('hide');
  $('.toggleMapDir').attr('tabindex', '-1');
  if (!directions) { return false; }
  map = new google.maps.Map(document.getElementById('map'), savedMap);
  let bikeLayer = new google.maps.BicyclingLayer();
  bikeLayer.setMap(map);
  // Resets map to current location and zoom without blue route line

  clearing = true;
  $('#brewPage' + currentPage).click();
  clearing = false;
  // Reload current results page

  $('#textDirections').html('');
  // Clears text directions

  $('#textDirections').addClass('hideDirections');
  $('#textDirections').hide();
  $('#map').removeClass('hideMap');
  // Make map full screen width

  directions = false;
  return true;
}

// Initial Setup
window.initialSetup = () => {
  $('.tipError').hide();
  $('.key').hide();
  addListeners();
  initMap();
  $('#cityText').val('');
  loadSplashPage();
};
function loadSplashPage() {
  // Fade everything else to the back and show the splash page
  $(window).on('beforeunload', function() {
    $('body').hide();
    $(window).scrollTop(0);
  });
  // Scroll to top of page

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
  if (document.querySelectorAll('#map').length > 0) {
    const lang = document.querySelector('html').lang || 'en';
    let js_file = document.createElement('script');
    js_file.type = 'text/javascript';
    js_file.src = `https://maps.googleapis.com/maps/api/js?callback=initialSetup&key=${googleKey}&language=${lang}&loading=async`;
    document.getElementsByTagName('head')[0].appendChild(js_file);
  }
}); // Load initial setup after everything else is loaded for the correct order of map display

const originalConsoleWarn = console.warn;
console.warn = function (message) {
  if (message.includes('As of February 21st, 2024, google.maps.Marker is deprecated.')) return;
  originalConsoleWarn.apply(console, arguments);
}; // Hide marker warning
