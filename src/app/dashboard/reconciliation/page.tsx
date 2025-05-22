'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
  reconciled: boolean;
}

interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  property: {
    name: string;
  };
  transactionId?: string;
}

export default function ReconciliationPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<Record<string, boolean>>({});

  // En una aplicación real, estos datos vendrían de la API
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setTransactions([
        {
          id: '1',
          amount: -120.50,
          date: '2023-10-15',
          description: 'Factura Electricidad',
          category: 'Suministros',
          reconciled: false
        },
        {
          id: '2',
          amount: -85.30,
          date: '2023-10-10',
          description: 'Factura Agua',
          category: 'Suministros',
          reconciled: false
        },
        {
          id: '3',
          amount: -200.00,
          date: '2023-10-05',
          description: 'Reparación Fontanería',
          category: 'Mantenimiento',
          reconciled: true
        },
        {
          id: '4',
          amount: 850.00,
          date: '2023-10-01',
          description: 'Ingreso Alquiler',
          category: 'Ingresos',
          reconciled: true
        }
      ]);
      
      setExpenses([
        {
          id: 'e1',
          amount: 120.50,
          date: '2023-10-15',
          description: 'Factura Electricidad',
          category: 'Suministros',
          property: {
            name: 'Apartamento en Madrid'
          }
        },
        {
          id: 'e2',
          amount: 85.30,
          date: '2023-10-12',
          description: 'Factura Agua',
          category: 'Suministros',
          property: {
            name: 'Apartamento en Madrid'
          }
        },
        {
          id: 'e3',
          amount: 175.00,
          date: '2023-10-05',
          description: 'Reparación Fontanería',
          category: 'Mantenimiento',
          property: {
            name: 'Chalet en Barcelona'
          },
          transactionId: '3'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransaction(transactionId);
    // Resetear selección de gastos al cambiar de transacción
    setSelectedExpenses({});
  };

  const handleExpenseSelect = (expenseId: string) => {
    setSelectedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };

  const handleReconcile = () => {
    if (!selectedTransaction) return;
    
    // En una aplicación real, aquí se haría una llamada a la API
    // para guardar la reconciliación
    
    // Actualizar la UI para reflejar la reconciliación
    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === selectedTransaction
          ? { ...transaction, reconciled: true }
          : transaction
      )
    );
    
    // Actualizar gastos reconciliados
    const reconciled = Object.keys(selectedExpenses).filter(id => selectedExpenses[id]);
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        reconciled.includes(expense.id)
          ? { ...expense, transactionId: selectedTransaction }
          : expense
      )
    );
    
    // Resetear selección
    setSelectedTransaction(null);
    setSelectedExpenses({});
  };

  const getTransactionStatusClass = (transaction: Transaction) => {
    if (transaction.reconciled) return 'bg-green-50 border-green-200';
    if (transaction.id === selectedTransaction) return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  };

  const getExpenseStatusClass = (expense: Expense) => {
    if (expense.transactionId) return 'bg-green-50 border-green-200';
    if (selectedExpenses[expense.id]) return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Reconciliación Bancaria</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transacciones bancarias */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Transacciones Bancarias</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Descripción</span>
                    <span className="font-medium">Importe</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className={`p-4 border-l-4 ${
                        transaction.amount < 0 ? 'border-l-red-500' : 'border-l-green-500'
                      } ${getTransactionStatusClass(transaction)} cursor-pointer hover:bg-gray-50`}
                      onClick={() => !transaction.reconciled && handleTransactionSelect(transaction.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date} • {transaction.category}</p>
                        </div>
                        <div className={`font-medium ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                      </div>
                      {transaction.reconciled && (
                        <div className="mt-2 text-xs text-green-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Reconciliado
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Gastos */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Gastos</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Descripción</span>
                    <span className="font-medium">Importe</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                  {expenses.map(expense => (
                    <div
                      key={expense.id}
                      className={`p-4 ${getExpenseStatusClass(expense)} ${
                        selectedTransaction ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={() => selectedTransaction && !expense.transactionId && handleExpenseSelect(expense.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {expense.date} • {expense.category} • {expense.property.name}
                          </p>
                        </div>
                        <div className="font-medium text-red-600">
                          {expense.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                      </div>
                      {expense.transactionId && (
                        <div className="mt-2 text-xs text-green-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Reconciliado
                        </div>
                      )}
                      {selectedTransaction && !expense.transactionId && (
                        <div className="mt-2 flex justify-end">
                          <input
                            type="checkbox"
                            checked={!!selectedExpenses[expense.id]}
                            onChange={() => handleExpenseSelect(expense.id)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTransaction && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleReconcile}
                    disabled={Object.values(selectedExpenses).filter(Boolean).length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reconciliar Seleccionados
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 