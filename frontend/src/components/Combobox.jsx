// components/ui/combobox.jsx
import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({ options = [], onSelect }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelect = (val) => {
    setValue(val);
    setOpen(false);
    onSelect(val);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-[#1a1a1a] border-white/10 text-white"
        >
          {value || "Search for a player..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-[#232323] text-white border border-white/10">
        <Command>
          <CommandInput
            placeholder="Search players..."
            className="text-white placeholder:text-gray-400"
          />
          <CommandEmpty>No player found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(option.full_name)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.full_name ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.full_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
