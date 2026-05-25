import React, { useState, useEffect } from 'react';
import type { User, ApiStatus } from '../../types/user';
import { userService } from '../../services/userService';
import { userHelper } from '../../helpers/userHelper';
import { StatusWrapper } from '../common/StatusWrapper';

interface UserDetailProps {
    userId: string;
    onBack: () => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({ userId, onBack }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [status, setStatus] = useState<ApiStatus>('idle');

    useEffect(() => {
        const fetchUser = async () => {
            setStatus('loading');
            try {
                const data = await userService.getById(userId);
                if (data) {
                    setUser(data);
                    setStatus('success');
                } else {
                    setStatus('empty');
                }
            } catch (error) {
                setStatus('error');
            }
        };
        fetchUser();
    }, [userId]);

    return (
        <div className="card">
            <div style={{ marginBottom: '32px' }}>
                <button className="btn btn-secondary" onClick={onBack}>
                    ← Torna alla lista
                </button>
            </div>
            
            <h2 className="subtitle">Profilo Utente</h2>

            <StatusWrapper status={status} isEmpty={!user}>
                {user && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
                        <div className="detail-item">
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Username</label>
                            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{user.username}</p>
                        </div>
                        <div className="detail-item">
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Email</label>
                            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{user.email}</p>
                        </div>
                        <div className="detail-item">
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Nome Completo</label>
                            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{userHelper.getFullName(user)}</p>
                        </div>
                        <div className="detail-item">
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Stato Account</label>
                            <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`} style={{ marginTop: '4px', fontSize: '0.85rem' }}>
                                {user.isActive ? '● Attivo' : '○ Inattivo'}
                            </span>
                        </div>
                        <div className="detail-item" style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '8px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>ID Univoco Sistema</label>
                            <code style={{ fontSize: '0.9rem', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '6px', color: 'var(--accent-color)' }}>{user.id}</code>
                        </div>
                    </div>
                )}
            </StatusWrapper>
        </div>
    );
};