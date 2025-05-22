'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ExpenseUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate uploading and processing with GPT/OCR
    for (const file of files) {
      // Create a new progress entry for this file
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));
      
      // Simulate progress updates
      const intervalId = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress >= 100) {
            clearInterval(intervalId);
            return prev;
          }
          return {
            ...prev,
            [file.name]: Math.min(currentProgress + 10, 100)
          };
        });
      }, 300);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(intervalId);
      
      // Add to uploaded files
      setUploadedFiles(prev => [...prev, file.name]);
    }
    
    // Clear the files list after upload
    setFiles([]);
    setUploading(false);
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Subir Gastos</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Carga de Documentos</h2>
          <p className="text-gray-600 mb-4">
            Sube facturas, recibos y otros documentos de gastos. El sistema extraerá automáticamente la información relevante mediante OCR y procesamiento con IA.
          </p>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            {isDragActive ? (
              <p className="text-blue-500">Suelta los archivos aquí...</p>
            ) : (
              <div>
                <p className="text-gray-600">Arrastra y suelta archivos aquí, o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500 mt-2">Formatos aceptados: JPG, PNG, PDF</p>
              </div>
            )}
          </div>
          
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Archivos seleccionados</h3>
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={file.name} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                    <div className="flex items-center">
                      {getFileIcon(file.name)}
                      <span className="ml-2 text-sm">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-red-500 hover:text-red-700"
                      disabled={uploading}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Procesando...' : 'Procesar Documentos'}
              </button>
            </div>
          )}
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Documentos Procesados</h2>
            <div className="space-y-4">
              {uploadedFiles.map((fileName) => (
                <div key={fileName} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {getFileIcon(fileName)}
                    <span className="ml-2 font-medium">{fileName}</span>
                    <span className="ml-auto text-green-600 text-sm font-medium">Procesado</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Información extraída (simulada):</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Fecha: {new Date().toLocaleDateString('es-ES')}</li>
                      <li>Proveedor: Ejemplo S.L.</li>
                      <li>Importe: {(Math.random() * 1000).toFixed(2)}€</li>
                      <li>Categoría: {['Suministros', 'Mantenimiento', 'Servicios', 'Impuestos'][Math.floor(Math.random() * 4)]}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 