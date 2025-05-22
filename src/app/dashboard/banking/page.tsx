'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
  balance: number;
  connected: boolean;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  reconciled: boolean;
}

export default function BankingPage() {
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [formBank, setFormBank] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  
  // En una aplicación real, estos datos vendrían de la API
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'Cuenta Principal',
      accountNumber: 'ES91 2100 0418 4502 0005 1332',
      bank: 'CaixaBank',
      balance: 12450.75,
      connected: true
    },
    {
      id: '2',
      name: 'Cuenta Secundaria',
      accountNumber: 'ES79 2038 5778 9830 0076 0236',
      bank: 'Bankia',
      balance: 3782.20,
      connected: false
    }
  ]);
  
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    accounts.find(account => account.connected)?.id || null
  );
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 't1',
      description: 'Pago de alquiler - Apartamento Madrid',
      amount: 850,
      date: '2023-10-05',
      category: 'Ingresos',
      reconciled: true
    },
    {
      id: 't2',
      description: 'Factura luz - Apartamento Madrid',
      amount: -120.5,
      date: '2023-10-10',
      category: 'Gastos',
      reconciled: true
    },
    {
      id: 't3',
      description: 'Factura agua - Chalet Barcelona',
      amount: -85.30,
      date: '2023-10-15',
      category: 'Gastos',
      reconciled: false
    },
    {
      id: 't4',
      description: 'Pago de alquiler - Chalet Barcelona',
      amount: 1200,
      date: '2023-10-01',
      category: 'Ingresos',
      reconciled: true
    },
    {
      id: 't5',
      description: 'Reparación fontanería - Piso Valencia',
      amount: -175,
      date: '2023-10-08',
      category: 'Mantenimiento',
      reconciled: false
    }
  ]);
  
  const handleConnect = () => {
    setConnecting(true);
    
    // Simular conexión con la API de Open Banking
    setTimeout(() => {
      const newAccount: BankAccount = {
        id: `${accounts.length + 1}`,
        name: formAccountName,
        accountNumber: formAccountNumber,
        bank: formBank,
        balance: 0, // Se actualizaría al conectar con la API real
        connected: false // Pendiente de autorización
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setConnecting(false);
      setShowConnectForm(false);
      setFormBank('');
      setFormAccountNumber('');
      setFormAccountName('');
    }, 1500);
  };
  
  const handleAuthorize = (accountId: string) => {
    // En una aplicación real, aquí se redireccionaría al usuario al portal del banco
    // para autorizar el acceso a la cuenta
    
    // Simulamos actualización del estado
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, connected: true } 
          : account
      )
    );
    
    setSelectedAccount(accountId);
  };
  
  const handleSync = () => {
    setLoading(true);
    
    // Simular sincronización con la API del banco
    setTimeout(() => {
      // Añadir nuevas transacciones simuladas
      const newTransactions: Transaction[] = [
        {
          id: `t${transactions.length + 1}`,
          description: 'Nuevo pago recibido',
          amount: 950,
          date: new Date().toISOString().split('T')[0],
          category: 'Ingresos',
          reconciled: false
        },
        {
          id: `t${transactions.length + 2}`,
          description: 'Pago de servicios',
          amount: -150.25,
          date: new Date().toISOString().split('T')[0],
          category: 'Gastos',
          reconciled: false
        }
      ];
      
      setTransactions(prev => [...newTransactions, ...prev]);
      setLoading(false);
    }, 2000);
  };
  
  const selectedAccountData = accounts.find(account => account.id === selectedAccount);
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión Bancaria</h1>
        
        {/* Cuentas bancarias */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cuentas bancarias</h2>
            <button
              onClick={() => setShowConnectForm(!showConnectForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              {showConnectForm ? 'Cancelar' : 'Conectar nueva cuenta'}
            </button>
          </div>
          
          {showConnectForm && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium mb-3">Conectar nueva cuenta bancaria</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
                  <select
                    id="bank"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar banco</option>
                    <option value="CaixaBank">CaixaBank</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Santander">Santander</option>
                    <option value="Bankia">Bankia</option>
                    <option value="Sabadell">Sabadell</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="account-number" className="block text-sm font-medium text-gray-700 mb-1">Número de cuenta (IBAN)</label>
                  <input
                    type="text"
                    id="account-number"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    value={formAccountNumber}
                    onChange={(e) => setFormAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la cuenta</label>
                  <input
                    type="text"
                    id="account-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ej. Cuenta Principal"
                    value={formAccountName}
                    onChange={(e) => setFormAccountName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleConnect}
                  disabled={connecting || !formBank || !formAccountNumber || !formAccountName}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? 'Conectando...' : 'Conectar'}
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(account => (
              <div
                key={account.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAccount === account.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => account.connected && setSelectedAccount(account.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.bank}</p>
                    <p className="text-xs text-gray-500 mt-1">{account.accountNumber}</p>
                  </div>
                  {account.connected ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Conectada</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAuthorize(account.id);
                      }}
                      className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full"
                    >
                      Autorizar
                    </button>
                  )}
                </div>
                {account.connected && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Saldo</span>
                      <span className="font-semibold">{account.balance.toLocaleString('es-ES')} €</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Transacciones */}
        {selectedAccountData && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-semibold">Transacciones de {selectedAccountData.name}</h2>
              <button
                onClick={handleSync}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {transaction.reconciled ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Reconciliado
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 