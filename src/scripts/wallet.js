import { wallet } from './variables.js';
import { renderWallet } from './render-HTML-elements.js';


export function validatePapersInWallet(tickerToValidate,papersToValidate) {
    for (let i=0 ; i<wallet.assets.length ; i++) {
        const { ticker, papers } = wallet.assets[i];
        if (ticker===tickerToValidate) {
            return papers>=papersToValidate;
        }
    }
    return false;
}
export function validateWalletLiquid(papers,price){
    if (wallet.liquid < papers*price) {
        console.error(`Cannot buy ${papers} papers for $${price} it is more then $${wallet.liquid.toFixed(2)} liquid in your wallet`);
        return false;
    }
    return true;
}
export function updateWallet(ticker,papers,cost) {
    wallet.liquid-=papers*cost;
    let isNewAsset = true;
    let indexOfAssetToRemove = -1;
    wallet.assets.forEach((assetObject,index) => {
        if (assetObject.ticker===ticker) {
            if (papers>0) {
                const totalBuyPrice = wallet.assets[index].papers * wallet.assets[index].avgBuyPrice + (papers*cost);                
                wallet.assets[index].avgBuyPrice = totalBuyPrice/(wallet.assets[index].papers+papers);
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
        wallet.assets.push({ticker,papers,avgBuyPrice: cost});
    }
    localStorage.setItem('wallet', JSON.stringify(wallet));
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