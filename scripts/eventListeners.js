import { prefetchedStockData,fetchStockData} from './js-load-tickers.js';
import { buyPaper,sellPaper,deposit } from './smart-investor.js';
import { isSavingExcessCalls,resetValues } from './variables.js';
//event listeners from smart-investor.js
document.querySelector('.js-buy-button').addEventListener('click', async () => await buyPaper());
document.querySelector('.js-sell-button').addEventListener('click', () => sellPaper());
document.querySelector('.js-deposit').addEventListener('click', () => deposit());
document.querySelector('.js-reset').addEventListener('click', () => resetValues());
document.querySelector('.js-cost-input').addEventListener('keydown', function(event) {
    if (event.key === 'b') {
      buyPaper();
    }
    if (event.key === 's') {
      sellPaper();
    }
  });
document.querySelector('.js-deposit-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deposit();
    }
  });

//event listener from js-load-tickers.js
// Fetch stock data when the webpage loads
window.addEventListener('load', () => {
    if (isSavingExcessCalls) {
      //using prefetched data to eliminate excess api calls
      prefetchedStockData();    
    } else {
      //using api call to fetch data
      fetchStockData();
    }

});