import { executeTrade,clearInputElements } from "./smart-investor.js";
//variables definition
export let tradeHistoryList = JSON.parse(localStorage.getItem('tradeHistoryList')) || [];
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
export let tickersList=[];
export const isSavingExcessCalls = true; //false value not supported yet.
export let tickersPricesCache = JSON.parse(localStorage.getItem('tickersPricesCache')) || [
    // tickerPriceObjectExample = {
    //     ticker,
    //     price,
    //     date
    // }

];

//script for variables:
initalValues();


//functions
async function initalValues() {
    tradeHistoryList = JSON.parse(localStorage.getItem('tradeHistoryList')) || [];
    wallet = JSON.parse(localStorage.getItem('wallet')) || {
        liquid: 10000,
        assets: []
    };
    tickersPricesCache = JSON.parse(localStorage.getItem('tickersPricesCache')) || [];

    if (wallet.assets.length===0) {
        await executeTrade('bought','AAPL',3,110);//some initial values to test the Portfolio & trade history
        await executeTrade('bought','NVDA',2,800);//some initial values to test the Portfolio & trade history
        await executeTrade('sold','NVDA',-1,900);//some initial values to test the Portfolio & trade history
        await executeTrade('bought','AACG',5,10);//some initial values to test the Portfolio & trade history                
    }   
}

export function resetValues() {
    clearInputElements();
    localStorage.removeItem('wallet')
    localStorage.removeItem('tradeHistoryList');
    localStorage.removeItem('tickersPricesCache');
    initalValues();
}