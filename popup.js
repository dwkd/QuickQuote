
var StockGenerator = 
{
  init : function(){
    StockGenerator.CreateTickersContainer();
    StockGenerator.CreateTickerInputContainer();
    StockGenerator.GetStocks(this.GetLocalTickers());
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

      StockGenerator.GetStock(ticker,true);      
    } else {
      // StockGenerator.RemoveTickersFade();
      var e = document.getElementById('ticker_'+ticker);
      e.classList.remove('bgFade');
      setTimeout(function(){ e.classList.add('bgFade'); },1)
    }
    StockGenerator.DestroyTickerInputContainer();
    StockGenerator.CreateTickerInputContainer();
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
      StockGenerator.GetStock(tickers[i],false);
    }
  },
  GetStock : function(ticker,useFade){     
    var requestQuery = 'http://dev.markitondemand.com/Api/Quote/jsonp?symbol=' + ticker;
    var req = new XMLHttpRequest();
    req.open("GET", requestQuery);
    req.onload = function(e) {
      var data = e.currentTarget.responseText.split('(function () { })(')[1];
      data = data.slice(0,data.length-1);
      if(typeof JSON.parse(data).Message == 'undefined') {
        StockGenerator.AddTickerToContainer(data,useFade);        
      } else {
        alert('Invalid ticker: '+ticker);
        StockGenerator.RemoveLocalTicker(ticker);
      }
    }
    req.send(null);

  },

  CreateTickersContainer : function(){
    var div = document.createElement('div');
    div.id = "TickersContainer";
    document.body.appendChild(div);     
  },

  AddTickerToContainer : function(jsonResponse,useFade) {
 
    var TickersContainer = document.getElementById('TickersContainer');    

    o = JSON.parse(jsonResponse);
    q = o.Data

    var TickerItemDiv = document.createElement('div');
    TickerItemDiv.className = 'QuoteItem' + (useFade ? ' bgFade' : '');
    TickerItemDiv.setAttribute('ticker',q.Symbol);
    TickerItemDiv.id = 'ticker_' + q.Symbol;
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
    StockGenerator.RemoveTickersFade();
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

  RemoveTickersFade : function(){
    var TickersContainer = document.getElementById('TickersContainer');
    var TickerItems = TickersContainer.childNodes;


    for(i in TickerItems){
      if(TickerItems[i].nodeType == 1)
        TickerItems[i].classList.remove('bgFade');
    }
  },

  DestroyTickersContainer : function(){
    document.body.removeChild(document.getElementById('TickersContainer'));
  },
  
  CreateTickerInputContainer : function(){
    var div = StockGenerator.CreateDOMElement("div","TickerInputContainer");
    div.id = "TickerInputContainer";
    
    var input = StockGenerator.CreateDOMElement("input","TickerInput");
    input.value = "Search or Get Quote";
    
    var img = StockGenerator.CreateDOMElement("img","AddButton");
    img.src = "icon_add.png";
    img.onclick = function(){
      StockGenerator.AddLocalTicker(input.value);
    }

    input.onfocus = function(){
      this.value = this.value == "Search or Get Quote" ? "" : this.value;
    }

    input.onblur = function(){
      if(this.value == ""){
        this.value = 'Search or Get Quote';
        StockGenerator.DestroyTickerInputContainer();
        StockGenerator.CreateTickerInputContainer();
      }
    }

    input.onkeyup = function(){
      if(this.value != ""){
        var req = new XMLHttpRequest();
        req.open("GET", "http://dev.markitondemand.com/Api/Lookup/jsonp?input=" + this.value);
        req.onload = function(e) {
          var data = e.currentTarget.responseText.split('(function () { })(')[1];
          data = data.slice(0,data.length-1);     
          StockGenerator.ShowTypeAhead(JSON.parse(data)[0]);
        }
        req.send(null);
      }
    }

    div.appendChild(input);
    div.appendChild(img);
    document.body.appendChild(div);
  },

  DestroyTickerInputContainer : function(){
    document.body.removeChild(document.getElementById('TickerInputContainer'));
  },

  ShowTypeAhead : function(o){
    var TypeAheadDiv = StockGenerator.CreateDOMElement("div","TypeAheadContainer");
    var TypeAheadCompanyName = StockGenerator.CreateDOMElement("div","TypeAheadCompanyName");
    var TypeAheadTickerValue = StockGenerator.CreateDOMElement("div","TypeAheadTickerValue");

    TypeAheadDiv.id = "TypeAheadDiv";
    if(typeof o != 'undefined') {
      TypeAheadDiv.onclick = function(){
        StockGenerator.AddLocalTicker(o.Symbol);      
      }
      
      TypeAheadCompanyName.innerHTML = o.Name.substr(0,23) + (o.Name.length > 23 ? '...' : '');
      TypeAheadTickerValue.innerHTML = o.Symbol;
    } else {
      TypeAheadCompanyName.innerHTML = 'Invalid Company Name or Ticker';
      TypeAheadCompanyName.style.fontStyle = 'italic';
      TypeAheadCompanyName.style.color = 'red';
      TypeAheadCompanyName.style.width = '200px';
      TypeAheadTickerValue.style.width = '10px';
    }

    TypeAheadDiv.appendChild(TypeAheadCompanyName);
    TypeAheadDiv.appendChild(TypeAheadTickerValue);
    document.getElementById('TickerInputContainer').appendChild(TypeAheadDiv);
  },

  DestroyTypeAhead : function(){
    var o = document.getElementById('TypeAheadDiv');
    document.getElementById('TickerInputContainer').removeChild(o);

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
