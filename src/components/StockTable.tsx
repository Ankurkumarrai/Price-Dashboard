import { useState, useMemo } from 'react';
import { Stock } from '../types/stock';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface StockTableProps {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

type SortField = 'symbol' | 'name' | 'price' | 'change' | 'changePercent' | 'volume';
type SortDirection = 'asc' | 'desc';

export const StockTable = ({ stocks, loading, error, onRefresh }: StockTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [stocks, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-semibold text-foreground hover:bg-accent/50"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </div>
    </Button>
  );

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-danger text-center">
            <p className="text-lg font-semibold mb-2">Error loading stock data</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Stock Market Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Button onClick={onRefresh} disabled={loading} size="sm">
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">
                  <SortButton field="symbol">Symbol</SortButton>
                </th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">
                  <SortButton field="name">Company</SortButton>
                </th>
                <th className="text-right py-3 px-2">
                  <SortButton field="price">Price</SortButton>
                </th>
                <th className="text-right py-3 px-2">
                  <SortButton field="change">Change</SortButton>
                </th>
                <th className="text-right py-3 px-2">
                  <SortButton field="changePercent">Change %</SortButton>
                </th>
                <th className="text-right py-3 px-2 hidden md:table-cell">
                  <SortButton field="volume">Volume</SortButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2 text-muted-foreground">Loading stock data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No stocks found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAndSortedStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="font-semibold text-foreground">{stock.symbol}</div>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="text-muted-foreground text-sm">{stock.name}</div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <div className="font-semibold">{formatPrice(stock.price)}</div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <div className={cn(
                        "font-semibold flex items-center justify-end gap-1",
                        stock.change >= 0 ? "text-success" : "text-danger"
                      )}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {formatChange(stock.change)}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono">
                      <div className={cn(
                        "font-semibold",
                        stock.changePercent >= 0 ? "text-success" : "text-danger"
                      )}>
                        {formatPercent(stock.changePercent)}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-mono hidden md:table-cell">
                      <div className="text-muted-foreground">{formatVolume(stock.volume)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Showing {filteredAndSortedStocks.length} of {stocks.length} stocks</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};