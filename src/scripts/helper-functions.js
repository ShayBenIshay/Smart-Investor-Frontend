import { transactionHistoryList,wallet } from "./variables.js";
//Dates
export function getYesterdayFormat() {
    let todayDate = new Date();
    let yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const yesterdayFormat = yesterdayDate.toISOString().substring(0, 10); 
    return yesterdayFormat;
}

export function compareDates(dateStr1, dateStr2) {
    return new Date(dateStr2) - new Date(dateStr1);
}

//Validations
export function validateDateFormat(dateFormat) {
    let dateParts = dateFormat.split("-");
    let dateObject = new Date(dateParts[0],dateParts[1]-1,dateParts[2]);
    if (dateObject.getDay() === 0 || dateObject.getDay()===6) {
        const day = dateObject.getDay()===0 ? 'Sunday' : 'Saturday';
        console.error(`${day} is not a trading day`);
        return false;
    }
    return true;
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

//Calculations
export function recalculateAvgPrice(tickerRecalculate) {
    let totalPrice=0,totalPapers=0;
    transactionHistoryList.forEach(transactionHistoryObject => {
        const { type,ticker,price,papers } = transactionHistoryObject;
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

//HTML Elements
export function clearInputElements() {
    document.querySelector('.js-ticker-input').value = '';
    document.querySelector('.js-date-input').value = '';
    document.querySelector('.js-price-input').value = '';
    document.querySelector('.js-papers-input').value = '';
    
}

export function fetchInput() {
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