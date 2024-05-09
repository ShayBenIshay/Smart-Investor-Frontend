import { tradeHistoryList } from './variables.js';
import { undoTrade } from './smart-investor.js';

renderTradeHistoryListHTML();

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

export function renderTradeHistoryListHTML() {
    let tradeHistoryListHTML = '';
    tradeHistoryList.forEach((tradeHistoryObject,index) => {
        const { type,dateFormat,ticker,price,papers } = tradeHistoryObject;
        const html = `
        <div>${dateFormat}:</div>
        <div class="${type}-row">${type}</div>
        <div class="${type}-row">${ticker}</div>
        <div class="${type}-row">${papers}</div>
        <div class="${type}-row">$${price}</div>
        <button id="js-undo-${index}" class="undo-button">Undo</button>
        `;
        tradeHistoryListHTML += html;
    });

    document.querySelector('.js-trade-list').innerHTML = tradeHistoryListHTML;    
    
    tradeHistoryList.forEach((tradeHistoryObject,index) => {
        const { ticker, price, papers } = tradeHistoryObject;
        document.getElementById(`js-undo-${index}`).addEventListener('click', () => {
            undoTrade(ticker,-papers,price,index);
        });
    });
}