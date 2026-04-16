import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { Fragment } from "react";

export default function FormDropdown({
  icon: Icon,
  options,
  value,
  onChange,
  placeholder = "Select",
  size = "md",
  className = "",
}) {
  const selectedOption = options.find((opt) => opt.id === value);

  const sizes = {
    sm: {
      container: "w-40",
      button: "py-2 px-3 text-xs font-bold uppercase tracking-wider",
      iconLeft: "left-3",
      iconRight: "right-3",
      paddingLeft: Icon ? "pl-9" : "px-3",
      iconSize: 14,
    },
    md: {
      container: "w-full",
      button: "py-3.5 px-4 text-lg font-medium",
      iconLeft: "left-4",
      iconRight: "right-4",
      paddingLeft: Icon ? "pl-12" : "px-4",
      iconSize: 20,
    },
  };

  const s = sizes[size];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative group ${s.container} ${className}`}>
        {Icon && (
          <div
            className={`absolute ${s.iconLeft} top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-accent transition-colors z-10 pointer-events-none`}
          >
            <Icon size={s.iconSize} strokeWidth={2.5} />
          </div>
        )}

        <ListboxButton
          className={`relative w-full text-left rounded-xl bg-muted/20 border border-border-subtle text-foreground outline-hidden transition-all duration-200 focus:bg-background focus:border-accent focus:ring-4 focus:ring-accent/10 ${s.button} ${s.paddingLeft} pr-8`}
        >
          <span
            className={`block truncate ${!selectedOption ? "text-muted-foreground/50" : ""}`}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <span
            className={`absolute ${s.iconRight} top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/50`}
          >
            <ChevronDown size={s.iconSize} strokeWidth={2.5} />
          </span>
        </ListboxButton>

        {/* ── THE FIX: Use anchor and Portal logic ── */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            // 🔥 This makes the menu float above the table overflow
            anchor="bottom start"
            className="
              z-100 [--anchor-gap:4px]
              w-(--button-width) rounded-xl 
              bg-card/95 backdrop-blur-xl border border-border-subtle 
              shadow-2xl py-1 focus:outline-hidden
            "
          >
            {options.map((opt) => (
              <ListboxOption
                key={opt.id}
                value={opt.id}
                className={({ focus }) => `
                  relative cursor-pointer select-none py-2 px-8 text-sm transition-colors
                  ${focus ? "bg-accent text-white" : "text-foreground"}
                `}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-bold" : ""}`}
                    >
                      {opt.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-2 flex items-center">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
