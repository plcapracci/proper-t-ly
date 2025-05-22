'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

interface Report {
  id: string;
  name: string;
  year: number;
  quarter?: number;
  type: 'MODELO_303' | 'MODELO_130' | 'MODELO_100' | 'MODELO_210' | 'RESUMEN_ANUAL';
  status: 'DRAFT' | 'GENERATED' | 'SUBMITTED';
  fileUrl?: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<Report['type']>('MODELO_303');
  
  // En una aplicación real, estos datos vendrían de la API
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Modelo 303 - Q1 2023',
      year: 2023,
      quarter: 1,
      type: 'MODELO_303',
      status: 'SUBMITTED',
      fileUrl: '#',
      createdAt: '2023-04-15'
    },
    {
      id: '2',
      name: 'Modelo 303 - Q2 2023',
      year: 2023,
      quarter: 2,
      type: 'MODELO_303',
      status: 'SUBMITTED',
      fileUrl: '#',
      createdAt: '2023-07-15'
    },
    {
      id: '3',
      name: 'Modelo 303 - Q3 2023',
      year: 2023,
      quarter: 3,
      type: 'MODELO_303',
      status: 'GENERATED',
      fileUrl: '#',
      createdAt: '2023-10-10'
    },
    {
      id: '4',
      name: 'Modelo 130 - Q3 2023',
      year: 2023,
      quarter: 3,
      type: 'MODELO_130',
      status: 'DRAFT',
      createdAt: '2023-10-05'
    }
  ]);
  
  const pendingReports = reports.filter(report => ['DRAFT', 'GENERATED'].includes(report.status));
  const submittedReports = reports.filter(report => report.status === 'SUBMITTED');
  
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    
    // Simular una llamada a la API para generar un informe
    setTimeout(() => {
      const newReport: Report = {
        id: `${reports.length + 1}`,
        name: `${selectedType} - ${selectedQuarter ? `Q${selectedQuarter} ` : ''}${selectedYear}`,
        year: selectedYear,
        quarter: selectedQuarter || undefined,
        type: selectedType,
        status: 'DRAFT',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setReports(prev => [...prev, newReport]);
      setGeneratingReport(false);
    }, 2000);
  };
  
  const handleSubmitReport = (reportId: string) => {
    // Actualizar el estado del informe a SUBMITTED
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'SUBMITTED' } 
          : report
      )
    );
  };
  
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-medium">Borrador</span>;
      case 'GENERATED':
        return <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs font-medium">Generado</span>;
      case 'SUBMITTED':
        return <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium">Presentado</span>;
    }
  };
  
  const getTypeTranslation = (type: Report['type']) => {
    switch (type) {
      case 'MODELO_303': return 'Modelo 303 (IVA)';
      case 'MODELO_130': return 'Modelo 130 (IRPF)';
      case 'MODELO_100': return 'Modelo 100 (IRPF Anual)';
      case 'MODELO_210': return 'Modelo 210 (No Residentes)';
      case 'RESUMEN_ANUAL': return 'Resumen Anual';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Informes para Hacienda</h1>
        
        {/* Generar nuevo informe */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Generar nuevo informe</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de informe</label>
              <select
                id="report-type"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as Report['type'])}
              >
                <option value="MODELO_303">Modelo 303 (IVA)</option>
                <option value="MODELO_130">Modelo 130 (IRPF)</option>
                <option value="MODELO_100">Modelo 100 (IRPF Anual)</option>
                <option value="MODELO_210">Modelo 210 (No Residentes)</option>
                <option value="RESUMEN_ANUAL">Resumen Anual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="report-year" className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                id="report-year"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2023, 2022, 2021, 2020].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="report-quarter" className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
              <select
                id="report-quarter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedQuarter || ''}
                onChange={(e) => setSelectedQuarter(e.target.value ? Number(e.target.value) : null)}
                disabled={selectedType === 'MODELO_100' || selectedType === 'RESUMEN_ANUAL'}
              >
                <option value="">Seleccionar trimestre</option>
                <option value="1">Primer Trimestre</option>
                <option value="2">Segundo Trimestre</option>
                <option value="3">Tercer Trimestre</option>
                <option value="4">Cuarto Trimestre</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport || (!selectedQuarter && selectedType !== 'MODELO_100' && selectedType !== 'RESUMEN_ANUAL')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingReport ? 'Generando...' : 'Generar Informe'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pendientes ({pendingReports.length})
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'submitted'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('submitted')}
            >
              Presentados ({submittedReports.length})
            </button>
          </nav>
        </div>
        
        {/* Lista de informes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periodo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'pending' ? pendingReports : submittedReports).map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">Creado: {report.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getTypeTranslation(report.type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {report.quarter ? `Q${report.quarter} ` : ''}{report.year}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === 'DRAFT' && (
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                    )}
                    
                    {report.status !== 'SUBMITTED' && (
                      <button
                        className="text-green-600 hover:text-green-900 mr-4"
                        onClick={() => handleSubmitReport(report.id)}
                      >
                        Presentar
                      </button>
                    )}
                    
                    {report.fileUrl && (
                      <a
                        href={report.fileUrl}
                        className="text-gray-600 hover:text-gray-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              
              {(activeTab === 'pending' ? pendingReports.length === 0 : submittedReports.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No hay informes {activeTab === 'pending' ? 'pendientes' : 'presentados'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 