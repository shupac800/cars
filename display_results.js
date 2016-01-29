var outputEl = document.getElementById("outputGoesHere");

var results = JSON.parse(localStorage.getItem('searchResults'));


fill_firstRow();


var car;
//prices and mileages arrays for stats
var prices = [];
var mileages = [];

for (var i = 0; i < results.length; i++) {
  car = results[i];

  fill_table(car);

  //only push price and mileage if both exist for a given car
  if (car.price !== "NR" && car.mileage !== "-"){
    prices.push(parseInt(car.price));
    mileages.push(parseInt(car.mileage));
  }
}

fill_stats();

function fill_stats() {
  //calculate correlation between prices and mileages and display at top of table
  var sampCorr = getPearsonCorrelation(prices, mileages).toFixed(4);
  document.getElementById('stats').innerHTML = "Correlation between Price and Mileage: " + sampCorr;
}

function fill_firstRow() {
  var newNode = document.createElement('article');
  newNode.setAttribute("class","row");
  var outputHTML = '<span class="cell-id">Vehicle ID</span>';
  outputHTML += '<span class="cell-color">Color</span>';
  outputHTML += '<span class="cell-year">Year</span>';
  outputHTML += '<span class="cell-desc">Description</span>';
  outputHTML += '<span class="cell-mile">Miles</span>';
  outputHTML += '<span class="cell-price">Price</span>';
  outputHTML += '<span class="cell-ratio">Price/Mile</span>';


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
  outputHTML += "<span class='cell-ratio'>$"+(car.price/car.mileage).toFixed(2)+"</span>";


  newNode.innerHTML = outputHTML;

  outputEl.appendChild(newNode);
}



/*
 *  Source: http://stevegardner.net/2012/06/11/javascript-code-to-calculate-the-pearson-correlation-coefficient/
 */
function getPearsonCorrelation(x, y) {
    var shortestArrayLength = 0;
     
    if(x.length == y.length) {
        shortestArrayLength = x.length;
    } else if(x.length > y.length) {
        shortestArrayLength = y.length;
        console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
    } else {
        shortestArrayLength = x.length;
        console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
    }
  
    var xy = [];
    var x2 = [];
    var y2 = [];
  
    for(var i=0; i<shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }
  
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;
  
    for(var i=0; i< shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }
  
    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;
  
    return answer;
}