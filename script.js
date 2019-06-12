let map;
let markers;
let beerUrl = 'https://api.openbrewerydb.org/breweries?';
// let gKey = 'AIzaSyCxRTj3E88U1sjsPZ3Z4Lk5aWb0NxWu5d8';
let geoUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=';
let geoKey = 'tAgL4sSNSMqpOGN4SQc8hISAmqpRroMi';
let beerResults = [];

const states = [
  "ALABAMA", "ALASKA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "FLORIDA", "GEORGIA", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEW HAMPSHIRE", "NEW JERSEY", "NEW MEXICO", "NEW YORK", "NORTH CAROLINA", "NORTH DAKOTA", "OHIO", "OKLAHOMA", "OREGON", "PENNSYLVANIA", "RHODE ISLAND", "SOUTH CAROLINA", "SOUTH DAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINIA", "WASHINGTON", "WEST VIRGINIA", "WISCONSIN", "WYOMING"
];

const stateCode = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// Maps
function initMap(){
  // let options = {
  //   zoom:10,
  //   center:{lat:39.1031,lng:-84.5120}
  // } // Set Location

  // map = new google.maps.Map(document.getElementById('map'), options);
  // // Display Map at Location

  // let bikeLayer = new google.maps.BicyclingLayer();
  // bikeLayer.setMap(map);
  // // Display Bike Layer
}
function addMarker(props){
  // let marker = new google.maps.Marker({
  //   position:props.coords,
  //   map:map
  // }); // Add Position

  // if (props.iconImage) {
  //   marker.setIcon(props.iconImage);
  // } // Add Icon

  // if (props.content) {
  //   let infoWindow = new google.maps.InfoWindow({
  //     content:props.content
  //   });

  //   marker.addListener('click', function(){
  //     infoWindow.open(map, marker);
  //   });
  // } // Add Content
}

// Beer
function formatQueryParams(params) {
  // const queryItems = Object.keys(params)
  //   .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  // return queryItems.join('&');
}
function getBeers(path) {
  path = 'breweries?by_city=cincinnati&page=1&per_page=10';
  
  fetch(beerUrl + path) 
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}
function displayResults(responseJson) {
  for (let x = 0; x < responseJson.length; x++){
    let lat;
    let lng;
    let name = responseJson[x].name;
    if (!responseJson[x].latitude) {
      let address = (responseJson[x].street == "" ? "" : responseJson[x].street + ",") + responseJson[x].city + "," + responseJson[x].state + "," + responseJson[x].postal_code;
      address = address.replace(/ /g, '+');
      address = formatQueryParams({
        address:address
      });

      fetch(geoUrl + geoKey + "&location=" + address) 
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => {
        lat = parseFloat(responseJson.results[0].locations[0].latLng.lat);
        lng = parseFloat(responseJson.results[0].locations[0].latLng.lng);

        console.log("coords", name, lat, lng);
        addMarker({
          coords:{lat:lat,lng:lng},
          content:'<h1>' + name + '</h1>'
        });
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
    } else {
      lat = parseFloat(responseJson[x].latitude)
      lng = parseFloat(responseJson[x].longitude)

      console.log("coords", name, lat, lng);
      addMarker({
        coords:{lat:lat,lng:lng},
        content:'<h1>' + name + '</h1>'
      });
    }
  }
}



function addListeners() {
  $('.brewerySearchForm').on('submit', function() {
    event.preventDefault();
    searchForBreweries();
  });

  $('#pagesButtons').on('click', 'button', function(event) {
    event.preventDefault();
    if (beerResults.length > 0) {
      let page = event.currentTarget.id.replace("brewPage", "");
      displayResultText(page);
    }
  });

  $('#resultsPerPage').on('change', function(event) {
    event.preventDefault();
    if (beerResults.length > 0) {
      displayResultText(1);
    }
    // redraw buttons
    // stop adding more paranthesis to brew type
  });

}

async function searchForBreweries() {
  let city = $('#cityText').val();
  let state = $('#stateText').val();
  let brewery = $('#breweryText').val();
  // Get the search criteria

  if (state.length == 2) {
    state = state.toUpperCase();
    if (stateCode.includes(state)) {
      state = states[stateCode.indexOf(state)].toLowerCase();
      $('.stateText').val(state);
    }
  } // If a state abbreviation is used then change it to the full state name

  let search = (city == "" ? "" : "by_city=" + city + "&") + (state == "" ? "" : "by_state=" + state + "&") + (brewery == "" ? "" : "by_name=" + brewery + "&");
  search = search.replace(/ /g, '_');
  // Format the search

  beerResults = [];
  beerResults = await getAllBeerResults(beerUrl + search);
  // Reset results and search
 {
  if (beerResults.length == 0)
    console.log("No results for current search found.");
  }

  let pages = Math.ceil(beerResults.length / $('#resultsPerPage').val());
  let pagesHTML = "";
  for (let x = 1; x <= pages; x++) {
    pagesHTML += `<button id="brewPage${x}"><label>${x}</label></button>`;
  }
  document.getElementById("pagesButtons").innerHTML = pagesHTML;
  // Create page buttons to display results

  displayResultText(1);

  






  // On results per page value change reload text output area from the data already gathered, don't re-fetch


  // Load initial cincinnati splash page from a saved text response rather than make a call on load

  // Name methods better

  // Handles results with "Brewery in Planning" better

  // organize html less divs

  // Handle more pages than can fit in a long line.  what if 40 pages




}

async function getAllBeerResults(search) {
  let page = 1;
  let currentLength = 0;
  do {
    const res = await fetch(search + "page=" + page + "&per_page=50");
    let data = await res.json();
    beerResults = beerResults.concat(data);
    currentLength = data.length;
    page++;
  } while (currentLength == 50);
  return beerResults;
}

function displayResultText(page) {


  let max = beerResults.length < $('#resultsPerPage').val() * page ? beerResults.length : $('#resultsPerPage').val() * page;

  let resultText = "";
  for (let x = $('#resultsPerPage').val() * (page - 1); x < max; x++) {

    let name = beerResults[x].name;
    let brewery_type = beerResults[x].brewery_type = "" ? "" : " (" + beerResults[x].brewery_type.charAt(0).toUpperCase() + beerResults[x].brewery_type.slice(1) + ")";
    let address = beerResults[x].street.length == 0 ? "N/A" : beerResults[x].street + " " + beerResults[x].city + ", " + beerResults[x].state + " " + beerResults[x].postal_code;
    let phone = formatPhoneNumber(beerResults[x].phone);
    let website = beerResults[x].website_url = "" ? "N/A" : beerResults[x].website_url;
    
    resultText += `<div class="entry">
    <h1>Brewery: ${name}${brewery_type}</h1>
    <h2>Address: ${address}</h2>
    <h2>Phone: ${phone}</h2>
    <h2>Website: ${website}</h2>
    </div>
    `
  }



  




  document.getElementById("resultsText").innerHTML = resultText;
}

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}





// Initial Setup
function initialSetup() {
  // getBeers();
  addListeners();
}
$(initialSetup);
