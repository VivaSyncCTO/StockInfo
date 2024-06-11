import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string>('ADS.EU');
    const [stockData, setStockData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const exampleParams = {
        "cmd": "getStockData",
        "params": {
            "ticker": ticker,
            "lang": "en"
        }
    };

    const getStockData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://tradernet.com/api/', {
                params: { q: JSON.stringify(exampleParams) }
            });
            setStockData(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen der Aktieninformationen:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Stock Info</h1>
            <div>
                <input 
                    type="text" 
                    value={ticker} 
                    onChange={(e) => setTicker(e.target.value)} 
                    placeholder="Ticker eingeben"
                />
                <button onClick={getStockData}>Suche</button>
            </div>
            <div id="stock-data">
                {loading ? (
                    <p>Lade Daten...</p>
                ) : stockData ? (
                    <div>
                        <h3>Stock Data für {stockData.ticker}</h3>
                        <p>Preis: {stockData.quotes['pp']}</p>
                        <p>Währung: {stockData.quotes['x_curr']}</p>
                        <p>Änderung: {stockData.quotes['chg110']}</p>
                    </div>
                ) : (
                    <p>Keine Daten verfügbar</p>
                )}
            </div>
        </div>
    );
};

export default App;
