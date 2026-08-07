'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Login from '@/components/Login';
import { MaintenanceReport } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Plus, Search, Calendar, Download } from 'lucide-react';
import Link from 'next/link';
import { generateMonthlyPDF } from '@/lib/pdf';

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'today' | 'yesterday' | 'last7' | 'currentMonth' | 'last30' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [generatingMonthlyPdfGroup, setGeneratingMonthlyPdfGroup] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthenticated(true);
        fetchReports();
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('maintenance_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsedData = data?.map(report => ({
        ...report,
        line_items: typeof report.line_items === 'string' 
          ? JSON.parse(report.line_items) 
          : report.line_items || []
      })) || [];
      
      setReports(parsedData);
      setFilteredReports(parsedData);
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateToIso = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateRange = () => {
    const today = new Date();
    const todayIso = formatDateToIso(today.toISOString());

    const buildIso = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (dateFilterMode === 'today') {
      return { start: todayIso, end: todayIso };
    }

    if (dateFilterMode === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return { start: buildIso(yesterday), end: buildIso(yesterday) };
    }

    if (dateFilterMode === 'last7') {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return { start: buildIso(start), end: todayIso };
    }

    if (dateFilterMode === 'last30') {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      return { start: buildIso(start), end: todayIso };
    }

    if (dateFilterMode === 'currentMonth') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: buildIso(start), end: buildIso(end) };
    }

    if (dateFilterMode === 'custom' && customStartDate && customEndDate) {
      return {
        start: formatDateToIso(customStartDate),
        end: formatDateToIso(customEndDate),
      };
    }

    return null;
  };

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        (report.report_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.client_city || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const range = getDateRange();
    if (range?.start && range?.end) {
      filtered = filtered.filter(report => {
        const reportDate = formatDateToIso(report.date);
        return reportDate && reportDate >= range.start && reportDate <= range.end;
      });
    }

    setFilteredReports(filtered);
  }, [searchTerm, dateFilterMode, customStartDate, customEndDate, reports]);

  const groups = useMemo(() => {
    const map: Record<string, { key: string; label: string; reports: MaintenanceReport[] }> = {};

    filteredReports.forEach(report => {
      const date = new Date(report.date);
      if (Number.isNaN(date.getTime())) return;

      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      const label = `${monthNames[month]} ${year}`;

      if (!map[key]) {
        map[key] = { key, label, reports: [] };
      }

      map[key].reports.push(report);
    });

    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [filteredReports]);

  const hasSetInitialGroup = useRef(false);

  useEffect(() => {
    if (groups.length === 0) {
      setExpandedGroup(null);
      return;
    }

    if (!hasSetInitialGroup.current) {
      setExpandedGroup(groups[0].key);
      hasSetInitialGroup.current = true;
      return;
    }

    if (expandedGroup && !groups.some(group => group.key === expandedGroup)) {
      setExpandedGroup(groups[0].key);
    }
  }, [groups, expandedGroup]);

  const handleGenerateMonthlyPdf = async (groupKey: string, label: string, reportsForMonth: MaintenanceReport[]) => {
    setGeneratingMonthlyPdfGroup(groupKey);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const reportIds = reportsForMonth.map(report => report.id).filter(Boolean) as string[];
      if (reportIds.length === 0) return;

      const { data: partsData, error } = await supabase
        .from('maintenance_report_parts')
        .select('*')
        .in('report_id', reportIds)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const partsByReport = reportIds.reduce<Record<string, { parts1: any[]; parts2: any[] }>>((acc, id) => {
        acc[id] = { parts1: [], parts2: [] };
        return acc;
      }, {});

      (partsData || []).forEach((part: any) => {
        const reportId = part.report_id;
        if (!reportId || !partsByReport[reportId]) return;
        if (part.list_number === 1) {
          partsByReport[reportId].parts1.push(part);
        } else {
          partsByReport[reportId].parts2.push(part);
        }
      });

      await generateMonthlyPDF(reportsForMonth, partsByReport, label);
    } catch (error) {
      console.error('Erro ao gerar PDF mensal:', error);
      alert('Erro ao gerar o PDF mensal. Tente novamente.');
    } finally {
      setGeneratingMonthlyPdfGroup(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Meus Relatórios
          </h2>
          <Link
            href="/novo-relatorio"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus size={20} />
            <span>Novo Relatório</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar por relatório, cliente ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterMenuOpen((prev) => !prev)}
                className="w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition text-sm font-medium"
              >
                Filtrar por data
              </button>

              {filterMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: 'Hoje', value: 'today' },
                      { label: 'Ontem', value: 'yesterday' },
                      { label: 'Últimos 7 dias', value: 'last7' },
                      { label: 'Mês atual', value: 'currentMonth' },
                      { label: 'Últimos 30 dias', value: 'last30' },
                      { label: 'Personalizada', value: 'custom' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDateFilterMode(option.value as typeof dateFilterMode);
                          if (option.value !== 'custom') {
                            setCustomStartDate('');
                            setCustomEndDate('');
                            setFilterMenuOpen(false);
                          }
                        }}
                        className={`w-full px-3 py-2 text-sm rounded-lg border transition ${dateFilterMode === option.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {dateFilterMode === 'custom' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">De</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Até</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setFilterMenuOpen(false)}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      Fechar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setDateFilterMode('all');
                        setCustomStartDate('');
                        setCustomEndDate('');
                        setFilterMenuOpen(false);
                      }}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      Limpar filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {(searchTerm || dateFilterMode !== 'all' || customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilterMode('all');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              {reports.length === 0
                ? 'Você ainda não tem relatórios. Crie um novo!'
                : 'Nenhum relatório encontrado com os filtros selecionados.'}
            </p>
            {reports.length === 0 && (
              <Link
                href="/novo-relatorio"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Criar Primeiro Relatório
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.key} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(prev => prev === group.key ? null : group.key)}
                    className="text-left flex-1"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Mês</p>
                        <p className="text-xl font-semibold text-gray-800">{group.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{group.reports.length} relatório{group.reports.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateMonthlyPdf(group.key, group.label, group.reports)}
                    disabled={generatingMonthlyPdfGroup === group.key}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium text-sm"
                  >
                    <Download size={16} />
                    {generatingMonthlyPdfGroup === group.key ? 'Gerando...' : 'Gerar Relatório Mensal'}
                  </button>
                </div>

                {expandedGroup === group.key && (
                  <div className="p-4 space-y-3">
                    {group.reports.map((report) => (
                      <Link
                        key={report.id}
                        href={`/relatorio/${report.id}`}
                        className="block bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition p-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Relatório</p>
                            <p className="text-lg font-semibold text-gray-800">{report.report_number || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Cliente</p>
                            <p className="text-lg font-semibold text-gray-800">{report.client_name || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">Data</p>
                            <p className="text-lg font-semibold text-gray-800">{formatDate(report.date)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
