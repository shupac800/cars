var outputEl = document.getElementById("outputGoesHere");

var results = JSON.parse(localStorage.getItem('searchResults'));

fill_firstRow();

for (var i = 0; i < results.length; i++) {
  fill_table(results[i]);
}

function fill_firstRow() {
  console.log("yabba");
  var newNode = document.createElement('article');
  newNode.setAttribute("class","row");
  var outputHTML = '<span class="cell-id">Vehicle ID</span>';
  outputHTML += '<span class="cell-color">Color</span>';
  outputHTML += '<span class="cell-year">Year</span>';
  outputHTML += '<span class="cell-desc">Description</span>';
  outputHTML += '<span class="cell-mile">Miles</span>';
  outputHTML += '<span class="cell-price">Price</span>';

  newNode.innerHTML = outputHTML;

  outputEl.appendChild(newNode);
}

function fill_table(car) {
  var newNode = document.createElement('article');
  newNode.setAttribute("class","row");
  var outputHTML = "<span class='cell-id'>"+car.id+"</span>";
  outputHTML += "<span class='cell-color'>"+car.color.slice(0,18)+"</span>";
  outputHTML += "<span class='cell-year'>"+car.year+"</span>";
  outputHTML += "<span class='cell-desc'>"+car.desc.slice(0,30)+"</span>";
  outputHTML += "<span class='cell-mile'>"+car.mileage+"</span>";
  outputHTML += "<span class='cell-price'>"+car.price+"</span>";

  newNode.innerHTML = outputHTML;

  outputEl.appendChild(newNode);
}