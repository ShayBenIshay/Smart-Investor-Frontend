import { tickersList,isSavingExcessCalls } from "./variables.js";


export function loadTickersList() {
    if (isSavingExcessCalls) {
        //using prefetched data to eliminate excess api calls
        prefetchedStockData();
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
        prefetchedData = JSON.parse(prefetchedData);    
        prefetchedData.forEach((jsonInnerObject) => {
            tickersList.push(jsonInnerObject.Code);
        });
        updateTickerInputElement(tickersList);
        localStorage.setItem('tickersList',JSON.stringify(tickersList));
    })
    .catch(error => {
        console.error('Error fetching the file: ', error);
});
}

// //unchecked funciton to update the tickers list from API
// function saveFetchedData(jsonObject) {
//     //is this line needed?
//     const jsonString = JSON.stringify(jsonObject,null,2);

//     // Create a Blob object from the data
//     const blob = new Blob([jsonString], { type: 'text/plain' });

//     // Create a temporary anchor element
//     const a = document.createElement('a');
//     a.href = window.URL.createObjectURL(blob);
//     a.download = 'JSONdata.txt'; // Specify the filename

//     // Append the anchor element to the DOM and trigger a click event to start the download
//     document.body.appendChild(a);
//     a.click();

//     // Clean up
//     document.body.removeChild(a);
// }

// Function to fetch end-of-day stock data
// export async function fetchStockData() {
//     fetch('api_token.txt')
//     .then(response => response.text())
//     .then(async apiToken => {
//         try {
//             // Make a fetch request to the API endpoint
//             const response = await fetch(`https://eodhistoricaldata.com/api/exchange-symbol-list/NASDAQ?${apiToken}=662aa9e54d17b2.04187810&fmt=json`);
            
//             // Check if the request was successful (status code 200)
//             if (!response.ok) {
//                 throw new Error('Failed to fetch data');
//             }
//             //need to be checked:
//             //also to check if this line should move after the next line
//             saveFetchedData(response);
//             // Parse the JSON response
//             let dataFetchedFromAPI = await response.json();
//             dataFetchedFromAPI.forEach((jsonInnerObject) => {
//                 tickersList.push(jsonInnerObject.Code);
//             });
//             updateTickerInputElement(tickersList);
//             // console.log(tickersList);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching the api token: ', error);
//     });

// }