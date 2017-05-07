

$("form").on('input',$('.percentVal'), function (event) { // listener for percent of allocation
  var totalPercent = 0;

  $('form').find('.percentVal').each(function (i) {
    var number = $(this).val();

    if (number.charAt(number.length-1)=='%') {
      number = number.substring(0,number.length-1);
    }
    percent = parseFloat(number);
    totalPercent += percent;
  });
  $('.totalAllocation').html("Total allocation: "+totalPercent+"%");
}); // END PERCENT LISTENER

myStorage = localStorage;
localData = JSON.parse(localStorage['data']);
var allData = [];

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray(); //all form data
  var tickers = inputObj.filter(function(obj){  //finds tickers from form data
    return obj['name'] == 'ticker';
  });
  var tempData = []; //takes parsed JSON data for action
  // if ()
  event.preventDefault();
  var financeRequests = [];
  for (var key in tickers) {
    let ticker = tickers[key].value;
    if (ticker !== "") {
      financeRequests.push($.getJSON('http://www.enclout.com/api/yahoo_finance/show.json?auth_token=xxxxxx&text='+ticker));
    }
  }
  Promise.all(financeRequests).then(function (results) {
    console.log(results);
    //SET LOCAL STORAGE
    // localStorage.setItem('data',JSON.stringify(results)); //local storage
    // localData = JSON.parse(localStorage['data']);
    // console.log(localData);

    for (i = 0; i < results.length; i++) { //extract price and ticker

      var tempObj = results[i][0];
      var tempSymbol = tempObj.symbol;
      var tempBid =  parseFloat(tempObj.bid);
      var tempAsk =  parseFloat(tempObj.ask);
      var tempClose =  parseFloat(tempObj.close);
      var tempPrice = 0;

      if (tempAsk >= 0 && tempBid >= 0) { //finds price by bid/ask OR close
        tempPrice = (tempBid+tempAsk)*0.5;
      } else {
        tempPrice = tempClose;
      }
      var price = parseFloat(tempPrice.toFixed(2));
      tempData.push(price);

    }         // END PROMISE -> ACTIONS FROM HERE
    $('form').find('.current_price').each(function (i) { //appends price to page
      $(this).html("Price: $"+tempData[i]);
    });

    var investment = parseFloat($("#dollar_inv").val());

    var percent = inputObj.filter(function(obj){  //gets an array of % from form
      return obj['name'] == 'percent';
    });

    $('form').find('.shares').each(function (i) { //
      var percentNum = parseFloat(percent[i].value)/100;
      let price = tempData[i]
      shares = Math.floor((investment * percentNum)/price);
      $(this).html("Recommended shares: "+shares);
    });

  }); //END API CALL
});
