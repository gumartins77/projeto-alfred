'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Login from '@/components/Login';
import ClientDataSection from '@/components/ClientDataSection';
import PartsListSection from '@/components/PartsListSection';
import SignaturesSection from '@/components/SignaturesSection';
import { MaintenanceReport, MaintenanceReportPart, MaintenanceLineItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { generatePDF } from '@/lib/pdf';
import { fetchReportParts, bulkCreateReportParts, deleteReportParts } from '@/lib/parts';

export default function RelatorioPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [formData, setFormData] = useState<MaintenanceReport | null>(null);
  const [parts, setParts] = useState<{ parts1: MaintenanceReportPart[]; parts2: MaintenanceReportPart[] }>({
    parts1: [],
    parts2: [],
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
        fetchReport();
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;

      const report = {
        ...data,
        line_items: typeof data.line_items === 'string'
          ? JSON.parse(data.line_items)
          : data.line_items || [],
      };

      setFormData(report);

      // Fetch parts
      const parts1 = await fetchReportParts(reportId, 1);
      const parts2 = await fetchReportParts(reportId, 2);
      setParts({ parts1, parts2 });
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      alert('Relatório não encontrado');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (field: keyof MaintenanceReport, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? {
      ...prev,
      [field]: value,
    } : null);
  };

  const addPart = (listNumber: 1 | 2) => {
    setParts(prev => ({
      ...prev,
      [listNumber === 1 ? 'parts1' : 'parts2']: [
        ...prev[listNumber === 1 ? 'parts1' : 'parts2'],
        { report_id: reportId, list_number: listNumber, machine_number: '', fig: '', item: '', quantity: undefined, description: '' } as MaintenanceReportPart,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSubmitting(true);

    try {
      const validLineItems = formData.line_items.filter(
        item => item.tipo_maquina || item.numero_maquina || item.numero_patrimonio || item.produto_quantidade_aplicada || item.material_acabamento || item.material_onde_aplicado
      );

      const { error } = await supabase
        .from('maintenance_reports')
        .update({
          ...formData,
          line_items: validLineItems,
        })
        .eq('id', reportId);

      if (error) throw error;

      // Delete and recreate parts
      await deleteReportParts(reportId, 1);
      await deleteReportParts(reportId, 2);

      const allParts: Omit<MaintenanceReportPart, 'id' | 'created_at' | 'updated_at'>[] = [
        ...parts.parts1.filter(p => p.machine_number || p.fig || p.item || p.description).map(p => ({ 
          report_id: reportId,
          list_number: 1 as const,
          machine_number: p.machine_number,
          fig: p.fig,
          item: p.item,
          quantity: p.quantity,
          description: p.description,
        })),
        ...parts.parts2.filter(p => p.machine_number || p.fig || p.item || p.description).map(p => ({ 
          report_id: reportId,
          list_number: 2 as const,
          machine_number: p.machine_number,
          fig: p.fig,
          item: p.item,
          quantity: p.quantity,
          description: p.description,
        })),
      ];

      if (allParts.length > 0) {
        await bulkCreateReportParts(allParts);
      }

      setIsEditing(false);
      alert('Relatório atualizado com sucesso!');
    } catch (error: any) {
      alert('Erro ao atualizar relatório: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!formData) return;
    setGeneratingPdf(true);

    try {
      await generatePDF(formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF');
    } finally {
      setGeneratingPdf(false);
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

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Relatório não encontrado</p>
          </div>
        </main>
      </div>
    );
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
            Relatório - {formData.machine_number}
          </h2>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
              >
                Editar
              </button>
              <button
                onClick={handleGeneratePdf}
                disabled={generatingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium text-sm"
              >
                <Download size={18} />
                <span>{generatingPdf ? 'Gerando...' : 'Gerar PDF'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium text-sm"
              >
                Cancelar
              </button>
            </>
          )}
        </div>

        {!isEditing ? (
          // View Mode
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-8">
            <ClientDataSection formData={formData} isEditing={false} onChangeField={handleHeaderChange} />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Equipamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Nº Máquina</p>
                  <p className="text-lg font-semibold text-gray-800">{formData.machine_number}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Data</p>
                  <p className="text-lg font-semibold text-gray-800">{formatDate(formData.date)}</p>
                </div>
                {formData.start_time && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-600">Início</p>
                    <p className="text-lg font-semibold text-gray-800">{formData.start_time}</p>
                  </div>
                )}
                {formData.end_time && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-600">Término</p>
                    <p className="text-lg font-semibold text-gray-800">{formData.end_time}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Local</p>
                  <p className="text-lg font-semibold text-gray-800">{formData.location}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Responsável</p>
                  <p className="text-lg font-semibold text-gray-800">{formData.responsible}</p>
                </div>
              </div>
              {formData.observations && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">Observações</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{formData.observations}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Itens de Manutenção</h3>
              {formData.line_items.length === 0 ? (
                <p className="text-gray-500">Nenhum item registrado</p>
              ) : (
                <div className="space-y-3">
                  {formData.line_items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Tipo de Máquina</p>
                          <p className="font-semibold text-gray-800">{item.tipo_maquina || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Número da Máquina</p>
                          <p className="font-semibold text-gray-800">{item.numero_maquina || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Nº Patrimônio</p>
                          <p className="font-semibold text-gray-800">{item.numero_patrimonio || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Produto / Qtd Aplicada</p>
                          <p className="font-semibold text-gray-800">{item.produto_quantidade_aplicada || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Material / Acabamento</p>
                          <p className="font-semibold text-gray-800">{item.material_acabamento || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">Onde Aplicado</p>
                          <p className="font-semibold text-gray-800">{item.material_onde_aplicado || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <PartsListSection
              parts={parts.parts1}
              listNumber={1}
              isEditing={false}
              onAddPart={addPart}
              onUpdatePart={updatePart}
              onRemovePart={removePart}
            />

            <PartsListSection
              parts={parts.parts2}
              listNumber={2}
              isEditing={false}
              onAddPart={addPart}
              onUpdatePart={updatePart}
              onRemovePart={removePart}
            />

            <SignaturesSection formData={formData} isEditing={false} onChangeField={handleHeaderChange} />
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-8">
            <ClientDataSection formData={formData} isEditing={true} onChangeField={handleHeaderChange} />

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Equipamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nº Máquina</label>
                  <input
                    type="text"
                    value={formData.machine_number}
                    onChange={(e) => handleHeaderChange('machine_number', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleHeaderChange('date', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Início</label>
                  <input
                    type="time"
                    value={formData.start_time || ''}
                    onChange={(e) => handleHeaderChange('start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Término</label>
                  <input
                    type="time"
                    value={formData.end_time || ''}
                    onChange={(e) => handleHeaderChange('end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleHeaderChange('location', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => handleHeaderChange('responsible', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observations || ''}
                  onChange={(e) => handleHeaderChange('observations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Itens de Manutenção</h3>
                <button
                  type="button"
                  onClick={() => setFormData(prev => prev ? {
                    ...prev,
                    line_items: [
                      ...prev.line_items,
                      { tipo_maquina: '', numero_maquina: '', numero_patrimonio: '', produto_quantidade_aplicada: '', material_acabamento: '', material_onde_aplicado: '' },
                    ],
                  } : null)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition text-sm"
                >
                  <Plus size={18} />
                  <span>Adicionar Item</span>
                </button>
              </div>

              <div className="space-y-3">
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
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Produto / Qtd Aplicada</label>
                        <input
                          type="text"
                          value={item.produto_quantidade_aplicada || ''}
                          onChange={(e) => {
                            const newItems = [...formData.line_items];
                            newItems[index].produto_quantidade_aplicada = e.target.value;
                            handleHeaderChange('line_items', newItems);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
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
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => prev ? {
                          ...prev,
                          line_items: prev.line_items.filter((_, i) => i !== index),
                        } : null)}
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

            <PartsListSection
              parts={parts.parts1}
              listNumber={1}
              isEditing={true}
              onAddPart={addPart}
              onUpdatePart={(idx, field, value) => updatePart(1, idx, field, value)}
              onRemovePart={(idx) => removePart(1, idx)}
            />

            <PartsListSection
              parts={parts.parts2}
              listNumber={2}
              isEditing={true}
              onAddPart={addPart}
              onUpdatePart={(idx, field, value) => updatePart(2, idx, field, value)}
              onRemovePart={(idx) => removePart(2, idx)}
            />

            <SignaturesSection formData={formData} isEditing={true} onChangeField={handleHeaderChange} />

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
              >
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
