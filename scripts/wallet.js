import { wallet } from './variables.js';

renderWallet();

export function validatePapersInWallet(tickerToValidate,papersToValidate) {
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

export function renderWallet() {
    const walletElement = document.querySelector('.js-wallet');
    walletElement.innerHTML = `Wallet liquidity: $${wallet.liquid}`;
}
