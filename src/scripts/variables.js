import { executeTransaction } from "./smart-investor.js";
import { clearInputElements } from "./helper-functions.js";
//variables definition
export let transactionHistoryList = JSON.parse(localStorage.getItem('transactionHistoryList')) || [];
export let wallet = JSON.parse(localStorage.getItem('wallet')) || {
    liquid: 10000,
    assets: [
    //assetExample = {
    //     ticker,
    //     price,
    //     avgBuyPrice
    //};
    ]
};
export let tickersList= JSON.parse(localStorage.getItem('tickersList')) || [];
export const isSavingExcessCalls = true; //false value not supported yet.
let tickersPricesCacheMapJSON = JSON.parse(localStorage.getItem('tickersPricesCacheMap')) || '';
export let tickersPricesCacheMap = new Map(tickersPricesCacheMapJSON); //example: { ticker , [{dateFormat,price}] }

//script for variables:
initalValues();


//functions
async function initalValues() {
    transactionHistoryList = JSON.parse(localStorage.getItem('transactionHistoryList')) || [];
    wallet = JSON.parse(localStorage.getItem('wallet')) || {
        liquid: 10000,
        assets: []
    };
    let tickersPricesCacheMapJSON = JSON.parse(localStorage.getItem('tickersPricesCacheMap')) || '';
    tickersPricesCacheMap = new Map(tickersPricesCacheMapJSON);

    // tickersPricesCache = JSON.parse(localStorage.getItem('tickersPricesCache')) || [];
    if (wallet.assets.length===0) {
        const todayDate = new Date();
        const yesterdayDate = new Date(todayDate);
        yesterdayDate.setDate(todayDate.getDate()-1);
        const yesterdayDateFormat = yesterdayDate.toISOString().substring(0, 10);
        await executeTransaction('bought',yesterdayDateFormat,'AAPL',3,110);//some initial values to test the Portfolio & transaction history
        await executeTransaction('bought',yesterdayDateFormat,'NVDA',2,800);//some initial values to test the Portfolio & transaction history
        await executeTransaction('sold',yesterdayDateFormat,'NVDA',-1,900);//some initial values to test the Portfolio & transaction history
        await executeTransaction('bought',yesterdayDateFormat,'AACG',5,10);//some initial values to test the Portfolio & transaction history                
    }   
}

export function resetValues() {
    clearInputElements();
    localStorage.removeItem('wallet')
    localStorage.removeItem('transactionHistoryList');
    localStorage.removeItem('tickersPricesCacheMap'); //?
    initalValues();
}