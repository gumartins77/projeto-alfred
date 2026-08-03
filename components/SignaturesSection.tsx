'use client';

import { MaintenanceReport } from '@/lib/types';

interface SignaturesSectionProps {
  formData: MaintenanceReport;
  isEditing: boolean;
  onChangeField: (field: keyof MaintenanceReport, value: any) => void;
}

export default function SignaturesSection({ formData, isEditing, onChangeField }: SignaturesSectionProps) {
  if (!isEditing) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vistos / Assinaturas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 text-center">
            <p className="text-xs font-medium text-gray-600 mb-3">Visto Técnico</p>
            {formData.technical_signature ? (
              <p className="text-lg font-semibold text-gray-800 break-words">{formData.technical_signature}</p>
            ) : (
              <p className="text-gray-400">Sem assinatura</p>
            )}
            <p className="text-xs text-gray-500 mt-3">_____________________</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 text-center">
            <p className="text-xs font-medium text-gray-600 mb-3">Visto Cliente</p>
            {formData.client_signature ? (
              <p className="text-lg font-semibold text-gray-800 break-words">{formData.client_signature}</p>
            ) : (
              <p className="text-gray-400">Sem assinatura</p>
            )}
            <p className="text-xs text-gray-500 mt-3">_____________________</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 text-center">
            <p className="text-xs font-medium text-gray-600 mb-3">Visto Responsável</p>
            {formData.responsible_signature ? (
              <p className="text-lg font-semibold text-gray-800 break-words">{formData.responsible_signature}</p>
            ) : (
              <p className="text-gray-400">Sem assinatura</p>
            )}
            <p className="text-xs text-gray-500 mt-3">_____________________</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vistos / Assinaturas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visto Técnico</label>
          <input
            type="text"
            value={formData.technical_signature || ''}
            onChange={(e) => onChangeField('technical_signature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Nome do técnico"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visto Cliente</label>
          <input
            type="text"
            value={formData.client_signature || ''}
            onChange={(e) => onChangeField('client_signature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Nome do cliente"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Visto Responsável</label>
          <input
            type="text"
            value={formData.responsible_signature || ''}
            onChange={(e) => onChangeField('responsible_signature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Nome do responsável"
          />
        </div>
      </div>
    </div>
  );
}
