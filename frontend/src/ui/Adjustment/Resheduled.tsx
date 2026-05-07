

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useRescheduleSessionMutation } from "../../store/api";
import { useToast, ToastContainer } from "../../components/ui/toast";

interface RescheduleProps {
  session: {
    _id: string;
    student_name: string;
    tutor_name: string;
    subject: string;
    session_date: string;
    start_time: string;
    end_time: string;
    session_cost: number;
    billing_status: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function Reschedule({ session, onClose, onSuccess }: RescheduleProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [rescheduleSession, { isLoading }] = useRescheduleSessionMutation();

  // Parse original times
  const originalDate = new Date(session.session_date);
  const originalStartTime = new Date(session.start_time);
  const originalEndTime = new Date(session.end_time);

  // Calculate credit
  const calculateCredit = () => {
    if (!newStartTime || !newEndTime) return 0;
    
    // Get hours from time strings (format: HH:MM)
    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return (hours + minutes / 60);
    };

    const originalStartHours = parseTime(format(originalStartTime, "HH:mm"));
    const originalEndHours = parseTime(format(originalEndTime, "HH:mm"));
    const newStartHours = parseTime(newStartTime);
    const newEndHours = parseTime(newEndTime);

    const originalDuration = originalEndHours - originalStartHours;
    const newDuration = newEndHours - newStartHours;
    const durationDifference = originalDuration - newDuration;

    // Credit is proportional to the difference in duration
    const credit = Math.max(0, (durationDifference / originalDuration) * session.session_cost);
    return parseFloat(credit.toFixed(2));
  };

  const credit = calculateCredit();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newDate) {
      newErrors.newDate = "Please select a new date";
    }
    if (!newStartTime) {
      newErrors.newStartTime = "Please select a start time";
    }
    if (!newEndTime) {
      newErrors.newEndTime = "Please select an end time";
    }
    if (newStartTime && newEndTime && newStartTime >= newEndTime) {
      newErrors.newEndTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReschedule = async () => {
    if (!validateForm()) return;

    try {
      // Combine date and time into full datetime strings
      const dateString = format(newDate || new Date(), 'yyyy-MM-dd');
      const newStartDateTime = `${dateString}T${newStartTime}:00`;
      const newEndDateTime = `${dateString}T${newEndTime}:00`;

      const rescheduleData = {
        organization_id: "69fc09d98c998a9f02fce7cd",
        session_id: session._id,
        tutor_name: session.tutor_name,
        new_session_date: dateString,
        new_start_time: newStartDateTime,
        new_end_time: newEndDateTime,
        credit: session.session_cost// Final cost after applying credit
      };

      await rescheduleSession(rescheduleData).unwrap();
      addToast("Session rescheduled successfully!", "success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Reschedule failed:", error);
      addToast("Failed to reschedule session. Please try again.", "error");
      setErrors({ submit: "Failed to reschedule session" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Card className="w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-gray-200 bg-white shadow-2xl">
        
        {/* Original Session Info */}
        <CardHeader className="border-b border-gray-200 bg-gray-50 px-6 py-5 sm:px-8">
          <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
            <Zap className="h-5 w-5 text-blue-500" />
            Reschedule Session
          </CardTitle>
          <CardDescription className="text-gray-600">Update the session date and time</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-6 py-6 sm:px-8">
          
          {/* Original Session Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">Original Session Details</h3>
            <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Student</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{session.student_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Tutor</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{session.tutor_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Subject</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{session.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Date</p>
                <p className="mt-2 flex items-center gap-2 text-base font-semibold text-blue-600">
                  <CalendarIcon className="h-4 w-4" />
                  {format(originalDate, "PPP")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Time Slot</p>
                <p className="mt-2 flex items-center gap-2 text-base font-semibold text-green-600">
                  <Clock className="h-4 w-4" />
                  {format(originalStartTime, "HH:mm")} - {format(originalEndTime, "HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Cost</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-purple-600">
                  <DollarSign className="h-4 w-4" />
                  {session.session_cost}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* New Session Details Form */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">New Session Details</h3>

            {/* New Date Picker */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Select New Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 bg-white text-left text-gray-900 hover:bg-gray-50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDate ? format(newDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-gray-200 bg-white p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newDate || undefined}
                    onSelect={(date) => {
                      setNewDate(date || null);
                      setErrors({ ...errors, newDate: "" });
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border-gray-200 bg-white p-3"
                  />
                </PopoverContent>
              </Popover>
              {errors.newDate && <p className="mt-1 text-sm text-red-600">{errors.newDate}</p>}
            </div>

            {/* New Time Slot */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Start Time *</label>
                <Input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => {
                    setNewStartTime(e.target.value);
                    setErrors({ ...errors, newStartTime: "" });
                  }}
                  className="border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                />
                {errors.newStartTime && <p className="mt-1 text-sm text-red-600">{errors.newStartTime}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">End Time *</label>
                <Input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => {
                    setNewEndTime(e.target.value);
                    setErrors({ ...errors, newEndTime: "" });
                  }}
                  className="border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                />
                {errors.newEndTime && <p className="mt-1 text-sm text-red-600">{errors.newEndTime}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Credit Information */}
          <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-900">Session Cost</p>
                <p className="mt-2 text-2xl font-bold text-blue-600">${session.session_cost}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-900">Credit Amount</p>
                <p className="mt-2 text-2xl font-bold text-green-600">${session.session_cost}</p>
              </div>
            </div>
            
            {/* Credit Message */}
            <div className="mt-3 space-y-2">
              {credit > 0 ? (
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>A credit of <span className="font-bold">${credit}</span> will be applied to your account based on the shorter session duration.</span>
                </p>
              ) : (
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>No credit adjustment for this reschedule.</span>
                </p>
              )}
              <p className="text-xs text-gray-500">
                Credit is calculated based on the difference between original and new session duration.
              </p>
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={isLoading}
              className="rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? "Rescheduling..." : "Reschedule"}    
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
