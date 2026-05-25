import React, { useState } from 'react';
import type { UserCreateInput, ApiStatus } from '../../types/user';
import { userService } from '../../services/userService';

interface UserCreateProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const UserCreate: React.FC<UserCreateProps> = ({ onSuccess, onCancel }) => {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [formData, setFormData] = useState<UserCreateInput>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await userService.create(formData);
            setStatus('success');
            onSuccess();
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="subtitle">Crea Nuovo Utente</h2>
            <p style={{ marginBottom: '24px', color: 'var(--text)', fontSize: '0.9rem' }}>
                Inserisci i dati per registrare un nuovo utente nel sistema. I campi contrassegnati con * sono obbligatori.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                        <label>Username *</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="Es. mario.rossi"
                            maxLength={25}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input 
                            className="form-control"
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="email@esempio.it"
                            maxLength={50}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nome *</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={30}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cognome *</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            required 
                            maxLength={30}
                        />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Secondo Nome (Facoltativo)</label>
                        <input 
                            className="form-control"
                            type="text" 
                            name="middleName" 
                            value={formData.middleName} 
                            onChange={handleInputChange} 
                            maxLength={30}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={status === 'loading'}>
                        Annulla
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                        {status === 'loading' ? (
                            <>
                                <div className="loader" style={{ width: '16px', height: '16px', borderTopWidth: '2px', borderRightWidth: '2px', margin: 0 }}></div>
                                Salvataggio...
                            </>
                        ) : 'Salva Utente'}
                    </button>
                </div>
            </form>
        </div>
    );
};