import { tradeHistoryList,wallet } from './variables.js';

// script:
renderTradeHistoryListHTML();
renderWallet();
renderPortfolio();


//fucntions
function updateTradeHistoryList(type,ticker,cost,papers) {
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

function validatePapersInWallet(tickerToValidate,papersToValidate) {
    for (let i=0 ; i<wallet.assets.length ; i++) {
        const { ticker, papers } = wallet.assets[i];
        if (ticker===tickerToValidate) {
            return papers>=papersToValidate;
        }
    }
    return false;
}

export function updateWallet(ticker,papers,cost) {
    wallet.liquid-=papers*cost;
    let isNewAsset = true;
    let indexOfAssetToRemove = -1;
    wallet.assets.forEach((assetObject,index) => {
        if (assetObject.ticker===ticker) {
            if (papers>0) {
                const totalPapersPrice = wallet.assets[index].papers * wallet.assets[index].avgPaperPrice + (papers*cost);                
                wallet.assets[index].avgPaperPrice = totalPapersPrice/(wallet.assets[index].papers+papers);
            }
            wallet.assets[index].papers+=papers;
            if(wallet.assets[index].papers===0){
                indexOfAssetToRemove=index;
            }
            
            isNewAsset=false;
        }
    });
    if (indexOfAssetToRemove>=0) {
        wallet.assets.splice(indexOfAssetToRemove,1);
    }
    
    if (isNewAsset) {
        wallet.assets.push({ticker,papers,avgPaperPrice: cost});
    }
    localStorage.setItem('wallet', JSON.stringify(wallet));
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

export function buyPaper() {
    let { ticker,cost,papers } = fetchInput() || {ticker: '',cost: 0,papers: 0};
    
    if (ticker==='' || cost===0 || papers===0) {
        return;
    }

    clearInputElements();

    executeTrade('bought',ticker,papers,cost);
}

export function executeTrade(type,ticker,papers,cost) {
    updateTradeHistoryList(type,ticker,cost,papers);
    renderTradeHistoryListHTML(); 
    updateWallet(ticker,papers,cost);
    renderWallet();
    renderPortfolio();
}

function renderWallet() {
    const walletElement = document.querySelector('.js-wallet');
    walletElement.innerHTML = `Wallet liquidity: $${wallet.liquid}`;
}

//rendering functions
function renderPortfolio() {
    let assetsListHTML = '';
    wallet.assets.forEach((assetObject) => {
        const { ticker, papers, avgPaperPrice } = assetObject;

        const html = `
        <div>${ticker}</div>
        <div>${papers}</div>
        <div>${avgPaperPrice}</div>        
        `;
        assetsListHTML +=html;
    });

    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}

function renderTradeHistoryListHTML() {
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
function removeTradeHistoryObject(index) {
    tradeHistoryList.splice(index,1);
    localStorage.setItem('tradeHistoryList',JSON.stringify(tradeHistoryList));
}
function undoTrade(ticker,papers,cost,index) {
    // document.getElementById(`js-undo-${index}`).removeEventListener('click',() => {
    //     undoTrade(ticker,-papers,cost,index);
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
