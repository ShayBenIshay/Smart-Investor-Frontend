import { tradeHistoryList } from './variables.js';
import { undoTrade } from './smart-investor.js';

console.log('trade-history.js');
renderTradeHistoryListHTML();

export function updateTradeHistoryList(type,ticker,cost,papers) {
    if (type==='sold') {
        tradeHistoryList.push({
            type: 'sold',
            ticker,
            cost,
            papers
        });
    } else if (type==='bought') {
        tradeHistoryList.push({
            type: 'bought',
            ticker,
            cost,
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
        const { type, ticker, cost, papers } = tradeHistoryObject;
        const html = `
        <div class="${type}-row">${type}</div>
        <div class="${type}-row">${ticker}</div>
        <div class="${type}-row">${papers}</div>
        <div class="${type}-row">$${cost}</div>
        <button id="js-undo-${index}" class="undo-button">Undo</button>
        `;
        tradeHistoryListHTML += html;
    });

    document.querySelector('.js-trade-list').innerHTML = tradeHistoryListHTML;    
    
    tradeHistoryList.forEach((tradeHistoryObject,index) => {
        const { ticker, cost, papers } = tradeHistoryObject;
        document.getElementById(`js-undo-${index}`).addEventListener('click', () => {
            undoTrade(ticker,-papers,cost,index);
        });
    });
}