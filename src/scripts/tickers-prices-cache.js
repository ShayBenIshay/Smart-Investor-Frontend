import { tickersPricesCacheMap } from "./variables.js";
import { getPriceWithDateAPI,getLastClosingAPI } from "./smart-investor.js";
import { getYesterdayFormat } from "./helper-functions.js";

export function checkInCacheWithDate(tickerToCheck,dateFormatToCheck) {
    for (let [ticker, pricesArr] of tickersPricesCacheMap.entries()) {
        if (tickerToCheck===ticker) {
            for (let i=0; i<pricesArr.length; i++) {
                let { dateFormat,price } = pricesArr[i];
                if (dateFormatToCheck === dateFormat) {
                    return price;
                }
            }
            return -1;
        }
    }
    return -1;
}

export async function fetchRealTimePrice(ticker) {
    const yesterdayFormat = getYesterdayFormat();
    let price = checkInCacheWithDate(ticker,yesterdayFormat)
    if (price<0) {
        price = await getLastClosingAPI(ticker);
    }
    if (price>0) {
        updatePriceInCache(ticker,yesterdayFormat,price);
    }
    return price;
}

function updatePriceInCache(ticker,dateToUpdate,price) {
    if (!tickersPricesCacheMap.has(ticker)) {
        tickersPricesCacheMap.set(ticker,[]);
    }
    let exists = false;
    tickersPricesCacheMap.get(ticker).forEach( cacheObject => {
        let { dateFormat } = cacheObject;
        if (dateFormat===dateToUpdate) {
            exists = true;
        }
    });
    if (!exists) {
        tickersPricesCacheMap.get(ticker).push({dateFormat: dateToUpdate, price});
    }
    let cacheArray = Array.from(tickersPricesCacheMap);
    localStorage.setItem('tickersPricesCacheMap',JSON.stringify(cacheArray));
}

export async function fetchPriceWithDate(ticker,dateFormat) {
    let price = checkInCacheWithDate(ticker,dateFormat);
    if (price<0) {
        price = await getPriceWithDateAPI(ticker,dateFormat);
    }
    if (price>0) {
        updatePriceInCache(ticker,dateFormat,price);
    }
    return price;
}