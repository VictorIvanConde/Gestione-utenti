interface FilterOption<T> {
    label: string;
    value: T;
}

interface FilterSelectorProps<T> {
    options: FilterOption<T>[];
    currentFilter: T;
    onFilterChange: (filter: T) => void;
}

export const FilterSelector = <T,>({ options, currentFilter, onFilterChange }: FilterSelectorProps<T>) => {
    return (
        <div className="filters">
            {options.map((f, index) => (
                <button
                    key={index}
                    className={`filter-btn ${currentFilter === f.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(f.value)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};
