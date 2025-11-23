import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function PatientSearch({ value, onChange, placeholder }) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce: Wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="patient-search">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {localValue && (
        <button className="clear-button" onClick={handleClear} type="button">
          <X size={20} />
        </button>
      )}
    </div>
  );
}
