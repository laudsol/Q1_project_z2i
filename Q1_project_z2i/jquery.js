//------------- DUMMY DATA -use if API breaks ----------------
const dummyReg = [[{close: '123.01'}],[{close: '40.81'}],[{close:  '49.75'}],[{close: '21.53'}],[{close: '81.11'}],[{close: '54.19'}]];

const dummyDef = [[{close: '81.11'}],[{close: '54.19'}],[{close: '25.06'}],[{close: '91.83'}],[{close: '15.03'}],[{close: '39.71'}],[{close: '123.01'}],[{close: '40.81'}]];

const dummyAgg = [[{close: '110.91'}],[{close: '123.01'}],[{close: '40.81'}],[{close: '106.71'}],[{close: '49.75'}],[{close: '29.24'}],[{close: '88.01'}],[{close: '24.83'}],[{close: '18.57'}],[{close: '21.53'}],[{close: '24.74'}]];

const dummyCust = [[{close: '153.95'}],[{close: '955.89'}]];
// ----------END DUMMY DATA----------------------------------------


// ----------ADD SINGLE ELEMENTS WITH STOCK INFO TO HTML-----------
function addStockElement(event) {

  // Parent elements for stock div
  let elementRow = $('<div>').addClass("row stuff");
  let elementStock = $('<div>').addClass("stock col-md-10 col-md-offset-1 col-xs-12");

  // First child: ticker
  let elementTicker = $('<div>').addClass("tickerDiv col-md-2 col-md-offset-1");
  let elementLabelTicker = $('<div>').addClass("tickerText mobileActive col-xs-6").html('Ticker:');
  let elementBoxTicker = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputTicker = $('<input>').addClass("tickerInput col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','ticker').attr('value','');

  appendTickerElement(elementTicker,elementLabelTicker,elementInputTicker,elementBoxTicker,elementStock);

  // Second child: - percent allocation
  let elementPercent = $('<div>').addClass("allocationDiv col-md-2");
  let elementLabelPercent = $('<div>').addClass("allocationText mobileActive col-xs-6").html('Allocation:');
  let elementBoxPercent = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputPercent = $('<input>').addClass("allocationVal col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','percent').attr('value','0%');

  appendAllocationElemenet(elementPercent,elementLabelPercent,elementInputPercent,elementBoxPercent,elementStock);

  // Third child: current shares held
  let elementCurShar = $('<div>').addClass("currentSharesDiv col-md-2");
  let elementLabelCurShar = $('<div>').addClass("currentSharesText mobileActive col-xs-6").html('Current shares:');
  let elementBoxCurShar = $('<div>').addClass("col-md-12 col-xs-6");
  let elementInputCurShar = $('<input>').addClass("currentSharesInput col-md-12 inOut ltblu").attr('style','border:none;').attr('type','text').attr('name','currentShares').attr('value','0');

  appendCurrentSharesElement(elementCurShar,elementLabelCurShar,elementBoxCurShar,elementInputCurShar,elementStock);

  // Fourth child: price per share
  let elementPrice = $('<div>').addClass("priceDiv col-md-2");
  let elementPriceText = $('<div>').addClass("priceText mobileActive col-xs-6").html("Price:");
  let elementBoxPrice = $('<div>').addClass("col-md-12 col-xs-6");
  let elementPriceInput = $('<input>').addClass("currentPriceOutput col-md-12 inOut grayText orange").attr('style','border:none').attr('value','--');

  appendPrice(elementPrice,elementPriceText,elementBoxPrice,elementPriceInput,elementStock);

  // Fifth child: recommended shares to purchase
  let elementRecomShares = $('<div>').addClass("sharesDiv col-md-2");
  let elementRecomSharesText = $('<div>').addClass("sharesText mobileActive col-xs-6").html("Recommended shares:");
  let elementBoxRcomShares = $('<div>').addClass("col-md-12 col-xs-6");
  let elementRecomSharesOutput = $('<input>').addClass("sharesOutput col-md-12 inOut grayText orange").attr('style', 'border:none').attr('value','--');

  appendRecoShares(elementRecomShares,elementRecomSharesText,elementBoxRcomShares,elementRecomSharesOutput,elementStock);

  appendShareDivToForm(elementRow,elementStock); //append sinlge stock div to page
}
// ---------- END ADD SINGLE ELEMENTS WITH STOCK INFO TO HTML-----------


// ---------- LISTENERS TO ADD/REMOVE SIGNLE STOCK ELEMENTS FROM PAGE --
$('.addBtn').on('click',function(event){
  addStockElement();
});

$('.remvBtn').on('click',function(event){
  $('.stuff').last().remove();
  updatePercent();
});
// ---------- END LISTENERS TO ADD/REMOVE SIGNLE STOCK ELEMENTS FROM PAGE --


// ---------- DATA AND CONSTRUCTION OF RECOMMENDED PORTFOLIO ALLOCATIONS ---
var portfolioDef = [{ticker:'bnd', percent: '32%'},{ticker:'bndx', percent: '24%'},{ticker:'govt', percent: '8%'},{ticker:'igov',percent:'6%'},{ticker:'pgx', percent:'2%'}, {ticker:'sphd', percent:'2%'}, {ticker:'vti', percent:'14%'}, {ticker:'vea', percent:'12%'}];

var portfolioReg = [{ticker:'vti', percent: '30%'},{ticker:'vea', percent: '20%'},{ticker:'iemg', percent: '10%'},{ticker:'emag', percent: '5%'},{ticker:'bnd', percent: '20%'},{ticker:'bndx', percent: '15%'}];

var portfolioAgg = [{ticker:'vtwo', percent: '6%'},{ticker:'vti', percent: '24%'},{ticker:'vea', percent: '20%'},{ticker:'vss', percent: '5%'},{ticker:'iemg', percent: '18%'},{ticker:'fm', percent: '8%'}, {ticker:'hyg', percent:'11%'},{ticker:'ihy', percent: '3%'},{ticker:'emlc', percent: '1%'},{ticker:'emag', percent: '1%'},{ticker:'hyem', percent: '3%'}];

assignPortfolioToRiskProfile(portfolioDef,dummyDef,portfolioReg,dummyReg,portfolioAgg,dummyAgg,dummyCust);
// ---------- END DATA AND CONSTRUCTION OF RECOMMENDED PORTFOLIO ALLOCATIONS ---

// ---------- DATA DISPLAYED ON PAGE -------------------
createPopoverExplanations(); // user can hover on title to view explanation

var totalAllocation = 100;

updatePercent(); // computes total percent allocation and displays on page

$("form").on('input',$('.allocationVal'), function (event) { // listener for allocation change, updates on page
  updatePercent();
});
// ---------- END DATA DISPLAYED ON PAGE -------------------


// Submit event: API call,
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
      for (i = 0; i < results.length; i++) { //extract price and ticker

        var tempObj = results[i][0];
        var tempSymbol = tempObj.symbol;
        var tempBid =  parseFloat(tempObj.bid);
        var tempAsk =  parseFloat(tempObj.ask);
        var tempClose =  parseFloat(tempObj.close);
        var tempPrice = priceByBidaskOrClose(tempAsk, tempBid, tempClose);
        var price = parseFloat(tempPrice.toFixed(2));
        tempData.push(price);
        symbols.push(tempSymbol);
      }         // END PROMISE -> ACTIONS FROM HERE

      appendPriceToPage(tempData);

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
      var allPrices = [];

      $('form').find('.sharesOutput').each(function (i) { // share purchase recommendation
        var percentNum = parseFloat(percent[i].value)/100;
        let price = tempData[i];
        let dollarTarget = (totalInvestedDollars*percentNum)-((Math.min(1,tempData.length-1))*(currentSharesArr[i]*price));

        allPrices.push(price);

        shares = Math.max(Math.floor((dollarTarget)/price),0);
        $(this).val(shares);

        let delta = 1-((shares*price)/dollarTarget); // get delta between dollars spent, and allocated dollars
        let readySymbol = symbols[i];
        deltas.push({symbol: readySymbol, delta: delta, price: price, shares:shares});
        investedDollars += (shares*price);
      });

      var unallocatedDollars = (investment*(totalAllocation/100)) - investedDollars;
      var sortedDeltas = [];

      sortDeltas(sortDeltas,deltas);

      var minPrice = allPrices[0];

      for (i=0; i<allPrices.length; i++) {
        if(minPrice > allPrices[i]) {
          minPrice = allPrices[i];
        }
      }

    allocateRemainingDollars(unallocatedDollars, minPrice);
    appendOptimizedShares(sortedDeltas)

    }); //END API CALL
  };
});


//----------INDEX OF ALL FUNCTIONS INVOKED ABOVE-------------------

function priceByBidaskOrClose(ask, bid, close){
  if (ask >= 0 && bid >= 0) {
    return (bid+ask)*0.5;
  } else {
    return close;
  }
}

function appendTickerElement(elTicker,elLabelTicker,elInputTicker,elBoxTicker, elStock){
  $(elTicker).append(elLabelTicker);
  $(elBoxTicker).append(elInputTicker);
  $(elTicker).append(elBoxTicker);
  $(elStock).append(elTicker);
}

function appendAllocationElemenet(elPercent,elLabelPercent,elInputPercent,elBoxPercent,elStock){
  $(elPercent).append(elLabelPercent);
  $(elBoxPercent).append(elInputPercent);
  $(elPercent).append(elBoxPercent);
  $(elStock).append(elPercent);
}

function appendCurrentSharesElement(elCurShar,elLabelCurShar,elBoxCurShar,elInputCurShar,elStock){
  $(elCurShar).append(elLabelCurShar);
  $(elBoxCurShar).append(elInputCurShar)
  $(elCurShar).append(elBoxCurShar);
  $(elStock).append(elCurShar);
}

function appendPrice(elPrice,elPriceText,elBoxPrice,elPriceInput,elStock){
  $(elPrice).append(elPriceText);
  $(elBoxPrice).append(elPriceInput);
  $(elPrice).append(elBoxPrice);
  $(elStock).append(elPrice);
}

function appendRecoShares(elRecomShares,elRecomSharesText,elBoxRcomShares,elRecomSharesOutput,elStock){
  $(elRecomShares).append(elRecomSharesText);
  $(elBoxRcomShares).append(elRecomSharesOutput);
  $(elRecomShares).append(elBoxRcomShares);
  $(elStock).append(elRecomShares);
}

function appendShareDivToForm(elRow,elStock){
  $(elRow).append(elStock);
  $('.elements').append(elRow);
}

function createRecommendedAllocation(portfolio) {
  for (i=0; i<portfolio.length; i++) {
    addStockElement();
  }
  $('.elements').find('.tickerInput').each(function(i) {
    let tempTicker = portfolio[i].ticker;
    $(this).val(tempTicker);
  });

  $('.elements').find('.allocationVal').each(function(i) {
    let tempTicker = portfolio[i].percent;
    $(this).val(tempTicker);
  });
}

function createPopoverExplanations(){
  $('.headerText').popover({
    placement: 'bottom',
    container: 'body',
    html: true,
    trigger: 'hover',
  });
}

function assignPortfolioToRiskProfile(portfolioDef,dummyDef,portfolioReg,dummyReg,portfolioAgg,dummyAgg,dummyCust){
  if ($('form').find('.portfolioDef').length > 0) {
    createRecommendedAllocation(portfolioDef);
  } else if ($('form').find('.portfolioReg').length > 0) {
    createRecommendedAllocation(portfolioReg);
  } else if ($('form').find('.portfolioAgg').length > 0) {
    createRecommendedAllocation(portfolioAgg);
  } else if ($('form').find('.portfolioCust').length > 0) {
  }
}

function updatePercent (event) {
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
}

function appendPriceToPage(tempData){
  $('form').find('.currentPriceOutput').each(function (i) {
    $(this).val("$"+tempData[i]);
  });
}

function sortDeltas (sortDeltas,deltas) {
  sortedDeltas = deltas.sort(function(a,b){
    return deltas[a]-deltas[b];
  });
}

function incrementalBuy (unallocatedDollars,sortedDeltas) {
  for (i = 0; i<sortedDeltas.length; i++) {
    // console.log(unallocatedDollars);
    if (unallocatedDollars > 0 && sortedDeltas[i].price <= unallocatedDollars){
      sortedDeltas[i].shares += 1;
      unallocatedDollars -= sortedDeltas[i].price;
      // console.log(sortedDeltas[i].shares);
    };
  }
}

function allocateRemainingDollars (unallocatedDollars, minPrice) {
  if (unallocatedDollars > 0 && unallocatedDollars > minPrice) {
  incrementalBuy(unallocatedDollars,sortedDeltas);
  }
}

function appendOptimizedShares(sortedDeltas){
  $('form').find('.stock').each(function (j) {
    for(i = 0; i<sortedDeltas.length; i++) {
      if (sortedDeltas[i].symbol == $(this).find('.tickerInput').val()) {
        $(this).find('.sharesOutput').val(sortedDeltas[i].shares);
      }
    }
  });
}
