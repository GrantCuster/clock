import { ChevronDownIcon } from "lucide-react";

export function Button({
  children,
  active = false,
  onClick = () => {},
}: {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`${
        active ? "bg-blue-500 text-white" : "bg-neutral-700"
      } flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Select({
  children,
  onChange,
  value,
}: {
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}) {
  return (
    <label
      className={`p-0 bg-neutral-700 flex gap-2 items-center px-4 py-2 rounded-full relative text-white`}
    >
      {value} <ChevronDownIcon size={16} />
      <select
        className="appearance-none opacity-0 w-full h-full absolute left-0 top-0"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </label>
  );
}
