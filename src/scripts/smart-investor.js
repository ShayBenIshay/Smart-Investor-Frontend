// import { wallet } from './variables.js';
import { polygonAPIKey } from "../api-token.js"
import { updateTradeHistoryList,removeTradeHistoryObject } from './trade-history.js';
import { updateWallet,validateWalletLiquid,validatePapersInWallet } from './wallet.js';
import { renderPortfolio,renderTradeHistoryListHTML,renderWallet } from './render-HTML-elements.js';
import { validateDateFormat,validateTicker,recalculateAvgPrice,clearInputElements, fetchInput } from './helper-functions.js';
import { fetchPriceWithDate } from './tickers-prices-cache.js';

export function sellPaper() {
    let { ticker,dateFormat,price,papers} = fetchInput();
    if (ticker==='' || dateFormat==='' || price===0 || papers===0) {
        return;
    }
    if (!validatePapersInWallet(ticker,papers)){
        console.error('Not enought papers in your waller');
        return;
    } 
    clearInputElements();
    executeTrade('sold',dateFormat,ticker,-papers,price)
}

export async function buyPaper() {
    let { ticker,dateFormat,price,papers } = fetchInput() || {ticker: '',dateFormat:'',price: 0,papers: 0};
    if (ticker==='' || dateFormat==='' || price===0 || papers===0) {
        return;
    }
    if (!validateWalletLiquid(papers,price) || !validateDateFormat(dateFormat)) {
        return;
    }

    clearInputElements();
    await executeTrade('bought',dateFormat,ticker,papers,price);
}

export async function executeTrade(type,dateFormat,ticker,papers,price) {
    updateTradeHistoryList(type,dateFormat,ticker,price,papers);
    renderTradeHistoryListHTML(); 
    updateWallet(ticker,papers,price);
    renderWallet();
    renderPortfolio();
}

export async function getPriceWithDateAPI(ticker,dateFormat) {
    const response = await fetch(`https://api.polygon.io/v1/open-close/${ticker}/${dateFormat}?adjusted=true&apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.close;    
}

export async function getLastClosingAPI(ticker) {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        console.error('Network response was not ok');
        return -1;
    }
    const data = await response.json();
    return data.results[0].c;    
}

export async function setPriceInput(ticker,dateFormat) {
    if (!validateTicker(ticker) || !validateDateFormat(dateFormat)) {
        return;
    }
    const price = await fetchPriceWithDate(ticker,dateFormat);
    document.querySelector('.js-price-input').value = price;

}

export function undoTrade(ticker,papers,price,index) {
    if (papers<0 && !validatePapersInWallet(ticker,-papers)) {
        console.error('Not enought papers in your waller');
        return; 
    }
    removeTradeHistoryObject(index);
    updateWallet(ticker,papers,price);
    recalculateAvgPrice(ticker);
    renderWallet();
    renderPortfolio();
    renderTradeHistoryListHTML();    
}