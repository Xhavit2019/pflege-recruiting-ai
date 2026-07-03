import Select from "@/components/ui/Select";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string | null;
  required?: boolean;
};

export default function SelectField({
  label,
  name,
  options,
  defaultValue,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <Select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
      >
        <option value="">Bitte auswählen</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}