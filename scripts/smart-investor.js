import { tradeHistoryList,wallet,tickersPricesCache } from './variables.js';
import { polygonAPIKey, polygonKeyId } from "../api-token.js"
import { updateTradeHistoryList,removeTradeHistoryObject,renderTradeHistoryListHTML } from './trade-history.js';
import { updateWallet,renderWallet,validatePapersInWallet } from './wallet.js';

// script:
renderPortfolio();

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

    clearInputElements();

    await executeTrade('bought',ticker,papers,cost);
}

export async function executeTrade(type,ticker,papers,cost) {
    updateTradeHistoryList(type,ticker,cost,papers);
    renderTradeHistoryListHTML(); 
    updateWallet(ticker,papers,cost);
    await updateTickersPricesCache(ticker); 
    renderWallet();
    renderPortfolio();
}

//return the updated price of the ticker
async function updateTickersPricesCache(ticker) {
    const { isUpToDate, index } = isPriceUpToDate(ticker);
    let price;
    if (!isUpToDate) {
        price = await fetchTickerPrice(ticker);
        const date = new Date();
        if (index>=0) {
            // tickersPricesCache.splice(index,1);
            tickersPricesCache[index].price = price;
            tickersPricesCache[index].date = date;
        } else {
            tickersPricesCache.push({ticker,price,date});
        }
        localStorage.setItem('tickersPricesCache',JSON.stringify(tickersPricesCache));

    } else {
        price = tickersPricesCache[index].price;
    }
    return price;
}

//if this function returns {_,-1} ticker not found
//if returned {false,index>=0} index is in cache but the price is not from this day
//if returned {true,index>=0} it is up to date
function isPriceUpToDate(ticker) {
    let isUpToDate=false;
    let index=-1
    tickersPricesCache.forEach((tickerPriceObject,i) => {
        if (tickerPriceObject.ticker===ticker) {
            index = i;
            // if (isToday(tickerPriceObject.date)) {
            if (true) {
                    isUpToDate = true;
            }
        }
    });

    return { isUpToDate,index };
}

async function fetchTickerPrice(ticker) {
    const formattedDate = getDateFormatted();
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedDate}/${formattedDate}?apiKey=${polygonAPIKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results[0].c;
}

function isToday(date) {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

function getDateFormatted() {
    const date = new Date();
    let day = date.getDate(),month = date.getMonth(), year = date.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}`;
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

function clearInputElements() {
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
            assetObject.avgPaperPrice=totalCost/totalPapers;
            return;
        }
    }
}


//function undoTrade(ticker,papers,cost,index) {
export function undoTrade(ticker,papers,cost,index) {
    // document.getElementById(`js-undo-${index}`).removeEventListener('click',() => {
    //      undoTrade(ticker,-papers,cost,index);
    // });
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
    const depositInputElement = document.querySelector('.js-deposit-input');
    const deposit = Number(depositInputElement.value);

    if (deposit===0) {
        console.error('Empty deposit');
        return;
    }

    wallet.liquid += deposit;
    localStorage.setItem('wallet',JSON.stringify(wallet));
    renderWallet();
    depositInputElement.value = '';
}

//rendering functions
async function renderPortfolio() {
    let assetsListHTML = '';

    for (let i=0; i<wallet.assets.length; i++) {
        const { ticker, papers, avgPaperPrice } = wallet.assets[i];
        // const currentPrice = await getUpdatedPrice(ticker);
        const currentPrice = await updateTickersPricesCache(ticker);
        const percentage = (currentPrice/avgPaperPrice - 1)*100;
        let plus='';
        if (percentage>0) {
            plus='+';
        }
        const html = `
        <div>${ticker}</div>
        <div>${papers}</div>
        <div>${avgPaperPrice.toFixed(2)}</div> 
        <div>${currentPrice.toFixed(2)}</div>
        <div>${plus}${percentage.toFixed(2)}%</div>
        `;
        assetsListHTML +=html;
    }
    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}