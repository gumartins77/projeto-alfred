'use client';

import { MaintenanceReport } from '@/lib/types';

interface ClientDataSectionProps {
  formData: MaintenanceReport;
  isEditing: boolean;
  onChangeField: (field: keyof MaintenanceReport, value: any) => void;
}

export default function ClientDataSection({ formData, isEditing, onChangeField }: ClientDataSectionProps) {
  if (!isEditing) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Cliente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Cliente</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_name || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Contato</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_contact || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Telefone</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_phone || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Endereço</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_address || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Cidade</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_city || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Estado</p>
            <p className="text-lg font-semibold text-gray-800">{formData.client_state || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Nº do Relatório</p>
            <p className="text-lg font-semibold text-gray-800">{formData.report_number || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-600">Tipo</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">{formData.report_type || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Cliente</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <input
            type="text"
            value={formData.client_name || ''}
            onChange={(e) => onChangeField('client_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Nome do cliente"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contato</label>
          <input
            type="text"
            value={formData.client_contact || ''}
            onChange={(e) => onChangeField('client_contact', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Pessoa de contato"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            type="tel"
            value={formData.client_phone || ''}
            onChange={(e) => onChangeField('client_phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="(11) 9999-9999"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <input
            type="text"
            value={formData.client_address || ''}
            onChange={(e) => onChangeField('client_address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Rua, número, complemento"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <input
            type="text"
            value={formData.client_city || ''}
            onChange={(e) => onChangeField('client_city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="Cidade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <input
            type="text"
            maxLength={2}
            value={formData.client_state || ''}
            onChange={(e) => onChangeField('client_state', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
            placeholder="SP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nº do Relatório</label>
          <input
            type="text"
            value={formData.report_number || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="report_type"
                value="rotina"
                checked={formData.report_type === 'rotina'}
                onChange={(e) => onChangeField('report_type', e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Rotina</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="report_type"
                value="chamado"
                checked={formData.report_type === 'chamado'}
                onChange={(e) => onChangeField('report_type', e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Chamado</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
