import { useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import { fetchMultipleStocks, getPopularStocks } from '../services/stockApi';
import { StockTable } from '../components/StockTable';
import { MarketSummary } from '../components/MarketSummary';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      const symbols = getPopularStocks();
      const stockData = await fetchMultipleStocks(symbols);
      setStocks(stockData);
      toast({
        title: "Stock data updated",
        description: `Loaded ${stockData.length} stocks successfully`,
      });
    } catch (err) {
      const errorMessage = 'Failed to load stock data. Showing demo data instead.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Stock Market Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time stock prices and market data
          </p>
        </header>
        
        <MarketSummary stocks={stocks} loading={loading} />
        
        <StockTable 
          stocks={stocks} 
          loading={loading} 
          error={error}
          onRefresh={loadStockData}
        />
      </div>
    </div>
  );
};

export default Index;
