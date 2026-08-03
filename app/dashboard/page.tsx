'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Login from '@/components/Login';
import { MaintenanceReport } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Plus, Search, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.machine_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.responsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(report =>
        report.date === dateFilter
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, dateFilter, reports]);

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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar por máquina, local ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
            {(searchTerm || dateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition text-sm"
              >
                Limpar
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
            {filteredReports.map((report) => (
              <Link
                key={report.id}
                href={`/relatorio/${report.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Máquina</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {report.machine_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Local</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {report.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Responsável</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {report.responsible}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Data</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(report.date)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
