import { Stock } from '../types/stock';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

interface MarketSummaryProps {
  stocks: Stock[];
  loading: boolean;
}

export const MarketSummary = ({ stocks, loading }: MarketSummaryProps) => {
  const calculateMarketStats = () => {
    if (stocks.length === 0) {
      return {
        totalValue: 0,
        gainers: 0,
        losers: 0,
        avgChange: 0,
        totalVolume: 0
      };
    }

    const totalValue = stocks.reduce((sum, stock) => sum + stock.price, 0);
    const gainers = stocks.filter(stock => stock.changePercent > 0).length;
    const losers = stocks.filter(stock => stock.changePercent < 0).length;
    const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;
    const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);

    return {
      totalValue,
      gainers,
      losers,
      avgChange,
      totalVolume
    };
  };

  const stats = calculateMarketStats();

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    return `${(volume / 1000).toFixed(1)}K`;
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    trend 
  }: { 
    title: string; 
    value: string; 
    icon: React.ComponentType<any>; 
    change?: string; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={cn(
              "h-5 w-5",
              trend === 'up' && "text-success",
              trend === 'down' && "text-danger",
              trend === 'neutral' && "text-muted-foreground"
            )} />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs",
              trend === 'up' && "text-success",
              trend === 'down' && "text-danger",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Portfolio Value"
        value={`$${stats.totalValue.toFixed(2)}`}
        icon={DollarSign}
        trend="neutral"
      />
      
      <StatCard
        title="Gainers"
        value={stats.gainers.toString()}
        icon={TrendingUp}
        change={`${stocks.length > 0 ? ((stats.gainers / stocks.length) * 100).toFixed(1) : 0}% of stocks`}
        trend="up"
      />
      
      <StatCard
        title="Losers"
        value={stats.losers.toString()}
        icon={TrendingDown}
        change={`${stocks.length > 0 ? ((stats.losers / stocks.length) * 100).toFixed(1) : 0}% of stocks`}
        trend="down"
      />
      
      <StatCard
        title="Avg Change"
        value={`${stats.avgChange >= 0 ? '+' : ''}${stats.avgChange.toFixed(2)}%`}
        icon={Activity}
        change={`Volume: ${formatVolume(stats.totalVolume)}`}
        trend={stats.avgChange >= 0 ? 'up' : 'down'}
      />
    </div>
  );
};