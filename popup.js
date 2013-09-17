

var StockGenerator = 
{
  init : function(){
    this.GetStockWithSpecialTags('\"EVHC\",\"YHOO\",\"AAPL\"',"snd1l1yr");    
  },

  GetStockWithSpecialTags : function(quoteList,tags){
    var requestURL = "http://finance.yahoo.com/d/quotes.csv?s=" + quoteList + "&f="+ tags;    
    var requestQuery = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from yahoo.finance.quotes where symbol IN (' + quoteList + ')') + '&format=json&env=http://datatables.org/alltables.env';
    var req = new XMLHttpRequest();
    req.open("GET", requestQuery);

    req.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    req.setRequestHeader('Accept-Language', 'en-US,en;q=0.8');

    req.onload = function(e) {
      StockGenerator.SendStock(e.currentTarget.responseText);
    }
    req.send(null);

    // StockGenerator.SendStock();

  },
  SendStock : function(jsonResponse) {
    // remove this - testing purposes
    // jsonResponse = '{"query":{"count":2,"created":"2013-09-17T05:52:37Z","lang":"en-US","results":{"quote":[{"symbol":"EVHC","Ask":null,"AverageDailyVolume":"1056990","Bid":null,"AskRealtime":"29.13","BidRealtime":"23.00","BookValue":"4.15","Change_PercentChange":"-1.06 - -3.72%","Change":"-1.06","Commission":null,"ChangeRealtime":"-1.06","AfterHoursChangeRealtime":"N/A - N/A","DividendShare":"0.00","LastTradeDate":"9/16/2013","TradeDate":null,"EarningsShare":"0.248","ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":"0.00","EPSEstimateNextYear":"0.00","EPSEstimateNextQuarter":"0.00","DaysLow":"27.14","DaysHigh":"28.44","YearLow":"24.62","YearHigh":"28.88","HoldingsGainPercent":"- - -","AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":"N/A - N/A","HoldingsGainRealtime":null,"MoreInfo":"npiIed","OrderBookRealtime":null,"MarketCapitalization":"4.779B","MarketCapRealtime":null,"EBITDA":"432.0M","ChangeFromYearLow":"+2.83","PercentChangeFromYearLow":"+11.49%","LastTradeRealtimeWithTime":"N/A - <b>27.45</b>","ChangePercentRealtime":"N/A - -3.72%","ChangeFromYearHigh":"-1.43","PercebtChangeFromYearHigh":"-4.95%","LastTradeWithTime":"Sep 16 - <b>27.45</b>","LastTradePriceOnly":"27.45","HighLimit":null,"LowLimit":null,"DaysRange":"27.14 - 28.44","DaysRangeRealtime":"N/A - N/A","FiftydayMovingAverage":"26.433","TwoHundreddayMovingAverage":"26.433","ChangeFromTwoHundreddayMovingAverage":"+1.017","PercentChangeFromTwoHundreddayMovingAverage":"+3.85%","ChangeFromFiftydayMovingAverage":"+1.017","PercentChangeFromFiftydayMovingAverage":"+3.85%","Name":"Envision Healthca","Notes":null,"Open":"28.22","PreviousClose":"28.51","PricePaid":null,"ChangeinPercent":"-3.72%","PriceSales":"0.79","PriceBook":"6.87","ExDividendDate":null,"PERatio":"114.96","DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":null,"PriceEPSEstimateCurrentYear":null,"PriceEPSEstimateNextYear":null,"Symbol":"EVHC","SharesOwned":null,"ShortRatio":null,"LastTradeTime":"4:04pm","TickerTrend":"&nbsp;++==-+&nbsp;","OneyrTargetPrice":null,"Volume":"566454","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"24.62 - 28.88","DaysValueChange":"- - -3.72%","DaysValueChangeRealtime":"N/A - N/A","StockExchange":"NYSE","DividendYield":null,"PercentChange":"-3.72%"},{"symbol":"YHOO","Ask":"29.65","AverageDailyVolume":"16650000","Bid":null,"AskRealtime":"29.65","BidRealtime":"0.00","BookValue":"12.966","Change_PercentChange":"+0.36 - +1.23%","Change":"+0.36","Commission":null,"ChangeRealtime":"+0.36","AfterHoursChangeRealtime":"N/A - N/A","DividendShare":"0.00","LastTradeDate":"9/16/2013","TradeDate":null,"EarningsShare":"3.632","ErrorIndicationreturnedforsymbolchangedinvalid":null,"EPSEstimateCurrentYear":"1.47","EPSEstimateNextYear":"1.67","EPSEstimateNextQuarter":"0.41","DaysLow":"29.51","DaysHigh":"30.04","YearLow":"15.55","YearHigh":"30.27","HoldingsGainPercent":"- - -","AnnualizedGain":null,"HoldingsGain":null,"HoldingsGainPercentRealtime":"N/A - N/A","HoldingsGainRealtime":null,"MoreInfo":"cn","OrderBookRealtime":null,"MarketCapitalization":"30.222B","MarketCapRealtime":null,"EBITDA":"1.284B","ChangeFromYearLow":"+14.07","PercentChangeFromYearLow":"+90.48%","LastTradeRealtimeWithTime":"N/A - <b>29.62</b>","ChangePercentRealtime":"N/A - +1.23%","ChangeFromYearHigh":"-0.65","PercebtChangeFromYearHigh":"-2.15%","LastTradeWithTime":"Sep 16 - <b>29.62</b>","LastTradePriceOnly":"29.62","HighLimit":null,"LowLimit":null,"DaysRange":"29.51 - 30.04","DaysRangeRealtime":"N/A - N/A","FiftydayMovingAverage":"27.952","TwoHundreddayMovingAverage":"25.8476","ChangeFromTwoHundreddayMovingAverage":"+3.7724","PercentChangeFromTwoHundreddayMovingAverage":"+14.59%","ChangeFromFiftydayMovingAverage":"+1.668","PercentChangeFromFiftydayMovingAverage":"+5.97%","Name":"Yahoo! Inc.","Notes":null,"Open":"29.63","PreviousClose":"29.26","PricePaid":null,"ChangeinPercent":"+1.23%","PriceSales":"6.19","PriceBook":"2.26","ExDividendDate":null,"PERatio":"8.06","DividendPayDate":null,"PERatioRealtime":null,"PEGRatio":"1.74","PriceEPSEstimateCurrentYear":"19.90","PriceEPSEstimateNextYear":"17.52","Symbol":"YHOO","SharesOwned":null,"ShortRatio":"1.80","LastTradeTime":"4:00pm","TickerTrend":"&nbsp;==+===&nbsp;","OneyrTargetPrice":"29.38","Volume":"15817078","HoldingsValue":null,"HoldingsValueRealtime":null,"YearRange":"15.55 - 30.27","DaysValueChange":"- - +1.23%","DaysValueChangeRealtime":"N/A - N/A","StockExchange":"NasdaqNM","DividendYield":null,"PercentChange":"+1.23%"}]}}}';

    var div = document.createElement('div');
    o = JSON.parse(jsonResponse);
    q = o.query.results.quote
    for(var i=0; i< q.length; i++){

      var QuoteItemDiv = document.createElement('div');

      QuoteItemDiv.className = 'QuoteItem';      

      QuoteItemDiv.innerHTML += "<div class='ticker'>" + q[i].symbol + "</div>";
      
      var ChangeInPercentClass = 'ChangeInPercent';
      var changeInPercent = q[i].ChangeinPercent.split('%')[0];
      if (parseInt(changeInPercent) == 0) {
        ChangeInPercentClass += ' gray';
      } else if (parseInt(changeInPercent) > 0) {
        ChangeInPercentClass += ' red';
      } else {
        ChangeInPercentClass += ' green';
      }
      
      QuoteItemDiv.innerHTML += "<div class='LastTradePrice'>" + q[i].LastTradePriceOnly + "</div>";        
      QuoteItemDiv.innerHTML += "<div class='" + ChangeInPercentClass + "'>" + q[i].Change + " ( " + q[i].ChangeinPercent + " )</div>";        

      
      
      div.appendChild(QuoteItemDiv);
      
    }

    document.body.appendChild(div);
  }

}

document.addEventListener('DOMContentLoaded', function () {
  StockGenerator.init();
});
