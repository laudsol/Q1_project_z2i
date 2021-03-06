// dummy price data

const dummyReg = [[{close: '123.01'}],[{close: '40.81'}],[{close: '49.75'}],[{close: '21.53'}],[{close: '81.11'}],[{close: '54.19'}]];
const dummyDef = [[{close: '81.11'}],[{close: '54.19'}],[{close: '25.06'}],[{close: '91.83'}],[{close: '15.03'}],[{close: '39.71'}],[{close: '123.01'}],[{close: '40.81'}]];
const dummyAgg = [[{close: '110.91'}],[{close: '123.01'}],[{close: '40.81'}],[{close: '106.71'}],[{close: '49.75'}],[{close: '29.24'}],[{close: '88.01'}],[{close: '24.83'}],[{close: '18.57'}],[{close: '21.53'}],[{close: '24.74'}]];
const dummyCust = [[{close: '153.95'}],[{close: '955.89'}]]

resultsD = ''

//  Adding fund/stock elements to portfolio page

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

// Portfolio composition and construction

var portfolioDef = [{ticker:'bnd', percent: '32%'},{ticker:'bndx', percent: '24%'},{ticker:'govt', percent: '8%'},{ticker:'igov',percent:'6%'},{ticker:'pgx', percent:'2%'}, {ticker:'sphd', percent:'2%'}, {ticker:'vti', percent:'14%'}, {ticker:'vea', percent:'12%'}];

var portfolioReg = [{ticker:'vti', percent: '30%'},{ticker:'vea', percent: '20%'},{ticker:'iemg', percent: '10%'},{ticker:'emag', percent: '5%'},{ticker:'bnd', percent: '20%'},{ticker:'bndx', percent: '15%'}];

var portfolioAgg = [{ticker:'vtwo', percent: '6%'},{ticker:'vti', percent: '24%'},{ticker:'vea', percent: '20%'},{ticker:'vss', percent: '5%'},{ticker:'iemg', percent: '18%'},{ticker:'fm', percent: '8%'},{ticker:'hyg',percent:'11%'},{ticker:'ihy', percent: '3%'},{ticker:'emlc', percent: '1%'},{ticker:'emag', percent: '1%'},{ticker:'hyem', percent: '3%'}];

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
  resultsD = dummyDef;
} else if ($('form').find('.portfolioReg').length > 0) {
  magic(portfolioReg);
  resultsD = dummyReg;
} else if ($('form').find('.portfolioAgg').length > 0) {
  magic(portfolioAgg);
  resultsD = dummyAgg;
} else if ($('form').find('.portfolioCust').length > 0) {
  resultsD = dummyCust;
}

// Popover

$('.headerText').popover({
  placement: 'bottom',
  container: 'body',
  html: true,
  trigger: 'hover',
});


// Total allocation

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

updatePercent();

$("form").on('input',$('.allocationVal'), function (event) { // listener for percent change
  updatePercent();
});




// local storage

// myStorage = localStorage;
// localData = JSON.parse(localStorage['data']);
var allData = [];


// Submit event: API call,

$("form").submit(async function(event) {
  let stockTickers = $(this).serializeArray()
    .filter(object => object.name === 'ticker')
    .map(object => object.value)
    .toString()

  var symbols = [];
  if (totalAllocation > 100) {
    window.alert("allocation cannot exceed 100%")
    return false;
  } else {
    event.preventDefault();
    
  let url = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${stockTickers}&types=quote`
  
  let apiResults = (url) => {
    return new Promise((resolve, reject) => {
      $.get(
        url,
      ).done((data) => {
        resolve(data)
      })
    });
  }

  let stockData = await apiResults(url)

  let priceArray = Object.keys(stockData).map((ticker) => {
    let bid = stockData[ticker].quote.iexBidPrice
    let ask = stockData[ticker].quote.iexAskPrice
    let close = stockData[ticker].quote.close
    if(bid !== 0 && ask !== 0){
      return (bid + ask)/2
    } else {
      return close
    }
  })
  
      $('form').find('.currentPriceOutput').each(function (i) {
        $(this).val("$"+priceArray[i]);
      });

      var invInput = $("#dollar_inv").val();
      
      if (invInput.substring(0,1) == "$") {
        invInput = invInput.substring(1,invInput.length);
      }
      
      var investment = parseFloat(invInput);
      
      var percent = $(this).serializeArray()
      .filter(obj => obj.name === 'percent')
      
      var currentSharesArr = [];
      var totalInvestedDollars = investment;
      
      $('form').find('.currentSharesInput').each(function (i) {
        let targetDollars = parseFloat($(this).val())*priceArray[i];
        totalInvestedDollars += (Math.min(1,priceArray.length-1))*targetDollars;
        currentSharesArr.push(parseFloat($(this).val()));
      });
      
      var investedDollars = 0;
      var deltas = [];
      var allPrices = [];
      
      $('form').find('.sharesOutput').each(function (i) { // share purchase recommendation
        var percentNum = parseFloat(percent[i].value)/100;
        let price = priceArray[i];
        let dollarTarget = (totalInvestedDollars*percentNum)-((Math.min(1,priceArray.length-1))*(currentSharesArr[i]*price));
        
        allPrices.push(price);
        
        shares = Math.max(Math.floor((dollarTarget)/price),0);
        $(this).val(shares);
        
        let delta = 1-((shares*price)/dollarTarget); // get delta between dollars spent, and allocated dollars
        let readySymbol = symbols[i]
        deltas.push({symbol: readySymbol, delta: delta, price: price, shares:shares})
        investedDollars += (shares*price);
      });
      var unallocatedDollars = (investment*(totalAllocation/100)) - investedDollars;
      var sortedDeltas = [];

      function sortDeltas () {
        sortedDeltas = deltas.sort(function(a,b){
          return deltas[a]-deltas[b];
        });
      }

      sortDeltas();

      function incrementalBuy () {
        for (i = 0; i<sortedDeltas.length; i++) {
          if (unallocatedDollars > 0 && sortedDeltas[i].price <= unallocatedDollars){
            sortedDeltas[i].shares += 1;
            unallocatedDollars -= sortedDeltas[i].price;
          };
        }
      }

      var minPrice = allPrices[0];

      for (i=0; i<allPrices.length; i++) {
        if(minPrice > allPrices[i]) {
          minPrice = allPrices[i];
        }
      }

      function allocateRemainingDollars () {
        if (unallocatedDollars > 0 && unallocatedDollars > minPrice) {
        incrementalBuy();
        }
      }

    allocateRemainingDollars();

    $('form').find('.stock').each(function (j) {
      for(i = 0; i < sortedDeltas.length; i++) {
        if (sortedDeltas[i].symbol == $(this).find('.tickerInput').val()) {
          $(this).find('.sharesOutput').val(sortedDeltas[i].shares);
        }
      }
    });
  }
});