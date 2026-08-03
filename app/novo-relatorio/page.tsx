'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Login from '@/components/Login';
import ClientDataSection from '@/components/ClientDataSection';
import PartsListSection from '@/components/PartsListSection';
import { MaintenanceReport, MaintenanceReportPart, MaintenanceLineItem } from '@/lib/types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { bulkCreateReportParts } from '@/lib/parts';

export default function NovoRelatorio() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState('');

  const [formData, setFormData] = useState<MaintenanceReport>({
    user_id: '',
    machine_number: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    location: '',
    responsible: '',
    observations: '',
    report_number: '',
    report_type: 'rotina',
    client_name: '',
    client_address: '',
    client_city: '',
    client_phone: '',
    client_contact: '',
    client_state: '',
    function_description: '',
    service_area: '',
    technical_signature: '',
    client_signature: '',
    responsible_signature: '',
    line_items: [
      { tipo_maquina: '', numero_maquina: '', numero_patrimonio: '', produto_quantidade_aplicada: '', material_acabamento: '', material_onde_aplicado: '' },
    ],
  });

  const [parts, setParts] = useState<{ parts1: MaintenanceReportPart[]; parts2: MaintenanceReportPart[] }>({
    parts1: [],
    parts2: [],
  });

  const generateReportNumber = async (userIdToUse: string, userName: string) => {
    const initials = userName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('') || 'RA';

    const { count, error } = await supabase
      .from('maintenance_reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userIdToUse);

    if (error) {
      console.error('Erro ao contar relatórios:', error);
      return `${initials}0001`;
    }

    return `${initials}${String((count ?? 0) + 1).padStart(4, '0')}`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userDisplayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';
        const generatedNumber = await generateReportNumber(user.id, userDisplayName);

        setAuthenticated(true);
        setUserId(user.id);
        setCurrentUserName(userDisplayName);
        setFormData(prev => ({
          ...prev,
          user_id: user.id,
          responsible: userDisplayName,
          report_number: generatedNumber,
        }));
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleHeaderChange = (field: keyof MaintenanceReport, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addPart = (listNumber: 1 | 2) => {
    setParts(prev => ({
      ...prev,
      [listNumber === 1 ? 'parts1' : 'parts2']: [
        ...prev[listNumber === 1 ? 'parts1' : 'parts2'],
        { report_id: '', list_number: listNumber, machine_number: '', fig: '', item: '', quantity: undefined, description: '' } as MaintenanceReportPart,
      ],
    }));
  };

  const updatePart = (listNumber: 1 | 2, index: number, field: keyof MaintenanceReportPart, value: any) => {
    setParts(prev => {
      const partsKey = listNumber === 1 ? 'parts1' : 'parts2';
      const updated = [...prev[partsKey]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [partsKey]: updated };
    });
  };

  const removePart = (listNumber: 1 | 2, index: number) => {
    setParts(prev => {
      const partsKey = listNumber === 1 ? 'parts1' : 'parts2';
      return { ...prev, [partsKey]: prev[partsKey].filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Filter out empty line items
      const validLineItems = formData.line_items.filter(
        item => item.tipo_maquina || item.numero_maquina || item.numero_patrimonio || item.produto_quantidade_aplicada || item.material_acabamento || item.material_onde_aplicado
      );

      const reportNumber = formData.report_number || await generateReportNumber(userId || formData.user_id, currentUserName || 'Usuário');

      const dataToSave = {
        ...formData,
        report_number: reportNumber,
        responsible: currentUserName || formData.responsible || '',
        line_items: validLineItems,
      };

      const { data, error } = await supabase
        .from('maintenance_reports')
        .insert([dataToSave])
        .select()
        .single();

      if (error) throw error;

      // Save parts if any
      const allParts: Omit<MaintenanceReportPart, 'id' | 'created_at' | 'updated_at'>[] = [
        ...parts.parts1.map(p => ({ ...p, report_id: data.id, list_number: 1 as const })),
        ...parts.parts2.map(p => ({ ...p, report_id: data.id, list_number: 2 as const })),
      ];

      if (allParts.length > 0) {
        await bulkCreateReportParts(allParts);
      }

      router.push(`/relatorio/${data.id}`);
    } catch (error: any) {
      alert('Erro ao salvar relatório: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Novo Relatório
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-8">
          {/* Dados do Cliente Section */}
          <ClientDataSection formData={formData} isEditing={true} onChangeField={handleHeaderChange} />

          {/* Service Data Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Serviço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleHeaderChange('date', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Início
                </label>
                <input
                  type="time"
                  value={formData.start_time || ''}
                  onChange={(e) => handleHeaderChange('start_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Término
                </label>
                <input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => handleHeaderChange('end_time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>

            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço Realizado
              </label>
              <textarea
                value={formData.observations || ''}
                onChange={(e) => handleHeaderChange('observations', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none"
                rows={3}
                placeholder="Descreva o serviço realizado..."
              />
            </div>
          </div>

          {/* Line Items Section - Manutenção */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Itens de Manutenção</h3>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  line_items: [
                    ...prev.line_items,
                    { tipo_maquina: '', numero_maquina: '', numero_patrimonio: '', produto_quantidade_aplicada: '', material_acabamento: '', material_onde_aplicado: '' },
                  ],
                }))}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm"
              >
                <Plus size={18} />
                <span>Adicionar Item</span>
              </button>
            </div>

            <div className="space-y-3 overflow-x-auto">
              {formData.line_items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Máquina</label>
                      <input
                        type="text"
                        value={item.tipo_maquina || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].tipo_maquina = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="Ex: Compressor"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Número da Máquina</label>
                      <input
                        type="text"
                        value={item.numero_maquina || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].numero_maquina = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="MNT-001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nº Patrimônio</label>
                      <input
                        type="text"
                        value={item.numero_patrimonio || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].numero_patrimonio = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="PAT-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Produto / Quantidade Aplicada</label>
                      <input
                        type="text"
                        value={item.produto_quantidade_aplicada || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].produto_quantidade_aplicada = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="Óleo lubrificante - 500ml"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Material / Acabamento</label>
                      <input
                        type="text"
                        value={item.material_acabamento || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].material_acabamento = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="Aço galvanizado"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Onde Aplicado</label>
                      <input
                        type="text"
                        value={item.material_onde_aplicado || ''}
                        onChange={(e) => {
                          const newItems = [...formData.line_items];
                          newItems[index].material_onde_aplicado = e.target.value;
                          handleHeaderChange('line_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        placeholder="Rolamentos principais"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        line_items: prev.line_items.filter((_, i) => i !== index),
                      }))}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 size={16} />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parts to be Replaced Section */}
          <PartsListSection
            parts={parts.parts1}
            listNumber={1}
            isEditing={true}
            onAddPart={addPart}
            onUpdatePart={(idx, field, value) => updatePart(1, idx, field, value)}
            onRemovePart={(idx) => removePart(1, idx)}
          />

          {/* Parts Replaced Section */}
          <PartsListSection
            parts={parts.parts2}
            listNumber={2}
            isEditing={true}
            onAddPart={addPart}
            onUpdatePart={(idx, field, value) => updatePart(2, idx, field, value)}
            onRemovePart={(idx) => removePart(2, idx)}
          />

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {submitting ? 'Salvando...' : 'Salvar Relatório'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
