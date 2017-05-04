

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray();

  event.preventDefault();
  var allData = [];
  // var financeRequests = [];
  // for (var key in inputObj) {
  //   let ticker = inputObj[key].value;
  //   if (ticker !== "") {
  //     financeRequests.push($.getJSON('http://www.enclout.com/api/yahoo_finance/show.json?auth_token=xxxxxx&text='+ticker));
  //   }
  // }
  // Promise.all(financeRequests).then(function (results) {
  //   console.log(results);

    var tempResults = [[{bid: '$100', ask: '$105', close: '$102', symbol:'aapl'}],[{bid: 'NA', ask: 'NA', close:'$200', symbol: 'googl'}]];

    for (i = 0; i < tempResults.length; i++) {
      var tempData = [];
      var tempObj = tempResults[i][0];
      var tempSymbol = tempObj.symbol;
      var tempBid =  tempObj.bid;
      var tempBidNum = parseInt(tempBid.substring(1),10);
      var tempAsk =  tempObj.ask;
      var tempAskNum = parseInt(tempAsk.substring(1),10);
      var tempClose =  tempObj.close;
      var tempCloseNum = parseInt(tempClose.substring(1),10);
      var price = 0;

      if (tempAskNum >= 0 && tempBidNum >= 0) {
        price = (tempBidNum+tempAskNum)*0.5;
      } else {
        price = tempCloseNum;
      }
      tempData.push(tempSymbol);
      tempData.push(price);
      allData.push(tempData);

    }
  // });

    $('form').find('.stock').each(function (i,e) {
      var element = $('<div>');
      element.html(allData[i][1]);
      $(this).append(element);
    });

});
