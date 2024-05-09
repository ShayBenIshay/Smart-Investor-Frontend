import { tickersList,isSavingExcessCalls } from "./variables.js";


export function loadTickersList() {
    if (isSavingExcessCalls) {
        if (tickersList.length===0){
            //using prefetched data to eliminate excess api calls
            prefetchedStockData();
        }
        updateTickerInputElement(tickersList);
      } else {
        //check if the tickers list is updated (last few days? or last updating time s.a quarter?)
        //using api call to fetch data
        // fetchStockData();
      }    
} 

// updating the autocomplete element with the fetched array
function updateTickerInputElement(tickerArr) {
    let tickerInputElement = document.querySelector('.js-ticker-input');

    let dataList = document.createElement('datalist');
    dataList.id = 'ticker-options';
    tickerArr.forEach(ticker => {
        let optionElement = document.createElement('option');
        optionElement.value = ticker;
        dataList.appendChild(optionElement);
    });

    tickerInputElement.setAttribute('list', 'ticker-options');
    tickerInputElement.parentNode.insertBefore(dataList, tickerInputElement.nextSibling);
}

//not using any API. using text file to construct the tickers list. 
export function prefetchedStockData() {
    fetch('JSONdata.txt')
    .then(response => response.text())
    .then(prefetchedData => {
        const prefetchedDataJSON = JSON.parse(prefetchedData);    
        prefetchedDataJSON.forEach((jsonInnerObject) => {
            tickersList.push(jsonInnerObject.Code);
        });
        localStorage.setItem('tickersList',JSON.stringify(tickersList));
    })
    .catch(error => {
        console.error('Error fetching the file: ', error);
});
}