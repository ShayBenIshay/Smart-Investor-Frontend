import { loadTickersList } from './js-load-tickers.js';
import { buyPaper,sellPaper,setPriceInput } from './smart-investor.js';
import { resetValues } from './variables.js';
import { deposit,withdrawal } from './wallet.js';
import { getYesterdayFormat } from './helper-functions.js';

//event listeners from smart-investor.js
document.querySelector('.js-buy-button').addEventListener('click', async () => await buyPaper());
document.querySelector('.js-sell-button').addEventListener('click', () => sellPaper());
document.querySelector('.js-deposit').addEventListener('click', () => deposit());
document.querySelector('.js-withdrawal').addEventListener('click', () => withdrawal());
document.querySelector('.js-reset').addEventListener('click', () => resetValues());
document.querySelectorAll('.js-price-input, .js-papers-input').forEach(element => {
  element.addEventListener('keydown', function(event) {
    if (event.key === 'b') {
      buyPaper();
    }
    if (event.key === 's') {
      sellPaper();
    }
  });
});
document.querySelector('.js-wallet-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deposit();
    }
});
document.querySelector('.js-wallet-input').addEventListener("input", () => {
  const walletInputElement = document.querySelector('.js-wallet-input');
  const walletInputStr = walletInputElement.value;
  const walletInput = Number(walletInputStr);
  if (walletInput <= 0) {
      walletInputElement.value = '';
  }
});
document.querySelector('.js-ticker-input').addEventListener('change', () => {
  const dateInputElement = document.querySelector('.js-date-input');
  
  if (dateInputElement.value==='') {
    const yesterdayFormat = getYesterdayFormat();
    dateInputElement.value = yesterdayFormat;  
  }
//for now i will not fetch the real price before the date input has entered
// const tickerInput = document.querySelector('.js-ticker-input').value;
    // setPriceInput(tickerInput,dateInputElement.value);
});

document.querySelector('.js-date-input').addEventListener('blur', () => {
  const tickerInputElement = document.querySelector('.js-ticker-input');
  const tickerInput = tickerInputElement.value;
  if (tickerInput==='') {
    return;
  }
  const dateInputElement = document.querySelector('.js-date-input');
  const dateFormat = dateInputElement.value;
  setPriceInput(tickerInput,dateFormat);
});

//event listener from js-load-tickers.js
// Fetch stock data when the webpage loads
window.addEventListener('load', () => {
    loadTickersList();
});