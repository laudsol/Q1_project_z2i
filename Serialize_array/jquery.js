

$("form").submit(function( event ) {
  var inputObj = $(this).serializeArray()

  event.preventDefault();
  for (var key in inputObj) {
    let ticker = inputObj[key].value;
    if (ticker !== "") {

      $.getJSON('http://www.enclout.com/api/yahoo_finance/show.json?auth_token=xxxxxx&text='+ticker, function(data) {
         console.log(data);
      });
    }
  }
});
