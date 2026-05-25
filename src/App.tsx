import React, { useState } from 'react';
import { UserList } from './components/users/UserList';
import { UserDetail } from './components/users/UserDetail';
import { UserCreate } from './components/users/UserCreate';
import { UserEdit } from './components/users/UserEdit';
import './App.css';

type ViewState = 
  | { type: 'LIST' } 
  | { type: 'DETAIL'; userId: string } 
  | { type: 'CREATE' }
  | { type: 'EDIT'; userId: string };

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'LIST' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerListRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="container">
      <h1 className="title">Gestionale Utenti</h1>

      {currentView.type === 'LIST' && (
        <UserList
          onSelectUser={(id) => setCurrentView({ type: 'DETAIL', userId: id })}
          onEditUser={(id) => setCurrentView({ type: 'EDIT', userId: id })}
          onNavigateToCreate={() => setCurrentView({ type: 'CREATE' })}
          refreshTrigger={refreshTrigger}
          onRefresh={triggerListRefresh}
        />
      )}

      {currentView.type === 'DETAIL' && (
        <UserDetail
          userId={currentView.userId}
          onBack={() => setCurrentView({ type: 'LIST' })}
        />
      )}

      {currentView.type === 'CREATE' && (
        <UserCreate
          onSuccess={() => {
            triggerListRefresh();
            setCurrentView({ type: 'LIST' });
          }}
          onCancel={() => setCurrentView({ type: 'LIST' })}
        />
      )}

      {currentView.type === 'EDIT' && (
        <UserEdit
          userId={currentView.userId}
          onSuccess={() => {
            triggerListRefresh();
            setCurrentView({ type: 'LIST' });
          }}
          onCancel={() => setCurrentView({ type: 'LIST' })}
        />
      )}
    </div>
  );
};

export default App;
