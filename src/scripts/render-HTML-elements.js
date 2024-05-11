import { fetchRealTimePrice } from "./tickers-prices-cache.js";
import { tradeHistoryList,wallet } from "./variables.js";
import { undoTrade } from "./smart-investor.js";

renderTradeHistoryListHTML();
renderWallet(); 
await renderPortfolio();

export async function renderPortfolio() {
    let assetsListHTML = '';

    for (let i=0; i<wallet.assets.length; i++) {
        const { ticker,papers,avgBuyPrice } = wallet.assets[i];
        let percentage,totalAssetValue,totalAssetProfit;
        let currentPrice = await fetchRealTimePrice(ticker);
        let totalAssetPrice = papers*avgBuyPrice;
        if (currentPrice != -1) {
            //api limit exceeded it's limit. show udnefined value
            percentage = ((currentPrice/avgBuyPrice - 1)*100).toFixed(2);
            totalAssetValue = (papers*currentPrice).toFixed(2);
            totalAssetProfit = (totalAssetValue-totalAssetPrice).toFixed(2);
        }
        let plusHTML='', portfolioProfitClassHTML='';
        if (percentage>0) {
            plusHTML='+';
            portfolioProfitClassHTML = `class = "portfolio-profit"`;
        } else if (percentage<0) {
            portfolioProfitClassHTML = 'class = "portfolio-loss"';
        } else {
            portfolioProfitClassHTML = 'class = "portfolio-neutral"'
        }
        const html = `
        <div ${portfolioProfitClassHTML}>${ticker}</div>
        <div ${portfolioProfitClassHTML}>${papers}</div>
        <div ${portfolioProfitClassHTML}>${avgBuyPrice.toFixed(2)}</div> 
        <div ${portfolioProfitClassHTML}>${currentPrice}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetPrice.toFixed(2)}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetValue}</div>
        <div ${portfolioProfitClassHTML}>$${totalAssetProfit}</div>
        <div ${portfolioProfitClassHTML}>${plusHTML}${percentage}%</div>
        `;
        assetsListHTML +=html;
    }
    document.querySelector('.js-portfolio').innerHTML = assetsListHTML;
}

export function renderWallet() {
    const walletElement = document.querySelector('.js-wallet');
    walletElement.innerHTML = `Wallet liquidity: $${wallet.liquid.toFixed(2).replace(/\.00$/, '')}`;
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