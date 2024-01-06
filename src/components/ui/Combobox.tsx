"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxPropsArrayValue {
    value: string,
    label: string,
}

interface ComboboxProps {
    arrayValues:   ComboboxPropsArrayValue[],
    selectedValue: string,
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>
}

const Combobox: React.FC<ComboboxProps> = ({ arrayValues, selectedValue, setSelectedValue }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[100%] justify-between"
                >
                    {selectedValue
                        ? arrayValues?.find((arrayValue) => arrayValue.value === selectedValue)?.label
                        : "Seleccione..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[100%] p-0">
                <Command>
                    <CommandInput placeholder="Buscar..." className="h-9" />
                    <CommandEmpty>No encontrado</CommandEmpty>
                    <CommandGroup className="overflow-y-scroll max-h-80">
                        {arrayValues?.map((arrayValue) => (
                            <CommandItem
                                key={arrayValue?.value}
                                value={arrayValue?.value}
                                onSelect={(currentValue) => {
                                    setSelectedValue(currentValue === selectedValue ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                {arrayValue?.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedValue === arrayValue?.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default Combobox;
