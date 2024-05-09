import { tradeHistoryList,wallet,tickersPricesCache } from './variables.js';
import { polygonAPIKey } from "../api-token.js"
import { updateTradeHistoryList,removeTradeHistoryObject,renderTradeHistoryListHTML } from './trade-history.js';
import { updateWallet,renderWallet,validatePapersInWallet } from './wallet.js';

// script:
await renderPortfolio();

//fucntions
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
    if (wallet.liquid < papers*price) {
        console.error(`Cannot buy ${papers} papers for $${price} it is more then $${wallet.liquid.toFixed(2)} liquid in your wallet`);
        return;
    }

    clearInputElements();
    await executeTrade('bought',dateFormat,ticker,papers,price);
}

export async function executeTrade(type,dateFormat,ticker,papers,price) {
    // await fetchRealTimePrice(ticker); //??
    updateTradeHistoryList(type,dateFormat,ticker,price,papers);
    renderTradeHistoryListHTML(); 
    updateWallet(ticker,papers,price);
    renderWallet();
    renderPortfolio();
}

async function fetchRealTimePrice(ticker) {
    const { isUpToDate, index } = checkInCache(ticker);
    let price;
    if (!isUpToDate) {
        console.log('fetching real time price');
        price = await getLastClosingAPI(ticker);
        const date = new Date();
        if (index>=0) {
            tickersPricesCache.splice(index,1);
        }
        tickersPricesCache.push({ticker,price,date});
        localStorage.setItem('tickersPricesCache',JSON.stringify(tickersPricesCache));    
    } else {
        price = tickersPricesCache[index].price;
    }
    return price;
}

async function fetchPriceWithDate(ticker,dateFormat) {
    // const { isUpToDate, index } = checkInCacheWithDate(ticker,dateFormat);
    // checkInCacheWithDate(ticker,dateFormat);
    let price = await getPriceWithDateAPI(ticker,dateFormat);
    // if (!isUpToDate) {
    //     // price = await getPriceWithDateAPI(ticker,dateFormat);
    //     // const date = new Date();
    //     // if (index>=0) {
    //         // tickersPricesCache.splice(index,1);
    //     // }
    //     // tickersPricesCache.push({ticker,price,date});
    //     // localStorage.setItem('tickersPricesCache',JSON.stringify(tickersPricesCache));    
    // } else {
    //     price = tickersPricesCache[index].price;
    // }
    return price;
}

//if this function returns {_,-1} ticker not found
//if returned {false,index>=0} index is in cache but the price is not from this day
//if returned {true,index>=0} it is up to date
function checkInCache(ticker) {
    let isUpToDate=false;
    let index=-1
    tickersPricesCache.forEach((tickerPriceObject,i) => {
        if (tickerPriceObject.ticker===ticker) {
            index = i;
            let tickerPriceDate = new Date(tickerPriceObject.date);
            if (upToDate(tickerPriceDate)) {
                isUpToDate = true;
            }
        }
    });
    return { isUpToDate,index };
}

function upToDate(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

async function getPriceWithDateAPI(ticker,dateFormat) {
    const response = await fetch(`https://api.polygon.io/v1/open-close/${ticker}/${dateFormat}?adjusted=true&apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.close;    
}

async function getLastClosingAPI(ticker) {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results[0].c;    
}

export async function setPriceInput(ticker,dateFormat) {
    if (!validateTicker(ticker)) {
        return;
    }
    // if (!validateDateFormat(dateFormat)) {
    //     return;
    // }
    const price = await fetchPriceWithDate(ticker,dateFormat);
    document.querySelector('.js-price-input').value = price;

}

export function validateTicker(ticker) {
    const tickerOptions = document.getElementById('ticker-options').getElementsByTagName('option');
    for (let i = 0; i < tickerOptions.length; i++) {
        if (ticker === tickerOptions[i].value) {
            return true;
        }
    }
    return false;
}

function fetchInput() {
    let tickerElement = document.querySelector('.js-ticker-input');
    let ticker = tickerElement.value;
    let dateElement = document.querySelector('.js-date-input');
    let dateFormat = dateElement.value;
    let priceElement = document.querySelector('.js-price-input');
    let price = Number(priceElement.value);
    let papersElement = document.querySelector('.js-papers-input');
    let papers = Number(papersElement.value);

    if (!validateTicker(ticker)) {
        console.error('Not a valid ticker');
        return;
    }
    //validate date?
    return {
        ticker,
        dateFormat,
        price,
        papers
    };
}

export function clearInputElements() {
    document.querySelector('.js-ticker-input').value = '';
    document.querySelector('.js-date-input').value = '';
    document.querySelector('.js-price-input').value = '';
    document.querySelector('.js-papers-input').value = '';
    
}

function recalculateAvgPrice(tickerRecalculate) {
    let totalPrice=0,totalPapers=0;
    tradeHistoryList.forEach(tradeHistoryObject => {
        const { type,ticker,price,papers } = tradeHistoryObject;
        if (ticker===tickerRecalculate && type==='bought') {
            totalPrice+=(price*papers);
            totalPapers+=papers;
        }
    });
    for (let i=0; i<wallet.assets.length; i++) {
        const assetObject = wallet.assets[i];
        if (assetObject.ticker===tickerRecalculate) {
            assetObject.avgBuyPrice=totalPrice/totalPapers;
            return;
        }
    }
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

export function deposit() {
    const walletInputElement = document.querySelector('.js-wallet-input');
    const deposit = Number(walletInputElement.value);

    if (deposit<=0) {
        console.error(`$${deposit} is not a valid deposit`);
        return;
    }

    wallet.liquid += deposit;
    localStorage.setItem('wallet',JSON.stringify(wallet));
    renderWallet();
    walletInputElement.value = '';
}

export function withdrawal() {
    const walletInputElement = document.querySelector('.js-wallet-input');
    const withdrawal = Number(walletInputElement.value);

    if (withdrawal<=0) {
        console.error(`$${withdrawal} is not a valid withdrawal`);
        return;
    }
    if (wallet.liquid - withdrawal < 0) {
        console.error(`Cannot withdrawal $${withdrawal} it is more then $${wallet.liquid.toFixed(2)} liquid in your wallet`)
        return;
    }
    wallet.liquid -= withdrawal;
    localStorage.setItem('wallet',JSON.stringify(wallet));
    renderWallet();
    walletInputElement.value = '';
}

//rendering functions
async function renderPortfolio() {
    let assetsListHTML = '';

    for (let i=0; i<wallet.assets.length; i++) {
        const { ticker,papers,avgBuyPrice } = wallet.assets[i];
        let currentPrice = await fetchRealTimePrice(ticker);
        let percentage = (currentPrice/avgBuyPrice - 1)*100;
        let totalAssetPrice = papers*avgBuyPrice;
        let totalAssetValue = papers*currentPrice;
        let totalAssetProfit = totalAssetValue-totalAssetPrice;
        let plusHTML='', portfolioProfitClassHTML='';
        if (percentage>0) {
            plusHTML='+';
            portfolioProfitClassHTML = `class = "portfolio-profit"`;
        } else if (percentage<0) {
            portfolioProfitClassHTML = 'class = "portfolio-loss"';
        } else {
            portfolioProfitClassHTML = 'class = "portfolio-neutral"'
        }
        const html = `
        <div ${portfolioProfitClassHTML}>${ticker}</div>
        <div ${portfolioProfitClassHTML}>${papers}</div>
        <div ${portfolioProfitClassHTML}>${avgBuyPrice.toFixed(2)}</div> 
        <div ${portfolioProfitClassHTML}>${currentPrice.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetPrice.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetValue.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetProfit.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>${plusHTML}${percentage.toFixed(2)}%</div>
        `;
        assetsListHTML +=html;
    }
    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}