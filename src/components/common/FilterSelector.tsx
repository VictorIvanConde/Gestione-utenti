import React from 'react';
import type { UserFilterType } from '../../types/user';

interface FilterSelectorProps {
    currentFilter: UserFilterType;
    onFilterChange: (filter: UserFilterType) => void;
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({ currentFilter, onFilterChange }) => {
    const filters: { label: string; value: UserFilterType }[] = [
        { label: 'Tutti', value: 'ALL' },
        { label: 'Attivi', value: 'ACTIVE' },
        { label: 'Non Attivi', value: 'INACTIVE' },
    ];

    return (
        <div className="filters">
            {filters.map((f) => (
                <button
                    key={f.value}
                    className={`filter-btn ${currentFilter === f.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(f.value)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};