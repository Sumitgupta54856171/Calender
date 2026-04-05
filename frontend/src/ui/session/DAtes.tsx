"use client"

import * as React from "react"
import { format } from "date-fns"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Field, FieldLabel } from "../../components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"

export function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>()
  const [startTime, setStartTime] = React.useState<Date>()
  const [endTime, setEndTime] = React.useState<Date>()

  return (
   <>
   </>
  )
}
