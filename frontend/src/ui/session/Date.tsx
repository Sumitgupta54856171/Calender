"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <>
    <Card className="m-10">
    <Popover  >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <div className="w-auto flex flex-row justify-center">
      <PopoverContent className="w-auto p-0 gap-4 m-4" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
      <Input type="time" id="tiime-picker-optional" step="1" defaultValue="10:30:00"           className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-50 m-4"></Input>
      <Input type="time" id="tiime-picker-optional" step="1" defaultValue="10:30:00"           className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-50 m-4"></Input>
    </div>
    </Popover>
    </Card>
    </>
  )
}
