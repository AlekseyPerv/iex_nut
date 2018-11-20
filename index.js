const iexapi = require('iex-api');
const isofetch = require('isomorphic-fetch');
const IEXClient = new iexapi.IEXClient(isofetch);
const main = async (companycode) => {
    const indexInfo = await IEXClient.stockChart(companycode, '5y')
    
    // Indicator SMA
    const SMA = (period) => {
        const SMAKEY = 'SMA' + period;
        for (var i = 0; i <indexInfo.length; i++) {
            if (i < period - 1) indexInfo[i][SMAKEY] = indexInfo[i]['close']
            else {
                sum = 0;
                for ( var g = i - period + 1; g < i + 1; g++) sum += indexInfo[g]['close'];
                indexInfo[i][SMAKEY] = sum / period;
            }
        }
    }

    // Strategy double SMA сначала больше потом менбше
    const SMA2X = (fast, slow) => {
        SMA(fast);
        SMA(slow);
        smaFast = 'SMA' + fast;
        smaSlow = 'SMA' + slow;
        for (var i = 1; i < indexInfo.length; i++) {
            if (indexInfo[i - 1][smaFast] < indexInfo[i -1][smaSlow] && indexInfo[i][smaFast] > indexInfo[i][smaSlow]) {
                indexInfo[i].canBuy = true;
            }
            if (indexInfo[i - 1][smaFast] > indexInfo[i -1][smaSlow] && indexInfo[i][smaFast] < indexInfo[i][smaSlow]) {
                indexInfo[i].canSell = true;
            }
        //if (indexInfo[i].canBuy == true) console.log(indexInfo[i].close);
        //if (indexInfo[i].canBuy == true) console.log('b',indexInfo[i].close);
        if (indexInfo[i].canSell == true) console.log(indexInfo[i].close);
        //if (indexInfo[i].canSell == true) console.log('s',indexInfo[i].close);
        }
    }

    SMA2X(5,30);


}
main('FB')
