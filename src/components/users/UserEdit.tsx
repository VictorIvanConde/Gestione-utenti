import React, { useState, useEffect } from 'react';
import type { User, ApiStatus } from '../../types/user';
import { userService } from '../../services/userService';

interface UserEditProps {
    userId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const UserEdit: React.FC<UserEditProps> = ({ userId, onSuccess, onCancel }) => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [formData, setFormData] = useState<Partial<User>>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        isActive: true
    });

    useEffect(() => {
        const fetchUser = async () => {
            setStatus('loading');
            try {
                const data = await userService.getById(userId);
                if (data) {
                    setFormData(data);
                    setStatus('idle');
                } else {
                    setStatus('empty');
                }
            } catch (error) {
                console.error("Errore fetchUser:", error);
                setStatus('error');
            }
        };
        fetchUser();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Gestione corretta del boolean per la select
        const finalValue = name === 'isActive' ? (value === 'true') : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            // Pulizia dell'oggetto prima dell'invio
            const { id, ...updatePayload } = formData as any;
            
            // Gestione middleName vuoto come nella creazione
            if (updatePayload.middleName && updatePayload.middleName.trim() === '') {
                updatePayload.middleName = null; // o delete updatePayload.middleName;
            }

            console.log("Invio aggiornamento per ID:", userId, updatePayload);
            
            await userService.update(userId, updatePayload);
            setStatus('success');
            onSuccess();
        } catch (error) {
            console.error("Errore durante l'update:", error);
            setStatus('error');
            alert("Errore durante il salvataggio delle modifiche.");
        }
    };

    if (status === 'loading' && !formData.username) return <div className="status-msg"><div className="loader"></div><p>Caricamento dati...</p></div>;

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="subtitle">Modifica Utente</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="username" 
                            value={formData.username || ''} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={25}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            className="form-control"
                            type="email" 
                            name="email" 
                            value={formData.email || ''} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nome</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="firstName" 
                            value={formData.firstName || ''} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={30}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cognome</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="lastName" 
                            value={formData.lastName || ''} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={30}
                        />
                    </div>
                    <div className="form-group">
                        <label>Secondo Nome</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="middleName" 
                            value={formData.middleName || ''} 
                            onChange={handleInputChange} 
                            maxLength={30}
                        />
                    </div>
                    <div className="form-group">
                        <label>Stato</label>
                        <select 
                            className="form-control" 
                            name="isActive" 
                            value={formData.isActive ? 'true' : 'false'}
                            onChange={handleInputChange}
                        >
                            <option value="true">Attivo</option>
                            <option value="false">Inattivo</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={status === 'loading'}>
                        Annulla
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Salvataggio...' : 'Salva Modifiche'}
                    </button>
                </div>
            </form>
            {status === 'error' && <p style={{ color: 'var(--error)', marginTop: '16px', fontSize: '0.9rem' }}>Si è verificato un errore. Riprova.</p>}
        </div>
    );
};
