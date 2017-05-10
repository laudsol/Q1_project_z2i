$('.headerText').popover({
  placement: 'bottom',
  container: 'body',
  html: true,
  trigger: 'hover',
});

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

  // function colorChange (totalPercent) {
  //   if (totalPercent < 80) {
  //     $('.totalAllocationPerc').addClass('yellow');
  //   }
  //   else if (totalPercent > 80 && totalPercent <= 100) {
  //     $('.totalAllocationPerc').addClass('green');
  //   }
  //   else if (totalPercent > 100) {
  //     $('.totalAllocationPerc').addClass('red');
  //   }
  // }
  // colorChange(totalPercent);
};

updatePercent();

$("form").on('input',$('.allocationVal'), function (event) { // listener for percent change
  updatePercent();
});

function addStockElement(event) {
  //Primary elements
  let elementRow = $('<div>').addClass("row stuff");
  let elementStock = $('<div>').addClass("stock col-md-10 col-md-offset-1 col-xs-12");
  //first - ticker
  let elementTicker = $('<div>').addClass("tickerDiv col-md-2 col-md-offset-1");
  let elementLabelTicker = $('<div>').addClass("tickerText mobileActive col-xs-6").html('Ticker:');
  let elementBoxTicker = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputTicker = $('<input>').addClass("tickerInput col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','ticker').attr('value','');

  $(elementTicker).append(elementLabelTicker);
  $(elementBoxTicker).append(elementInputTicker);
  $(elementTicker).append(elementBoxTicker);
  $(elementStock).append(elementTicker);

  //second - allocation
  let elementPercent = $('<div>').addClass("allocationDiv col-md-2");
  let elementLabelPercent = $('<div>').addClass("allocationText mobileActive col-xs-6").html('Allocation:');
  let elementBoxPercent = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputPercent = $('<input>').addClass("allocationVal col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','percent').attr('value','0%');

  $(elementPercent).append(elementLabelPercent);
  $(elementBoxPercent).append(elementInputPercent);
  $(elementPercent).append(elementBoxPercent);
  $(elementStock).append(elementPercent);

  //third  - current shares
  let elementCurShar = $('<div>').addClass("currentSharesDiv col-md-2");
  let elementLabelCurShar = $('<div>').addClass("currentSharesText mobileActive col-xs-6").html('Current shares:');
  let elementBoxCurShar = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputCurShar = $('<input>').addClass("currentSharesInput col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','currentShares').attr('value','0');

  $(elementCurShar).append(elementLabelCurShar);
  $(elementBoxCurShar).append(elementInputCurShar)
  $(elementCurShar).append(elementBoxCurShar);
  $(elementStock).append(elementCurShar);

  //fourth - price
  let elementPrice = $('<div>').addClass("priceDiv col-md-2");
  let elementPriceText = $('<div>').addClass("priceText mobileActive col-xs-6").html("Price:");
  let elementBoxPrice = $('<div>').addClass("col-md-12 col-xs-6");
  let elementPriceInput = $('<input>').addClass("currentPriceOutput col-md-12 inOut grayText orange").attr('style','border:none').attr('value','--');

  $(elementPrice).append(elementPriceText);
  $(elementBoxPrice).append(elementPriceInput);
  $(elementPrice).append(elementBoxPrice);
  $(elementStock).append(elementPrice);

  //fifth - recommended shares
  let elementRecomShares = $('<div>').addClass("sharesDiv col-md-2");
  let elementRecomSharesText = $('<div>').addClass("sharesText mobileActive col-xs-6").html("Recommended shares:");
  let elementBoxRcomShares = $('<div>').addClass("col-md-12 col-xs-6");
  let elementRecomSharesOutput = $('<input>').addClass("sharesOutput col-md-12 inOut grayText orange").attr('style', 'border:none').attr('value','--');
  $(elementRecomShares).append(elementRecomSharesText);
  $(elementBoxRcomShares).append(elementRecomSharesOutput)
  $(elementRecomShares).append(elementBoxRcomShares);
  $(elementStock).append(elementRecomShares);

  // append all to form
  $(elementRow).append(elementStock);
  $('.elements').append(elementRow);
}

$('.addBtn').on('click',function(event){
  addStockElement();
});

$('.remvBtn').on('click',function(event){
  $('.stuff').last().remove();
  updatePercent();
});

var portfolioDef = [{ticker:'aapl', percent: '50%'},{ticker:'googl', percent: '20%'},{ticker:'ge', percent: '30%'}];

var portfolioReg = [{ticker:'ge', percent: '50%'},{ticker:'jpm', percent: '20%'},{ticker:'dva', percent: '30%'}];

var portfolioAgg = [{ticker:'appl', percent: '50%'},{ticker:'googl', percent: '20%'},{ticker:'ge', percent: '30%'}];

function magic (portfolio) {
  for (i=0; i<portfolio.length; i++) {
    addStockElement();
  }
  $('.elements').find('.tickerInput').each(function (i) {
    let tempTicker = portfolio[i].ticker;
    $(this).val(tempTicker);
  });

  $('.elements').find('.allocationVal').each(function (i) {
    let tempTicker = portfolio[i].percent;
    $(this).val(tempTicker);
  });
}

if ($('form').find('.portfolioDef').length > 0) {
  magic(portfolioDef);
} else if ($('form').find('.portfolioReg').length > 0) {
  magic(portfolioReg);
} else if ($('form').find('.portfolioAgg').length > 0) {
  magic(portfolioAgg);
}




myStorage = localStorage;
localData = JSON.parse(localStorage['data']);
var allData = [];

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray(); //all form data
  var tickers = inputObj.filter(function(obj){  //finds tickers from form data
    return obj['name'] == 'ticker';
  });
  var symbols = [];
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
      // console.log(results);
      //SET LOCAL STORAGE
      localStorage.setItem('data',JSON.stringify(results)); //local storage
      localData = JSON.parse(localStorage['data']);
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

        symbols.push(tempSymbol);

      }         // END PROMISE -> ACTIONS FROM HERE

      // APPEND PRICE TO PAGE =======================
      $('form').find('.currentPriceOutput').each(function (i) {
        $(this).val("$"+tempData[i]);
      });

      //

      var invInput = $("#dollar_inv").val();

      if (invInput.substring(0,1) == "$") {
        invInput = invInput.substring(1,invInput.length);
      }

      var investment = parseFloat(invInput);

      var percent = inputObj.filter(function(obj){  //gets an array of % from form
        return obj['name'] == 'percent';
      });

      var currentSharesArr = [];
      var totalInvestedDollars = investment;

      $('form').find('.currentSharesInput').each(function (i) {
        let targetDollars = parseFloat($(this).val())*tempData[i];
        totalInvestedDollars += (Math.min(1,tempData.length-1))*targetDollars;
        currentSharesArr.push(parseFloat($(this).val()));
      });

      var investedDollars = 0;
      var deltas = [];

      $('form').find('.sharesOutput').each(function (i) { // share purchase recommendation
        var percentNum = parseFloat(percent[i].value)/100;
        let price = tempData[i];
        let dollarTarget = (totalInvestedDollars*percentNum)-((Math.min(1,tempData.length-1))*(currentSharesArr[i]*price));

        shares = Math.max(Math.floor((dollarTarget)/price),0);
        $(this).val(shares);

        let delta = 1-((shares*price)/dollarTarget); // get delta between dollars spent, and allocated dollars
        let readySymbol = symbols[i]
        deltas.push({symbol: readySymbol, delta: delta, price: price, shares:shares})
        investedDollars += (shares*price);
      });
      var unallocatedDollars = (investment*(totalAllocation/100)) - investedDollars;
      var sortedDeltas = [];

      function sortDeltas () { // sort deltas highest to lowest
        sortedDeltas = deltas.sort(function(a,b){
          return deltas[a]-deltas[b];
        });
      }

      sortDeltas();

      console.log(sortedDeltas);

      function incrementalBuy () {
        for (i = 0; i<sortedDeltas.length; i++) {
          if (unallocatedDollars > 0 && sortedDeltas[i].price <= unallocatedDollars) {
            // console.log(true);
            $('form').find('.stock').each(function (i) {
              // console.log($('.tickerInput'));
            });
          }
        }
      }
      incrementalBuy();
    }); //END API CALL
  };
});
