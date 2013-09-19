

var StockGenerator = 
{
  init : function(){
    this.GetStocks(this.GetLocalTickers());
  },
  
  GetLocalTickers : function(){
    var defaultTickers = ["GOOG","EVHC","YHOO","AAPL","FB","MMM"], LocalTickers = [], TickerQueryString = "";

    if(typeof localStorage['LocalTickers'] == 'undefined'){
      localStorage['LocalTickers'] = JSON.stringify(defaultTickers);    
    }

    LocalTickers = JSON.parse(localStorage['LocalTickers']);
    return LocalTickers;
  },
  
  AddLocalTicker : function(ticker){
    LocalTickers = JSON.parse(localStorage['LocalTickers']);
    
    if (LocalTickers.indexOf(ticker) == -1){
      LocalTickers.push(ticker);
      localStorage['LocalTickers'] = JSON.stringify(LocalTickers);

      this.DestroyTickersContainer();
      this.GetStocks(this.GetLocalTickers());
    }
  },

  RemoveLocalTicker : function(ticker){
    LocalTickers = JSON.parse(localStorage['LocalTickers']);
    i = LocalTickers.indexOf(ticker);
    if (i != -1){
      LocalTickers.splice(i,1);
      localStorage['LocalTickers'] = JSON.stringify(LocalTickers);
    }
  },
  GetStocks : function(tickers){

    for(i in tickers){
      this.GetStock(tickers[i]);
    }
  },
  GetStock : function(ticker){     
    var requestQuery = 'http://dev.markitondemand.com/Api/Quote/jsonp?symbol=' + ticker;
    var req = new XMLHttpRequest();
    req.open("GET", requestQuery);
    req.onload = function(e) {
      var data = e.currentTarget.responseText.split('(function () { })(')[1];
      data = data.slice(0,data.length-1);
      StockGenerator.AddTickerToContainer(data);
    }
    req.send(null);

  },

  AddTickerToContainer : function(jsonResponse) {
 
    var TickersContainer = document.getElementById('TickersContainer');
    if(typeof o == 'undefined'){
      var div = document.createElement('div');
      div.id = "TickersContainer";
      document.body.appendChild(div);
      TickersContainer = document.getElementById('TickersContainer');      
    }

    o = JSON.parse(jsonResponse);
    q = o.Data

    var TickerItemDiv = document.createElement('div');
    TickerItemDiv.className = 'QuoteItem';
    TickerItemDiv.setAttribute('ticker',q.Symbol);
    TickerItemDiv.appendChild(this.CreateDOMElement('div','ticker', q.Symbol));             
    TickerItemDiv.appendChild(this.CreateDOMElement('div','LastTradePrice', q.LastPrice.toFixed(2)));   

    var ChangeInPercentClass = 'ChangeInPercent';
    if (parseFloat(q.ChangePercent.toFixed(3)) == 0) {
      ChangeInPercentClass += ' gray';
    } else if (parseFloat(q.ChangePercent.toFixed(3)) > 0) {
      ChangeInPercentClass += ' green';
    } else {
      ChangeInPercentClass += ' red';
    }
    var ChangeFormatted = ((q.Change.toFixed(3) > 0 && q.Change.toFixed(3) < 0.010) || (q.Change.toFixed(3) < 0 && q.Change.toFixed(3) > -0.010)  ? q.Change.toFixed(3) : q.Change.toFixed(2));
    var ChangePercentFormatted = ((q.ChangePercent.toFixed(3) > 0 && q.ChangePercent.toFixed(3) < 0.010) || (q.ChangePercent.toFixed(3) < 0 && q.ChangePercent.toFixed(3) > -0.010)  ? q.ChangePercent.toFixed(3) : q.ChangePercent.toFixed(2));
    TickerItemDiv.appendChild(this.CreateDOMElement('div',ChangeInPercentClass, (parseFloat(ChangePercentFormatted) > 0 ? "+" : "") + ChangeFormatted + " ( " + (parseFloat(ChangePercentFormatted) > 0 ? "+" : "") + ChangePercentFormatted + "% ) "));        
    
    var img = this.CreateDOMElement('img');
    img.setAttribute('ticker',q.Symbol);
    img.src = 'icon_remove.png';
    img.width = 15;
    img.onclick = function(){
      this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
      StockGenerator.RemoveLocalTicker(this.getAttribute('ticker'));
    }

    var removeDiv = this.CreateDOMElement('div','cancel');
    removeDiv.appendChild(img);

    TickerItemDiv.appendChild(removeDiv);      
    TickersContainer.appendChild(TickerItemDiv); 
    StockGenerator.SortTickersContainer();
  },

  SortTickersContainer : function(){
    var TickersContainer = document.getElementById('TickersContainer');
    var TickerItems = TickersContainer.childNodes;
    var TickerItemsArray = [];

    for(i in TickerItems){
      if(TickerItems[i].nodeType == 1)
        TickerItemsArray.push(TickerItems[i]);
    }

    TickerItemsArray.sort( 
      function(a,b){
        return a.innerHTML == b.innerHTML
          ? 0
          : (a.innerHTML > b.innerHTML ? 1 : -1);
      }
    );
    for(i in TickerItemsArray){
      TickersContainer.appendChild(TickerItemsArray[i]);
    }
  },

  DestroyTickersContainer : function(){
    document.body.removeChild(document.getElementById('TickersContainer'));
  },
  
  CreateDOMElement : function(otype, oclass, oinnerHTML){
    var o = document.createElement(otype);
    if(typeof oclass != 'undefined')
      o.className = oclass;
    if(typeof oinnerHTML != 'undefined')
      o.innerHTML = oinnerHTML;

    return o;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  StockGenerator.init();
});
