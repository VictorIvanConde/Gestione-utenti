import React from 'react';
import type { ApiStatus } from '../../types/user';

interface StatusWrapperProps {
    status: ApiStatus;
    children: React.ReactNode;
    errorMessage?: string;
    isEmpty: boolean;
}

export const StatusWrapper: React.FC<StatusWrapperProps> = ({ status, children, errorMessage, isEmpty }) => {
    if (status === 'loading') {
        return (
            <div className="status-msg">
                <div className="loader"></div>
                <p>Caricamento dati in corso...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="status-msg" style={{ color: '#dc2626' }}>
                <p><strong>Errore:</strong> {errorMessage || 'Si è verificato un problema durante il recupero dei dati.'}</p>
            </div>
        );
    }

    if (isEmpty || status === 'empty') {
        return (
            <div className="status-msg">
                <p>Nessun utente trovato con i criteri selezionati.</p>
            </div>
        );
    }

    return <>{children}</>;
};