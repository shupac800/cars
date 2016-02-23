// BEGIN GLOBALS
var carsArray = [];
var modelYear = [];
var rg = [];
// END GLOBALS

loadMakeModel();

///////////////////////////
function loadMakeModel() {
  var loader = new XMLHttpRequest;
  loader.addEventListener("load",function() {
    carsArray = JSON.parse(loader.responseText).data;
    loadModelYear();
  });
  loader.open("GET","makemodel.json");
  loader.send();
}
///////////////////////////
function loadModelYear() {
  var loader = new XMLHttpRequest;
  loader.addEventListener("load",function() {
    modelYear = JSON.parse(loader.responseText).data;
    createListeners();
  });
  loader.open("GET","modelyear.json");
  loader.send();
}
///////////////////////////
function createListeners() {
  document.getElementById("make_dropdown").addEventListener("change",loadModelDropdown);
  document.getElementById("go_button").addEventListener("click",buildURLString);
}
///////////////////////////
function loadModelDropdown () {
  var mkId = document.getElementById("make_dropdown").value;
  // build HTML string for model dropdown and pass it through DOM
  var modelMenu = "";

  for (var k=0; k < carsArray.length; k++) {
    if (carsArray[k].mkId == mkId) {
      modelMenu += `<option value='${carsArray[k].mdId}'>${carsArray[k].model}</option>`;
    }
  }
  document.getElementById("model_dropdown").innerHTML = "<option value=''>All Makes</option>" + modelMenu;
}
///////////////////////////
function buildURLString() {
  // make the form invisible
  document.querySelector("form").style.display = "none";

  // get elements from form
  var zipcode =       document.getElementById("zip");
  var radius =        document.getElementById("radius");
  var inputMake =     document.getElementById("make_dropdown");
  var inputModel =    document.getElementById("model_dropdown");
  var inputYearLow =  document.getElementById("yearLow");
  var inputYearHigh = document.getElementById("yearHigh");
  var keyword =       document.getElementById("keyword");

  var urlString =  "http://www.cars.com/for-sale/searchresults.action?";
  urlString += "&rd=" + radius.value;
  urlString += "&uncpo=2&stkTyp=U"; // new=1, used=2, CPO=3; stkTyp can be U(sed) or N(ew)
  urlString += "&zc=" + zipcode.value;
  urlString += "&mkId=" + inputMake.value;
  urlString += "&mdId=" + inputModel.value;
  urlString += makeKeywordString(keyword.value.split(" ")) + "&kwm=ANY";  // kwm=ANY means match any keyword
<<<<<<< HEAD
  console.log("makeKeywordString returns",makeKeywordString(keyword.value.split(" ")));
  console.log("urlString is now",urlString);
=======
>>>>>>> d1c8d234b20b017cbb9d4f2bbb4d1dc89190f35c
  urlString += makeYearString(inputYearLow.value,inputYearHigh.value);
  urlString += "&rpp=250"; // results per page, can be (10,20,30,50,100,250)

  // note: to search for a vehicle by ID, use the ID number as a keyword

  console.log("built URL string:",urlString);

  doCORSRequest({method:'GET',url:urlString,data:""});
}
///////////////////////////
function doCORSRequest(options) {
  var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.send(options.data);
  x.onload = function() {  // upon onload, do this function
    if ( (x.readyState === x.DONE) && (x.status === 200) ) {
      var outputField = document.getElementById("output");
      outputField.style.display = "none";
      outputField.innerHTML = x.response; // load results into DOM (is there a better way?)
      var results = buildResultsArray();
      rg = results;  // for testing, make results available to variable rg in global scope
      displayResults(results);
    } // end if
  } // end onload function
} // end function doCORSRequest
///////////////////////////
function buildResultsArray() {
  var results = [];
  var vehicle = document.getElementsByClassName("vehicle");  // array with all results on page

  for (var m = 0; m < vehicle.length; m++) {
    var vehicleObjAsString = vehicle[m].getAttribute("data-js-vehicle-row"); // grab value of custom attribute
    vehicleObjAsString = vehicleObjAsString.replace(/:,/g, ':"NR",'); // fix any non-compliant null values
    var vehicleObj = JSON.parse(vehicleObjAsString); // parse data from string into object
    console.log("listingId:",vehicleObj.listingId,"price:",vehicleObj.price);
    console.log("stock type:",vehicleObj.stockType);

    var secondary = vehicle[m].children.item(1).children.item(0).innerHTML; // class="secondary"
    var year = sliceIt(secondary,"modelYearSort");
    var name = sliceIt(secondary,"mmtSort");  // e.g. "BMW 328i xDrive"

    console.log("Year:",year);
    console.log("Name:",name);

    var description = vehicle[m].children.item(1).children.item(1).innerHTML;
    var extColor = sliceIt(description,"exteriorColorSort");
    var transmission = sliceIt(description,"transmissionSort");
    // var snoopy = sliceIt(description,"snoopy");  // for testing instance where key is not found

    console.log("Color:",extColor);
    console.log("Trans:",transmission);
    // console.log("Snoopy:",snoopy);

    var col8alignright = vehicle[m].children.item(2).children.item(2).innerHTML
    // console.log("col8alignright:",col8alignright);
    var mileage = sliceIt(col8alignright,"milesSort").replace(",","").replace(" mi.","");

    console.log("mileage:",mileage);

    results.push( { id:vehicleObj.listingId,
                    year:year,
                    color:extColor,
                    desc:name,
                    transmission:transmission,
                    mileage:mileage,
                    price:vehicleObj.price } );
  } // end for m
  return results;
}
/////////////////////////
function displayResults(results) {

  outputHTML = `<p class='howMany'>${results.length} vehicles found</p>`
  // fill first row
  outputHTML += '<table><tr class="row">';
  outputHTML += '<th class="cell-id">Vehicle ID</th>';
  outputHTML += '<th class="cell-color">Color</th>';
  outputHTML += '<th class="cell-year">Year</th>';
  outputHTML += '<th class="cell-desc">Description</th>';
  outputHTML += '<th class="cell-mile">Miles</th>';
  outputHTML += '<th class="cell-price">Price</th></tr>';

  // fill row for each car
  for (var i = 0; i < results.length; i++) {
    outputHTML += "<tr class='row'><td class='cell-id'>"+results[i].id+"</td>";
    outputHTML += "<td class='cell-color'>"+results[i].color.slice(0,18)+"</td>";
    outputHTML += "<td class='cell-year'>"+results[i].year+"</td>";
    outputHTML += "<td class='cell-desc'>"+results[i].desc.slice(0,30)+"</td>";
    outputHTML += "<td class='cell-mile'>"+results[i].mileage+"</td>";
    outputHTML += "<td class='cell-price'>"+results[i].price+"</td></tr>";
  }

  document.getElementById("output").innerHTML = outputHTML;
<<<<<<< HEAD
  document.getElementById("output").style.display = "inline";  // make visible
=======
  document.getElementById("output").style.display = "inline";
>>>>>>> d1c8d234b20b017cbb9d4f2bbb4d1dc89190f35c

  // add event listener on each Vehicle ID
  var vehicleID = document.getElementsByClassName("cell-id");
  for (var i = 0; i < vehicleID.length; i++) {
    vehicleID[i].addEventListener("click",function(event){
      var urlString = `http://www.cars.com/vehicledetail/detail/${event.target.innerHTML}/overview/`;
      window.open(urlString,'_blank');
    });
  }

}
////////////////////////////
function sliceIt(wholeString,searchString) {
  var startPos = wholeString.indexOf(searchString) + searchString.length + 2;
  var endPos = wholeString.indexOf("<",startPos);
  if (wholeString.indexOf(searchString) >= 0) {  // was searchString found in wholeString?
    return wholeString.slice(startPos,endPos);
  } else {
<<<<<<< HEAD
    return "**not found**";
=======
    return "***NOT FOUND***";
>>>>>>> d1c8d234b20b017cbb9d4f2bbb4d1dc89190f35c
  }
}
///////////////////////////
function makeYearString(yearLowId,yearHighId) {
  var yrStringForURL = "";
  var yrLowIndex, yrHighIndex;
  var j;

  for (j = 0; j < modelYear.length; j++) {
    if (modelYear[j].yearID == yearLowId) {
      yrLowIndex = j;
    }
    if (modelYear[j].yearID == yearHighId) {
      yrHighIndex = j;
    }
  }

  for (j = yrLowIndex; j <= yrHighIndex; j++) {
    yrStringForURL += "&yrId" + modelYear[j].yearID;
  }

  return yrStringForURL;
}
///////////////////////////
function makeKeywordString(keyword) {
  var keywordList = "";

<<<<<<< HEAD
  for (var l = 0; l < keyword.length; l++) {
    keywordList += "+" + keyword[l];
  }
  keywordList = keywordList.substr(1);  // chop off leading "+"
=======
  for (var l=0; l<keyword.length; l++) {
    keywordList += "+" + keyword[l];
  }
  keywordList = keywordList.substr(1); // chop off leading "+"
>>>>>>> d1c8d234b20b017cbb9d4f2bbb4d1dc89190f35c

  return "&kw=" + keywordList;
}
///////////////////////////
