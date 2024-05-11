import { tradeHistoryList } from './variables.js';

export function updateTradeHistoryList(type,dateFormat,ticker,price,papers) {
    if (type==='sold') {
        tradeHistoryList.push({
            type: 'sold',
            dateFormat,
            ticker,
            price,
            papers
        });
    } else if (type==='bought') {
        tradeHistoryList.push({
            type: 'bought',
            dateFormat,
            ticker,
            price,
            papers
        });
    }
    localStorage.setItem('tradeHistoryList',JSON.stringify(tradeHistoryList));
}

export function removeTradeHistoryObject(index) {
    tradeHistoryList.splice(index,1);
    localStorage.setItem('tradeHistoryList',JSON.stringify(tradeHistoryList));
}