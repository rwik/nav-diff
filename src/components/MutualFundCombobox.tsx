import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MutualFundOption {
  value: string;
  label: string;
  schemeCode: string;
}

const funds: MutualFundOption[] = [
  { value: "navi-nifty", label: "Navi Nifty 50 Index Fund", schemeCode: "149039" },
  { value: "ppfc", label: "Parag Parikh Flexi Cap", schemeCode: "122639" },
  { value: "qm", label: "Quant Mid Cap", schemeCode: "120841" },
  { value: "qe", label: "Quant ESG Equity", schemeCode: "148564" },
  { value: "qs", label: "Quant Small Cap", schemeCode: "120828" },
  { value: "qa", label: "Quant Active Fund", schemeCode: "120823" },
  { value: "np", label: "Nippon India Nifty 500 Momentum 50", schemeCode: "152881" },
  { value: "mos", label: "Motilal Oswal Nifty MidSmall Healthcare", schemeCode: "153023" },
  { value: "hdfc", label: "HDFC Defence Fund", schemeCode: "151750" },
  { value: "edel", label: "Edelweiss Recently Listed IPO", schemeCode: "142388" },
  { value: "bd", label: "Bandhan Business Cycle Fund ", schemeCode: "152878" },
  { value: "mirae-emerging", label: "Mirae Asset Large & Midcap Fund", schemeCode: "118834" },
  { value: "parag-flexi", label: "Parag Parikh Flexi Cap Fund", schemeCode: "122639" },
];

interface MutualFundComboboxProps {
  onFundSelect: (schemeCode: string) => void;
}

export function MutualFundCombobox({ onFundSelect }: MutualFundComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedFund, setSelectedFund] = useState<MutualFundOption | null>(null);

  // Set the first fund as default on component mount
  useEffect(() => {
    if (funds.length > 0 && !selectedFund) {
      setSelectedFund(funds[0]);
      setValue(funds[0].value);
      onFundSelect(funds[0].schemeCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (currentValue: string) => {
    const selected = funds.find((fund) => fund.value === currentValue);
    if (selected) {
      setValue(currentValue);
      setSelectedFund(selected);
      onFundSelect(selected.schemeCode);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedFund ? selectedFund.label : "Select a mutual fund..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search mutual funds..." />
          <CommandList>
            <CommandEmpty>No mutual fund found.</CommandEmpty>
            <CommandGroup>
              {funds.map((fund) => (
                <CommandItem
                  key={fund.value}
                  value={fund.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFund?.value === fund.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {fund.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}