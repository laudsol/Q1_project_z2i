myStorage = localStorage;
localData = JSON.parse(localStorage['data']);
// console.log(localData[0][0]['symbol']);
var allData = [];

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray(); //all form data
  var tickers = inputObj.filter(function(obj){  //finds tickers from form data
    return obj['name'] == 'ticker';
  });
  var tempData = []; //takes prased JSON data for action
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
      var price = 0;


      if (tempAsk >= 0 && tempBid >= 0) { //finds price by bid/ask OR close
        price = (tempBid+tempAsk)*0.5;
      } else {
        price = tempClose;
      }
      tempData.push(price);
    }         // END PROMISE -> ACTIONS FROM HERE
    $('form').find('.ticker_inp').each(function (i) { //appends price to page
      var element = $('<div>');
      element.html("price: $"+tempData[i]);
      $(this).append(element);
    });

    var investment = parseFloat($("#dollar_inv").val());

    var percent = inputObj.filter(function(obj){  //gets an array of % from form
      return obj['name'] == 'percent';
    });

    $('form').find('.percent').each(function (i) { //
      var percentNum = parseFloat(percent[i].value)/100;
      let price = tempData[i]
      shares = Math.floor((investment * percentNum)/price);
      var element = $('<div>');
      element.html(shares+" shares");
      $(this).append(element);
    });


  }); //END API CALL
});
