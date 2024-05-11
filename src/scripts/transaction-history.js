import { transactionHistoryList } from './variables.js';
import { compareDates } from './helper-functions.js';

export function updateTransactionHistoryList(type,dateFormat,ticker,price,papers) {
    let newIndex = transactionHistoryList.findIndex(transaction => compareDates(dateFormat,transaction.dateFormat) <= 0);
    if (newIndex === -1) {
        newIndex = transactionHistoryList.length;
    }
    let newTransaction = {
        type,
        dateFormat,
        ticker,
        price,
        papers
    }
    transactionHistoryList.splice(newIndex, 0, newTransaction);
    localStorage.setItem('transactionHistoryList',JSON.stringify(transactionHistoryList));
}

export function removeTransactionHistoryObject(index) {
    transactionHistoryList.splice(index,1);
    localStorage.setItem('transactionHistoryList',JSON.stringify(transactionHistoryList));
}