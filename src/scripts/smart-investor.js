import { tradeHistoryList,wallet, tickersPricesCacheMap } from './variables.js';
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
    if (!validateDateFormat(dateFormat)) {
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

async function fetchRealTimePrice(ticker) {
    const yesterdayFormat = getYesterdayFormat();
    let price = checkInCacheWithDate(ticker,yesterdayFormat)
    if (price<0) {
        price = await getLastClosingAPI(ticker);
    }
    if (price>0) {
        if (!tickersPricesCacheMap.has(ticker)) {
            tickersPricesCacheMap.set(ticker,[]);
        }
        let exists = false;
        tickersPricesCacheMap.get(ticker).forEach( cacheObject => {
            let { dateFormat } = cacheObject;
            if (dateFormat===yesterdayFormat) {
                exists = true;
            }
        });
        if (!exists) {
            tickersPricesCacheMap.get(ticker).push({dateFormat: yesterdayFormat, price});
        }
        let cacheArray = Array.from(tickersPricesCacheMap);
        localStorage.setItem('tickersPricesCacheMap',JSON.stringify(cacheArray));        
    }
    return price;
}

async function fetchPriceWithDate(ticker,dateFormat) {
    const yesterdayFormat = getYesterdayFormat();
    let price = checkInCacheWithDate(ticker,yesterdayFormat);
    if (price<0) {
        price = await getPriceWithDateAPI(ticker,dateFormat);
    }
    return price;
}

function checkInCacheWithDate(tickerToCheck,dateFormatToCheck) {
    for (let [ticker, pricesArr] of tickersPricesCacheMap.entries()) {
        if (tickerToCheck===ticker) {
            for (let i=0; i<pricesArr.length; i++) {
                let { dateFormat,price } = pricesArr[i];
                if (dateFormatToCheck === dateFormat) {
                    return price;
                }
            }
            return -1;
        }
    }
    return -1;
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

function validateDateFormat(dateFormat) {
    let dateParts = dateFormat.split("-");
    let dateObject = new Date(dateParts[0],dateParts[1]-1,dateParts[2]);
    if (dateObject.getDay() === 0 || dateObject.getDay()===6) {
        const day = dateObject.getDay()===0 ? 'Sunday' : 'Saturday';
        console.error(`${day} is not a trading day`);
        return false;
    }
    return true;
}

export function getYesterdayFormat() {
    let todayDate = new Date();
    let yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const yesterdayFormat = yesterdayDate.toISOString().substring(0, 10); 
    return yesterdayFormat;
}


//rendering functions
async function renderPortfolio() {
    let assetsListHTML = '';

    for (let i=0; i<wallet.assets.length; i++) {
        const { ticker,papers,avgBuyPrice } = wallet.assets[i];
        let percentage,totalAssetValue,totalAssetProfit;
        let currentPrice = await fetchRealTimePrice(ticker);
        let totalAssetPrice = papers*avgBuyPrice;
        if (currentPrice != -1) {
            //api limit exceeded it's limit. show udnefined value
            percentage = ((currentPrice/avgBuyPrice - 1)*100).toFixed(2);
            totalAssetValue = (papers*currentPrice).toFixed(2);
            totalAssetProfit = (totalAssetValue-totalAssetPrice).toFixed(2);
        }
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
            <div ${portfolioProfitClassHTML}>${currentPrice}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetPrice.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetValue}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetProfit}</div>
        <div ${portfolioProfitClassHTML}>${plusHTML}${percentage}%</div>
        `;
        assetsListHTML +=html;
    }
    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}