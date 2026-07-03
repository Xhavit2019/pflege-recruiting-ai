import Input from "@/components/ui/Input";

type TextFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | null;
  required?: boolean;
};

export default function TextField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        required={required}
      />
    </div>
  );
}