type FilterSelectProps = {
    label: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  };
  
  export const FilterSelect = ({ label, options, onChange }: FilterSelectProps) => {
    return (
      <div>
        <label>{label}</label>
        <select
          onChange={(e) => onChange(e.target.value)}
          className="border p-2"
        >
          <option value="">Todos</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };  