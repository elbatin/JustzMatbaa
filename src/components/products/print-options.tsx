'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguageStore } from '@/stores/language-store'
import type { PrintOptions, SelectedPrintOptions } from '@/types'

interface PrintOptionsProps {
  options: PrintOptions
  selected: SelectedPrintOptions
  onChange: (options: SelectedPrintOptions) => void
}

export function PrintOptionsSelector({ options, selected, onChange }: PrintOptionsProps) {
  const { t } = useLanguageStore()
  
  const handleSizeChange = (sizeId: string) => {
    onChange({ ...selected, sizeId })
  }

  const handlePaperTypeChange = (paperTypeId: string) => {
    onChange({ ...selected, paperTypeId })
  }

  const handlePrintSideChange = (printSideId: string) => {
    onChange({ ...selected, printSideId })
  }

  const handleQuantityChange = (quantity: string) => {
    onChange({ ...selected, quantity: parseInt(quantity) })
  }

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.productDetail.size}</Label>
        <RadioGroup
          value={selected.sizeId}
          onValueChange={handleSizeChange}
          className="grid grid-cols-2 gap-2"
        >
          {options.sizes.map((size) => (
            <div key={size.id}>
              <RadioGroupItem
                value={size.id}
                id={`size-${size.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`size-${size.id}`}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
              >
                <span className="font-medium">{size.name}</span>
                <span className="text-xs text-muted-foreground">{size.dimensions}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Paper Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.productDetail.paperType}</Label>
        <Select value={selected.paperTypeId} onValueChange={handlePaperTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t.productDetail.paperType} />
          </SelectTrigger>
          <SelectContent>
            {options.paperTypes.map((paper) => (
              <SelectItem key={paper.id} value={paper.id}>
                <div className="flex flex-col">
                  <span>{paper.name}</span>
                  <span className="text-xs text-muted-foreground">{paper.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Print Side Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.productDetail.printSide}</Label>
        <RadioGroup
          value={selected.printSideId}
          onValueChange={handlePrintSideChange}
          className="flex gap-4"
        >
          {options.printSides.map((side) => (
            <div key={side.id} className="flex items-center space-x-2">
              <RadioGroupItem value={side.id} id={`side-${side.id}`} />
              <Label htmlFor={`side-${side.id}`} className="cursor-pointer">
                {side.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t.productDetail.quantity}</Label>
        <Select 
          value={selected.quantity.toString()} 
          onValueChange={handleQuantityChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.productDetail.quantity} />
          </SelectTrigger>
          <SelectContent>
            {options.quantities.map((qty) => (
              <SelectItem key={qty} value={qty.toString()}>
                {qty} {t.common.pieces}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
