import { useState } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useInventory, useDeleteInventoryItem } from '../../hooks/useInventory';
import type { InventoryItem } from '../../types';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';

export default function InventoryTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { data, isLoading } = useInventory(page, 20);
  const deleteItem = useDeleteInventoryItem();

  const getExpiryStatus = (expiryDate: string) => {
    const days = differenceInDays(parseISO(expiryDate), new Date());
    if (days < 0) return 'expired';
    if (days <= 7) return 'near-expiry';
    return 'ok';
  };

  const getRowClass = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-50 hover:bg-red-100';
      case 'near-expiry':
        return 'bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'hover:bg-gray-50';
    }
  };

  const filteredItems = data?.items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unit</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expiry Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems?.map((item) => {
                const status = getExpiryStatus(item.expiry_date);
                return (
                  <tr key={item.id} className={getRowClass(status)}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className={item.quantity <= 10 ? 'text-red-600 font-medium' : ''}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.unit || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`
                          inline-flex px-2 py-1 rounded text-sm
                          ${status === 'expired' ? 'bg-red-100 text-red-700' : ''}
                          ${status === 'near-expiry' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${status === 'ok' ? 'text-gray-600' : ''}
                        `}
                      >
                        {format(parseISO(item.expiry_date), 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.category || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Page {page} of {data.pages} ({data.total} items)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
      {editingItem && (
        <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
