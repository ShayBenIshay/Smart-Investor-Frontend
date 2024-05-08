import { loadTickersList } from './js-load-tickers.js';
import { buyPaper,sellPaper,deposit,withdrawal,setCostInput } from './smart-investor.js';
import { resetValues } from './variables.js';
//event listeners from smart-investor.js
document.querySelector('.js-buy-button').addEventListener('click', async () => await buyPaper());
document.querySelector('.js-sell-button').addEventListener('click', () => sellPaper());
document.querySelector('.js-deposit').addEventListener('click', () => deposit());
document.querySelector('.js-withdrawal').addEventListener('click', () => withdrawal());
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
document.querySelector('.js-wallet-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      deposit();
    }
});
document.querySelector('.js-wallet-input').addEventListener("input", () => {
  const walletInputElement = document.querySelector('.js-wallet-input');
  const walletInputStr = walletInputElement.value;
  // console.log(walletInputStr);
  // if (walletInputStr.includes('-')) {
  //   console.log('includes - ');
  //   walletInputElement.value = walletInputStr.replace('-', '');
  // }

  const walletInput = Number(walletInputStr);
  if (walletInput <= 0) {
      walletInputElement.value = '';
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