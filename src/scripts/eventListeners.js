import { loadTickersList } from './js-load-tickers.js';
import { buyPaper,sellPaper,deposit,setCostInput } from './smart-investor.js';
import { resetValues } from './variables.js';

console.log('eventListeners.js');

//event listeners from smart-investor.js
document.querySelector('.js-buy-button').addEventListener('click', async () => await buyPaper());
document.querySelector('.js-sell-button').addEventListener('click', () => sellPaper());
document.querySelector('.js-deposit').addEventListener('click', () => deposit());
document.querySelector('.js-reset').addEventListener('click', () => resetValues());
document.querySelectorAll('.js-cost-input, .js-papers-input').forEach(element => {
  element.addEventListener('keydown', function(event) {
    if (event.key === 'b') {
      buyPaper();
    }
    if (event.key === 's') {
      sellPaper();
    }
  });
});
document.querySelector('.js-deposit-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deposit();
    }
});
document.querySelector('.js-ticker-input').addEventListener('change', function() {
    let selectedValue = this.value; // Get the value of the selected option
    // Call your function here, passing the selected value if needed
    setCostInput(selectedValue);
});

//event listener from js-load-tickers.js
// Fetch stock data when the webpage loads
window.addEventListener('load', () => {
    loadTickersList();
});