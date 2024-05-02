import { executeTrade } from "./smart-investor.js";
//variables definition
export let tradeHistoryList = JSON.parse(localStorage.getItem('tradeHistoryList')) || [];

export let wallet = JSON.parse(localStorage.getItem('wallet')) || {
    liquid: 10000,
    assets: [
    //assetExample = {
    //     ticker,
    //     papers
    //     avgPaperPrice
    //};
    ]
};

export let tickersList=[];

export const isSavingExcessCalls = true;


//script for variables:
initalValues();


//functions
function initalValues() {
    tradeHistoryList = JSON.parse(localStorage.getItem('tradeHistoryList')) || [];
    wallet = JSON.parse(localStorage.getItem('wallet')) || {
        liquid: 10000,
        assets: [
        //assetExample = {
        //     ticker,
        //     papers
        //     avgPaperPrice
        //};
        ]
    };

    if (wallet.assets.length===0) {
        executeTrade('bought','AAPL',3,110);//some initial values to test the Portfolio & trade history
        executeTrade('bought','NVDA',2,800);//some initial values to test the Portfolio & trade history
        executeTrade('sold','NVDA',-1,900);//some initial values to test the Portfolio & trade history
        executeTrade('bought','AACG',5,10);//some initial values to test the Portfolio & trade history                
    }   
}

export function resetValues() {
    localStorage.removeItem('wallet')
    localStorage.removeItem('tradeHistoryList');
    initalValues();
}