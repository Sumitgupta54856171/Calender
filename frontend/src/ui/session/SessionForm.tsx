import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { useToast, ToastContainer } from "../../components/ui/toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../components/ui/field"
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { useGetSessionsQuery,useCreateSessionMutation } from "../../store/api";
export default function SessionForm(){
  const { toasts, addToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    tutorName: "",
    studentName: "",
    subject: "",
    sessionCost: "",
    recurrencePattern: "",
    date: null as Date | null,
    startTime: "",
    endTime: "",
    bill_status: "",
    originalSessionId: '', // For editing existing
  });
const [createSession,{isLoading,isError,isSuccess}] = useCreateSessionMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isSuccess) {
      addToast("Session created successfully!", "success");
      setFormData({
        tutorName: "",
        studentName: "",
        subject: "",
        sessionCost: "",
        recurrencePattern: "",
        date: null,
        startTime: "",
        endTime: "",
        bill_status: "",
        originalSessionId: "",
      });
    }
    if (isError) {
      addToast("Failed to create session. Please try again.", "error");
    }
  }, [isSuccess, isError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const combineDateTime = (baseDate, timeString) => {
  const [hours, minutes] = timeString.split(':');
  const finalDate = new Date(baseDate);
  finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return finalDate;
};

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required.";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.sessionCost.trim()) {
      newErrors.sessionCost = "Session cost is required.";
    } else {
      const cost = parseFloat(formData.sessionCost);
      if (isNaN(cost) || cost < 0) newErrors.sessionCost = "Session cost must be a positive number.";
    }
    if (!formData.date) newErrors.date = "Session date is required.";
    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";
    if (!formData.bill_status) newErrors.bill_status = "Billing status is required.";

    // Validate times
    if (formData.date && formData.startTime && formData.endTime) {
      const startDateTime = new Date(formData.date);
      const [startH, startM] = formData.startTime.split(':').map(Number);
      startDateTime.setHours(startH, startM);

      const endDateTime = new Date(formData.date);
      const [endH, endM] = formData.endTime.split(':').map(Number);
      endDateTime.setHours(endH, endM);

      if (endDateTime <= startDateTime) {
        newErrors.endTime = "End time must be after start time.";
      }
    }

    // Billing status enum
    if (formData.bill_status && !['billed', 'unbilled'].includes(formData.bill_status)) {
      newErrors.bill_status = "Invalid billing status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const payloadForBackend = {
  // 🔴 IMPORTANT: Multi-tenant app ke liye organization ID zaruri hai
  organization_id: "69fc09d98c998a9f02fce7cd", 
  
  //
  session_id: formData.originalSessionId, 
  recurrence_pattern: formData.recurrencePattern,
  // String to Number conversions
  session_cost: Number(formData.sessionCost),
  subject: formData.subject,
  
  // Nayi Dates aur Times
  session_date: new Date(formData.date),
  start_time: combineDateTime(formData.date, formData.startTime),
  end_time: combineDateTime(formData.date, formData.endTime),

  // Baaki details
  tutor_name: formData.tutorName,
  student_name: formData.studentName,
  billing_status: formData.bill_status
};
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(payloadForBackend);
    if (validateForm()) {
      createSession(payloadForBackend);
    }
  }

    return(<>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
    <div className="max-h-full w-screen justify-center" >
       <form onSubmit={submitHandler}>
        <Card className="m-10">
            <FieldGroup className="p-20">
            <FieldSet>
             <FieldLegend>Core Details</FieldLegend>
             <Field className="flex flex-col gap-4 md:flex-row">
              <span>
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">Tutor Name</FieldLabel>
              <Input type='text' placeholder="Enter tutor name"
              name="tutorName"
              value={formData.tutorName} onChange={handleChange}></Input></span>
              <span className="">
              <FieldLabel className="" htmlFor="checkout-7j9-card-name-43j">Student Name</FieldLabel >
              <Input type='text' id="checkout-7j9-card-name-43j" name="studentName" placeholder="Enter student name" value={formData.studentName} onChange={handleChange}></Input>
              {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
             </span>
             </Field>
             <Field className="">
               <FieldLabel htmlFor="checkout-7j9-card-name-43j">Subject</FieldLabel>
              <Input type='text' id="checkout-7j9-card-name-43j" name="subject" placeholder="Enter subject" className="w-full" value={formData.subject} onChange={handleChange}></Input>
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
              </Field>
              

            </FieldSet>
        </FieldGroup>
        </Card>
        <Card className="m-10">
          <CardHeader>
            <CardTitle>Schedule Session</CardTitle>
            <CardDescription>Set date and time for the session</CardDescription>
          </CardHeader>
          <Field className="mx-auto flex w-full max-w-md flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id="date-picker-simple"
            className="min-w-48 justify-start gap-2 font-normal"
          >
            <CalendarIcon className="size-4 shrink-0 opacity-60" aria-hidden />
            {formData.date ? format(formData.date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.date ?? undefined}
            onSelect={(date) =>
              setFormData((prev) => ({ ...prev, date: date ?? null }))
            }
            defaultMonth={formData.date ?? new Date()}
          />
        </PopoverContent>
      </Popover>
      {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="session-start-time">Start time</FieldLabel>
          <Input
            type="time"
            id="session-start-time"
            step="60"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-36 bg-background"
          />
          {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="session-end-time">End time</FieldLabel>
          <Input
            type="time"
            id="session-end-time"
            step="60"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-36 bg-background"
          />
          {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
        </div>
    </Field>
          <CardContent>
            <Card>
              <Field className="p-10">
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">Session Cost</FieldLabel>
              <Input type='text' id="checkout-7j9-card-name-43j" name="sessionCost" placeholder="Enter session cost" className="w-fit" value={formData.sessionCost} onChange={handleChange}></Input>
              {errors.sessionCost && <p className="text-red-500 text-sm">{errors.sessionCost}</p>}
              </Field>
            </Card>
            <Card>
              <Field className="p-10">
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">Recurrence </FieldLabel>
              <Input type='text' id="checkout-7j9-card-name-43j" name="recurrencePattern" placeholder="Enter recurrence pattern" value={formData.recurrencePattern} onChange={handleChange} className="w-fit"></Input>

              </Field>
              <FieldLabel className="p-2">Bill Status</FieldLabel>
              <Select value={formData.bill_status} onValueChange={(value) => setFormData(prev => ({ ...prev, bill_status: value }))}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select the Bill Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Bill</SelectLabel>
          <SelectItem value="billed">Billed</SelectItem>
          <SelectItem value="unbilled">Unbilled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    {errors.bill_status && <p className="text-red-500 text-sm">{errors.bill_status}</p>}
            </Card>
          </CardContent>
        </Card>
          <Button type="submit">Save Session</Button>
       </form>
    </div>
    </>
    )


}
