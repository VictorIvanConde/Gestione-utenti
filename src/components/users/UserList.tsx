import React, { useState, useEffect } from 'react';
import type { User, ApiStatus, UserFilterType } from '../../types/user';
import { userService } from '../../services/userService';
import { userHelper } from '../../helpers/userHelper';
import { StatusWrapper } from '../common/StatusWrapper';
import { FilterSelector } from '../common/FilterSelector';
import { Modal } from '../common/Modal';

interface UserListProps {
    onSelectUser: (id: string) => void;
    onEditUser: (id: string) => void;
    onNavigateToCreate: () => void;
    refreshTrigger: number;
    onRefresh: () => void;
}

export const UserList: React.FC<UserListProps> = ({ 
    onSelectUser, 
    onEditUser, 
    onNavigateToCreate, 
    refreshTrigger,
    onRefresh 
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [filter, setFilter] = useState<UserFilterType>('ALL');
    
    // State per la gestione della modale di cancellazione
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
        isOpen: false,
        userId: null
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            setStatus('loading');
            try {
                const data = await userService.getAll();
                setUsers(data);
                setStatus(data.length === 0 ? 'empty' : 'success');
            } catch (error) {
                setStatus('error');
            }
        };
        fetchUsers();
    }, [refreshTrigger]);

    const openDeleteModal = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, userId: id });
    };

    const confirmDelete = async () => {
        if (deleteModal.userId) {
            try {
                await userService.delete(deleteModal.userId);
                onRefresh();
            } catch (error) {
                alert('Errore durante l\'eliminazione');
            } finally {
                setDeleteModal({ isOpen: false, userId: null });
            }
        }
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onEditUser(id);
    };

    const filteredUsers = userHelper.filterUsers(users, filter);
    const paginatedUsers = userHelper.paginateUsers(filteredUsers, currentPage, pageSize);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 className="subtitle" style={{ margin: 0 }}>Elenco Utenti</h2>
                <button className="btn btn-primary" onClick={onNavigateToCreate}>
                    <span>+</span> Nuovo Utente
                </button>
            </div>

            <FilterSelector 
                currentFilter={filter} 
                onFilterChange={(f) => { setFilter(f); setCurrentPage(1); }} 
            />

            <StatusWrapper status={status} isEmpty={filteredUsers.length === 0}>
                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Nome</th>
                                <th>2° Nome</th>
                                <th>Cognome</th>
                                <th>Email</th>
                                <th>Stato</th>
                                <th style={{ textAlign: 'right' }}>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(user => (
                                <tr 
                                    key={user.id} 
                                    onClick={() => onSelectUser(user.id)}
                                    className="clickable-row"
                                >
                                    <td className="bold-text">{user.username}</td>
                                    <td>{user.firstName}</td>
                                    <td className="text-muted">{user.middleName || '-'}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                                            {user.isActive ? '● Attivo' : '○ Inattivo'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                className="btn btn-secondary btn-sm" 
                                                onClick={(e) => handleEdit(e, user.id)}
                                                title="Modifica"
                                            >
                                                ✎
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={(e) => openDeleteModal(e, user.id)}
                                                title="Elimina"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Pagina <strong>{currentPage}</strong> di {totalPages || 1}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className="btn btn-secondary" 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={{ padding: '8px 16px' }}
                        >
                            ←
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            disabled={currentPage >= totalPages} 
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{ padding: '8px 16px' }}
                        >
                            →
                        </button>
                    </div>
                </div>
            </StatusWrapper>

            <Modal 
                isOpen={deleteModal.isOpen}
                title="Conferma Eliminazione"
                message="Sei sicuro di voler eliminare questo utente? L'azione è irreversibile."
                confirmText="Elimina Utente"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
            />
        </div>
    );
};
