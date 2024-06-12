import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string>('CVAC.US');
    const [stockData, setStockData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const exampleParams = {
        "cmd": "getStockData",
        "params": {
            "ticker": ticker.toUpperCase(),
            "lang": "en"
        }
    };

    const getStockData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://tradernet.com/api/', {
                params: { q: JSON.stringify(exampleParams) }
            });
            if (response.data && response.data.quotes) {
                setStockData(response.data);
            } else {
                setError('Ungültiger Ticker oder keine Daten verfügbar.');
                setStockData(null);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Aktieninformationen:', error);
            setError('Fehler beim Abrufen der Aktieninformationen.');
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            getStockData();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold mb-6">Aktieninformationen</h1>
            <div className="flex flex-col items-center mb-6">
                <input 
                    type="text" 
                    value={ticker} 
                    onChange={(e) => setTicker(e.target.value.toUpperCase())} 
                    onKeyDown={handleKeyDown}
                    placeholder="Ticker eingeben" 
                    className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={getStockData} 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Suche
                </button>
            </div>
            <div id="stock-data" className="w-full max-w-md p-6 rounded-md shadow-md">
                {loading ? (
                    <p>Lade Daten...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : stockData ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Stock Data für {stockData.ticker}</h2>
                        <p className="text-lg">Firmenname: {stockData.name}</p>
                        <p className="text-lg">Währung: {stockData.quotes['x_curr']}</p>
                        <p className="text-lg">Preis: {stockData.quotes['pp']}</p>
                        <p className="text-lg">Änderung: {stockData.quotes['chg110']} %</p>
                    </div>
                ) : (
                    <p>Keine Daten verfügbar</p>
                )}
            </div>
        </div>
    );
};

export default App;
