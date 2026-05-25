import React from 'react';

export interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
    width?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
}

export const DataTable = <T extends { id: string | number }>({ 
    data, 
    columns, 
    onRowClick,
    actions 
}: DataTableProps<T>) => {
    return (
        <div className="table-container">
            <table className="modern-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th 
                                key={index} 
                                style={{ textAlign: col.align || 'left', width: col.width }}
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && <th style={{ textAlign: 'right', minWidth: '120px' }}>Azioni</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr 
                            key={item.id} 
                            onClick={() => onRowClick?.(item)}
                            className={onRowClick ? 'clickable-row' : ''}
                        >
                            {columns.map((col, index) => (
                                <td 
                                    key={index} 
                                    style={{ textAlign: col.align || 'left' }}
                                >
                                    {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                                </td>
                            ))}
                            {actions && (
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {actions(item)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
