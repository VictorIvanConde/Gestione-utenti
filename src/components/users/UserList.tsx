import React, { useState, useEffect } from 'react';
import type { User, ApiStatus, UserFilterType } from '../../types/user';
import { userService } from '../../services/userService';
import { userHelper } from '../../helpers/userHelper';
import { StatusWrapper } from '../common/StatusWrapper';
import { FilterSelector } from '../common/FilterSelector';
import { Modal } from '../common/Modal';
import { DataTable } from '../common/DataTable';
import type { Column } from '../common/DataTable';

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
    const [pageSize, setPageSize] = useState<number | 'ALL'>(5);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
        isOpen: false,
        userId: null
    });

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
    const effectivePageSize = pageSize === 'ALL' ? filteredUsers.length : pageSize;
    const paginatedUsers = userHelper.paginateUsers(filteredUsers, currentPage, effectivePageSize || 1);
    const totalPages = pageSize === 'ALL' ? 1 : Math.ceil(filteredUsers.length / (pageSize as number));

    const columns: Column<User>[] = [
        { header: 'Username', key: 'username', render: (u) => <span className="bold-text">{u.username}</span> },
        { header: 'Nome', key: 'firstName' },
        { header: '2° Nome', key: 'middleName', render: (u) => <span className="text-muted">{u.middleName || '-'}</span> },
        { header: 'Cognome', key: 'lastName' },
        { header: 'Email', key: 'email' },
        { 
            header: 'Stato', 
            key: 'isActive', 
            render: (u) => (
                <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {u.isActive ? '● Attivo' : '○ Inattivo'}
                </span>
            ) 
        }
    ];

    const filterOptions: { label: string; value: UserFilterType }[] = [
        { label: 'Tutti', value: 'ALL' },
        { label: 'Attivi', value: 'ACTIVE' },
        { label: 'Inattivi', value: 'INACTIVE' }
    ];

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 className="subtitle" style={{ margin: 0 }}>Elenco Utenti</h2>
                <button className="btn btn-primary" onClick={onNavigateToCreate}>
                    <span>+</span> Nuovo Utente
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
                <FilterSelector 
                    options={filterOptions}
                    currentFilter={filter} 
                    onFilterChange={(f) => { setFilter(f); setCurrentPage(1); }} 
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Mostra:</label>
                    <select 
                        className="form-control" 
                        style={{ width: 'auto', padding: '8px 36px 8px 16px', fontSize: '0.85rem' }}
                        value={pageSize}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPageSize(val === 'ALL' ? 'ALL' : parseInt(val));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5 utenti</option>
                        <option value={10}>10 utenti</option>
                        <option value={15}>15 utenti</option>
                        <option value={20}>20 utenti</option>
                        <option value={25}>25 utenti</option>
                        <option value="ALL">Tutti</option>
                    </select>
                </div>
            </div>

            <StatusWrapper status={status} isEmpty={filteredUsers.length === 0}>
                <DataTable 
                    data={paginatedUsers}
                    columns={columns}
                    onRowClick={(u) => onSelectUser(u.id)}
                    actions={(u) => (
                        <>
                            <button className="btn btn-secondary btn-sm" onClick={(e) => handleEdit(e, u.id)} title="Modifica">✎</button>
                            <button className="btn btn-danger btn-sm" onClick={(e) => openDeleteModal(e, u.id)} title="Elimina">🗑</button>
                        </>
                    )}
                />

                {pageSize !== 'ALL' && (
                    <div className="pagination">
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Pagina <strong>{currentPage}</strong> di {totalPages || 1}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: '8px 16px' }}>←</button>
                            <button className="btn btn-secondary" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: '8px 16px' }}>→</button>
                        </div>
                    </div>
                )}
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
