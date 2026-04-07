import { useState, useRef } from 'react';
import { FileText, Image, Upload, Loader2, Check, Plus } from 'lucide-react';
import { useParseInvoice, useParseAndAddToInventory } from '../../hooks/useInvoiceParser';
import type { ParsedItem } from '../../types';

type TabType = 'text' | 'image';

export default function InvoiceParser() {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [invoiceText, setInvoiceText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseInvoice = useParseInvoice();
  const addToInventory = useParseAndAddToInventory();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParse = async () => {
    let result;
    if (activeTab === 'text' && invoiceText.trim()) {
      result = await parseInvoice.mutateAsync({ text: invoiceText });
    } else if (activeTab === 'image' && imagePreview) {
      const base64Data = imagePreview.split(',')[1];
      result = await parseInvoice.mutateAsync({ imageBase64: base64Data });
    }
    if (result) {
      setParsedItems(result.items);
    }
  };

  const handleAddAll = async () => {
    if (activeTab === 'text' && invoiceText.trim()) {
      await addToInventory.mutateAsync({ text: invoiceText });
    } else if (activeTab === 'image' && imagePreview) {
      const base64Data = imagePreview.split(',')[1];
      await addToInventory.mutateAsync({ imageBase64: base64Data });
    }
    setParsedItems([]);
    setInvoiceText('');
    setImagePreview(null);
  };

  const handleClear = () => {
    setParsedItems([]);
    setInvoiceText('');
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={18} />
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === 'image'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Image size={18} />
            Upload Image
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'text' ? (
            <textarea
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              placeholder="Paste your invoice text here...

Example:
Milk 2L - 5 pcs @ ₹60
Rice 5kg - 2 bags @ ₹250
Sugar 1kg - 3 packs @ ₹45"
              className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
                transition-colors
                ${imagePreview ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
              `}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Invoice preview"
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={40} />
                  <p className="text-gray-600 font-medium">Click or drag to upload</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleParse}
              disabled={
                parseInvoice.isPending ||
                (activeTab === 'text' ? !invoiceText.trim() : !imagePreview)
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parseInvoice.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Parsing...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Parse Invoice
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {parsedItems.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Parsed Items ({parsedItems.length})
            </h3>
            <button
              onClick={handleAddAll}
              disabled={addToInventory.isPending}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {addToInventory.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add All to Inventory
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parsedItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{item.unit || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.price ? `₹${item.price}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {item.confidence && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item.confidence >= 0.8
                                  ? 'bg-green-500'
                                  : item.confidence >= 0.5
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${item.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {addToInventory.isSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <Check size={20} />
          Items added to inventory successfully!
        </div>
      )}
    </div>
  );
}
