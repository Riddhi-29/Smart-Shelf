import { format, differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle, Package, Clock } from 'lucide-react';
import { useAlertSummary } from '../../hooks/useAlerts';

export default function AlertPanel() {
  const { data: alerts, isLoading } = useAlertSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasNoAlerts =
    !alerts?.low_stock_items.length && !alerts?.near_expiry_items.length;

  if (hasNoAlerts) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">All Good!</h3>
        <p className="text-gray-500 mt-1">No alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alerts?.low_stock_items && alerts.low_stock_items.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-orange-500" size={20} />
            <h3 className="font-semibold text-gray-900">
              Low Stock ({alerts.low_stock_count})
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.low_stock_items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-orange-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.category || 'Uncategorized'}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded font-medium">
                    {item.quantity} {item.unit || 'pcs'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts?.near_expiry_items && alerts.near_expiry_items.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-semibold text-gray-900">
              Near Expiry ({alerts.near_expiry_count})
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.near_expiry_items.map((item) => {
              const daysUntilExpiry = differenceInDays(
                parseISO(item.expiry_date),
                new Date()
              );
              const isExpired = daysUntilExpiry < 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                    isExpired ? 'border-red-300' : 'border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit || 'pcs'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-sm rounded font-medium ${
                        isExpired
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {isExpired
                        ? 'Expired'
                        : daysUntilExpiry === 0
                        ? 'Today'
                        : `${daysUntilExpiry}d left`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    {format(parseISO(item.expiry_date), 'MMM dd, yyyy')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
