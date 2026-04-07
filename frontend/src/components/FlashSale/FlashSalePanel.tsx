import { Percent, Clock, Package, TrendingDown } from 'lucide-react';
import { useFlashSaleSuggestions } from '../../hooks/useFlashSale';

export default function FlashSalePanel() {
  const { data: suggestions, isLoading } = useFlashSaleSuggestions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!suggestions?.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingDown className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Flash Sales Needed</h3>
        <p className="text-gray-500 mt-1">
          All items have healthy expiry dates
        </p>
      </div>
    );
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return 'from-red-500 to-red-600';
    if (days <= 3) return 'from-orange-500 to-orange-600';
    return 'from-yellow-500 to-yellow-600';
  };

  const getUrgencyBg = (days: number) => {
    if (days <= 1) return 'bg-red-50 border-red-200';
    if (days <= 3) return 'bg-orange-50 border-orange-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Flash Sale Suggestions ({suggestions.length})
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((item) => (
          <div
            key={item.item_id}
            className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${getUrgencyBg(item.days_to_expiry)}`}
          >
            <div className={`h-2 bg-gradient-to-r ${getUrgencyColor(item.days_to_expiry)}`} />
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-lg">{item.item_name}</h4>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-bold">
                  <Percent size={14} />
                  {item.suggested_discount}% OFF
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>
                    {item.days_to_expiry === 0
                      ? 'Expires today!'
                      : item.days_to_expiry === 1
                      ? 'Expires tomorrow'
                      : `${item.days_to_expiry} days left`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} className="text-gray-400" />
                  <span>{item.current_quantity} units in stock</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{item.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
