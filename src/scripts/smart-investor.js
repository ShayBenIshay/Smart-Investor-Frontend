import { tradeHistoryList,wallet,tickersPricesCache } from './variables.js';
import { polygonAPIKey } from "../api-token.js"
import { updateTradeHistoryList,removeTradeHistoryObject,renderTradeHistoryListHTML } from './trade-history.js';
import { updateWallet,renderWallet,validatePapersInWallet } from './wallet.js';

// script:
await renderPortfolio();

//fucntions
export function sellPaper() {
    let { ticker,cost,papers} = fetchInput();
    if (cost===0 || ticker==='' || papers===0) {
        return;
    }
    if (!validatePapersInWallet(ticker,papers)){
        console.error('Not enought papers in your waller');
        return;
    } 
    clearInputElements();
    executeTrade('sold',ticker,-papers,cost)
}

export async function buyPaper() {
    let { ticker,cost,papers } = fetchInput() || {ticker: '',cost: 0,papers: 0};
    if (ticker==='' || cost===0 || papers===0) {
        return;
    }
    if (wallet.liquid < papers*cost) {
        console.error(`Cannot buy ${papers} papers for $${cost} it is more then $${wallet.liquid.toFixed(2)} liquid in your wallet`);
        return;
    }

    clearInputElements();
    await executeTrade('bought',ticker,papers,cost);
}

export async function executeTrade(type,ticker,papers,cost) {
    await fetchRealTimePrice(ticker); 
    updateTradeHistoryList(type,ticker,cost,papers);
    renderTradeHistoryListHTML(); 
    updateWallet(ticker,papers,cost);
    renderWallet();
    renderPortfolio();
}

async function fetchRealTimePrice(ticker) {
    const { isUpToDate, index } = checkInCache(ticker);
    let price;
    if (!isUpToDate) {
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
    // console.log(isUpToDate);
    return { isUpToDate,index };
}

function upToDate(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

async function getLastClosingAPI(ticker) {
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results[0].c;    
}

export async function setCostInput(ticker) {
    if (!validateTicker(ticker)) {
        return;
    }
    const cost = await fetchRealTimePrice(ticker);
    document.querySelector('.js-cost-input').value = cost;

}

function validateTicker(ticker) {
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
    let costElement = document.querySelector('.js-cost-input');
    let cost = Number(costElement.value);
    let papersElement = document.querySelector('.js-papers-input');
    let papers = Number(papersElement.value);

    if (!validateTicker(ticker)) {
        console.error('Not a valid ticker');
        return;
    }

    return {
        ticker,
        cost,
        papers
    };
}

export function clearInputElements() {
    document.querySelector('.js-ticker-input').value = '';
    document.querySelector('.js-cost-input').value = '';
    document.querySelector('.js-papers-input').value = '';
    
}

function recalculateAvgPrice(tickerRecalculate) {
    let totalCost=0,totalPapers=0;
    tradeHistoryList.forEach(tradeHistoryObject => {
        const { type,ticker,cost,papers } = tradeHistoryObject;
        if (ticker===tickerRecalculate && type==='bought') {
            totalCost+=(cost*papers);
            totalPapers+=papers;
        }
    });
    for (let i=0; i<wallet.assets.length; i++) {
        const assetObject = wallet.assets[i];
        if (assetObject.ticker===tickerRecalculate) {
            assetObject.avgBuyPrice=totalCost/totalPapers;
            return;
        }
    }
}

//function undoTrade(ticker,papers,cost,index) {
export function undoTrade(ticker,papers,cost,index) {
    if (papers<0 && !validatePapersInWallet(ticker,-papers)) {
        console.error('Not enought papers in your waller');
        return; 
    }
    removeTradeHistoryObject(index);
    updateWallet(ticker,papers,cost);
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
        <div ${portfolioProfitClassHTML}>${avgBuyPrice}</div> 
        <div ${portfolioProfitClassHTML}>${currentPrice.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>${plusHTML}${percentage.toFixed(2)}%</div>
        `;
        assetsListHTML +=html;
    }
    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}