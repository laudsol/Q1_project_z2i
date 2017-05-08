var totalAllocation = 100;

function updatePercent (event) { // update total percent
  let totalPercent = 0;

  $('form').find('.allocationVal').each(function (i) {
    var number = $(this).val();

    if (number.charAt(number.length-1)=='%') {
      number = number.substring(0,number.length-1);
    }
    percent = parseFloat(number);
    totalPercent += percent;
    totalAllocation = totalPercent;
  });
  $('.totalAllocationPerc').html(totalPercent+"%");
};


$("form").on('input',$('.allocationVal'), function (event) { // listener for percent change
  updatePercent();
});

$('.addBtn').on('click',function(event){
  //Primary elements
  let elementRow = $('<div>').addClass("row");
  let elementStock = $('<div>').addClass("stock col-md-10 col-md-offset-1");
  //first - ticker
  let elementTicker = $('<div>').addClass("tickerDiv col-md-2");
  let elementLabelTicker = $('<label>').addClass("tickerText col-md-6").html('Ticker:');
  let elementInputTicker = $('<input>').addClass("tickerInput col-md-6").attr('style','border:none;').attr('type','text').attr('name','ticker').attr('value','');

  $(elementTicker).append(elementLabelTicker);
  $(elementTicker).append(elementInputTicker);
  $(elementStock).append(elementTicker);

  //second - allocation
  let elementPercent = $('<div>').addClass("allocationDiv percent col-md-2");
  let elementLabelPercent = $('<label>').addClass("allocationText col-md-5").html('Allocation:');
  let elementInputPercent = $('<input>').addClass("allocationVal col-md-4").attr('style','border:none;').attr('type','text').attr('name','percent').attr('value','0%');

  $(elementPercent).append(elementLabelPercent);
  $(elementPercent).append(elementInputPercent);
  $(elementStock).append(elementPercent);

  //third  - current shares
  let elementCurShar = $('<div>').addClass("currentSharesDiv col-md-3");
  let elementLabelCurShar = $('<label>').addClass("currentSharesText col-md-8").html('Current shares:');
  let elementInputCurShar = $('<input>').addClass("currentSharesInput col-md-3").attr('style','border:none;').attr('type','text').attr('name','currentShares').attr('value','0');

  $(elementCurShar).append(elementLabelCurShar);
  $(elementCurShar).append(elementInputCurShar);
  $(elementStock).append(elementCurShar);

  //fourth - price
  let elementPrice = $('<div>').addClass("priceDiv col-md-2");
  let elementPriceText = $('<div>').addClass("priceText col-md-5").html("<strong>Price:</strong>");
  let elementPriceInput = $('<div>').addClass("currentPriceOutput col-md-7").html('--');

  $(elementPrice).append(elementPriceText);
  $(elementPrice).append(elementPriceInput);
  $(elementStock).append(elementPrice);

  //fifth - recommended shares
  let elementRecomShares = $('<div>').addClass("sharesDiv col-md-4");
  let elementRecomSharesText = $('<div>').addClass("sharesText col-md-8").html("<strong>Recommended shares:</strong>");
  let elementRecomSharesOutput = $('<div>').addClass("sharesOutput col-md-1").html('--');

  $(elementRecomShares).append(elementRecomSharesText);
  $(elementRecomShares).append(elementRecomSharesOutput);
  $(elementStock).append(elementRecomShares);

  // append all to form
  $(elementRow).append(elementStock);
  $('.elements').append(elementRow);
});

$('.remvBtn').on('click',function(event){
  $('.stock').last().remove();
  updatePercent();
});

myStorage = localStorage;
localData = JSON.parse(localStorage['data']);
var allData = [];

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray(); //all form data
  var tickers = inputObj.filter(function(obj){  //finds tickers from form data
    return obj['name'] == 'ticker';
  });
  var tempData = []; //takes parsed JSON data for action
  if (totalAllocation > 100) {
    window.alert("allocation cannot exceed 100%")
    return false;
  } else {
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
      localStorage.setItem('data',JSON.stringify(results)); //local storage
      localData = JSON.parse(localStorage['data']);
      console.log(localData);

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
      $('form').find('.currentPriceOutput').each(function (i) { //appends price to page
        $(this).html("$"+tempData[i]);
      });

      var investment = parseFloat($("#dollar_inv").val());

      var percent = inputObj.filter(function(obj){  //gets an array of % from form
        return obj['name'] == 'percent';
      });

      var currentSharesArr = [];
      var totalInvestedDollars = investment;

      $('form').find('.currentSharesInput').each(function (i) {
        let targetDollars = parseFloat($(this).val())*tempData[i];
        totalInvestedDollars += targetDollars;
        currentSharesArr.push(parseFloat($(this).val()));
      });

      $('form').find('.sharesOutput').each(function (i) { // share purchade recommendation
        var percentNum = parseFloat(percent[i].value)/100;
        let price = tempData[i];
        let dollarTarget = (totalInvestedDollars*percentNum)-(currentSharesArr[i]*price);
        shares = Math.max(Math.floor((dollarTarget)/price),0);
        $(this).html(shares);
      });

    }); //END API CALL
  };
});
