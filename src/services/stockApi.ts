import { Stock, StockApiResponse } from '../types/stock';

// Free API key for demo purposes - in production, use environment variables
const API_KEY = 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Popular stocks for demo
const DEMO_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

export const fetchStockData = async (symbol: string): Promise<Stock> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    
    const data: StockApiResponse = await response.json();
    
    if (!data['Global Quote']) {
      // Fallback to demo data when API limit is reached
      return generateDemoStock(symbol);
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. symbol'],
      name: getCompanyName(quote['01. symbol']),
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return generateDemoStock(symbol);
  }
};

export const fetchMultipleStocks = async (symbols: string[]): Promise<Stock[]> => {
  const promises = symbols.map(symbol => fetchStockData(symbol));
  return Promise.all(promises);
};

export const getPopularStocks = (): string[] => {
  return DEMO_STOCKS;
};

// Demo data generator for when API is not available
const generateDemoStock = (symbol: string): Stock => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    name: getCompanyName(symbol),
    price: basePrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 10000000) + 100000,
  };
};

const getCompanyName = (symbol: string): string => {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'TSLA': 'Tesla, Inc.',
    'AMZN': 'Amazon.com, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms, Inc.',
    'NFLX': 'Netflix, Inc.',
  };
  
  return companyNames[symbol] || `${symbol} Corporation`;
};