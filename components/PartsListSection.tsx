'use client';

import { MaintenanceReportPart } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface PartsListSectionProps {
  parts: MaintenanceReportPart[];
  listNumber: 1 | 2;
  isEditing: boolean;
  onAddPart: (listNumber: 1 | 2) => void;
  onUpdatePart: (index: number, field: keyof MaintenanceReportPart, value: any) => void;
  onRemovePart: (index: number) => void;
}

export default function PartsListSection({
  parts,
  listNumber,
  isEditing,
  onAddPart,
  onUpdatePart,
  onRemovePart,
}: PartsListSectionProps) {
  const title = listNumber === 1 ? 'Peças a Serem Substituídas' : 'Peças Substituídas';

  if (!isEditing) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {parts.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma peça registrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="border border-gray-300 px-3 py-2 text-left">Nº Máquina</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Fig.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Item</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Quant.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{part.machine_number || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{part.fig || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{part.item || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center">{part.quantity || '-'}</td>
                    <td className="border border-gray-300 px-3 py-2">{part.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          onClick={() => onAddPart(listNumber)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm"
        >
          <Plus size={18} />
          <span>Adicionar Peça</span>
        </button>
      </div>

      {parts.length === 0 ? (
        <p className="text-gray-500 text-sm mb-4">Nenhuma peça. Clique em "Adicionar Peça" para começar.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {parts.map((part, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nº Máquina</label>
                  <input
                    type="text"
                    value={part.machine_number || ''}
                    onChange={(e) => onUpdatePart(idx, 'machine_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="Ex: MNT-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fig.</label>
                  <input
                    type="text"
                    value={part.fig || ''}
                    onChange={(e) => onUpdatePart(idx, 'fig', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="Figura"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Item</label>
                  <input
                    type="text"
                    value={part.item || ''}
                    onChange={(e) => onUpdatePart(idx, 'item', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="Item"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={part.quantity || ''}
                    onChange={(e) => onUpdatePart(idx, 'quantity', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={part.description || ''}
                    onChange={(e) => onUpdatePart(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                    placeholder="Descrição da peça"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemovePart(idx)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={16} />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
