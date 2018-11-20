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


    
    //запишем данные индикаторов в массив indexInfo
    SMA(25);
    SMA(5);

}
main('FB')