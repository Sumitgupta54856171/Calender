import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useState } from "react";
import { useGetSessionbyDateQuery } from "../../store/api";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, User, BookOpen, DollarSign, AlertCircle } from "lucide-react";
import Reschedule from "./Resheduled";

export default function Adjustment(){
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedSessionForReschedule, setSelectedSessionForReschedule] = useState<any>(null);
    
    const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const {data, isLoading, error} = useGetSessionbyDateQuery({
        organizationId: '69d238682c6bf21474605183',
        date: dateString
    }, { skip: !dateString });

    const sessions = data?.data || [];

    return (
        <div className="min-h-full bg-slate-950/50 py-10">
            <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <section className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">Session Adjustments</h1>
                    <p className="mt-2 text-sm text-slate-400">View and reschedule sessions for a specific day</p>
                </section>

                {/* Date Picker Card */}
                <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80 shadow-xl">
                    <CardHeader className="border-b border-slate-800/80 bg-slate-950/50 px-6 py-5 sm:px-8">
                        <CardTitle className="flex items-center gap-2 text-xl text-slate-50">
                            <CalendarIcon className="h-5 w-5 text-blue-400" />
                            Select Date
                        </CardTitle>
                        <CardDescription className="text-slate-400">Choose a date to view scheduled sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 py-6 sm:px-8">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-slate-700 bg-slate-800 text-left text-slate-100 hover:bg-slate-700 sm:w-auto"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto border-slate-700 bg-slate-900 p-0 text-slate-100" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate || undefined}
                                    onSelect={(date) => {
                                        setSelectedDate(date || null);
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-md border-slate-700 bg-slate-900 p-3"
                                />
                            </PopoverContent>
                        </Popover>
                    </CardContent>
                </Card>

                {/* Sessions List */}
                <div>
                    {isLoading && (
                        <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80">
                            <CardContent className="px-6 py-8 sm:px-8">
                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                                    Loading sessions...
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Card className="overflow-hidden rounded-3xl border-red-900/50 bg-red-950/30">
                            <CardContent className="px-6 py-6 sm:px-8">
                                <div className="flex items-center gap-3 text-red-400">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <span>Error loading sessions</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!isLoading && sessions.length === 0 && (
                        <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80">
                            <CardContent className="px-6 py-12 sm:px-8">
                                <div className="text-center">
                                    <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                                    <p className="text-slate-400">No sessions scheduled for {selectedDate ? format(selectedDate, 'PPP') : 'this date'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!isLoading && sessions.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-100">
                                Sessions for {selectedDate ? format(selectedDate, 'PPPP') : 'selected date'}
                            </h2>
                            {sessions.map((session: any) => (
                                <Card
                                    key={session._id}
                                    className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80 transition-all hover:border-slate-700/80 hover:bg-slate-900/95"
                                >
                                    <CardContent className="px-6 py-6 sm:px-8">
                                        {/* Session Info Grid */}
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {/* Student Info */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student</p>
                                                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-100">
                                                    <User className="h-4 w-4 text-blue-400" />
                                                    {session.student_name}
                                                </p>
                                            </div>

                                            {/* Tutor Info */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tutor</p>
                                                <p className="mt-2 text-lg font-semibold text-slate-100">{session.tutor_name || 'N/A'}</p>
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</p>
                                                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-100">
                                                    <BookOpen className="h-4 w-4 text-purple-400" />
                                                    {session.subject}
                                                </p>
                                            </div>

                                            {/* Time Slot */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Time Slot</p>
                                                <p className="mt-2 flex items-center gap-2 text-base font-semibold text-green-400">
                                                    <Clock className="h-4 w-4" />
                                                    {session.start_time} - {session.end_time}
                                                </p>
                                            </div>

                                            {/* Cost */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cost</p>
                                                <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-yellow-400">
                                                    <DollarSign className="h-4 w-4" />
                                                    {session.session_cost}
                                                </p>
                                            </div>

                                            {/* Billing Status */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Billing Status</p>
                                                <div className="mt-2">
                                                    <span
                                                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                            session.billing_status === 'billed'
                                                                ? 'bg-green-900/50 text-green-400'
                                                                : 'bg-red-900/50 text-red-400'
                                                        }`}
                                                    >
                                                        {session.billing_status || 'unbilled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reschedule Button */}
                                        <div className="mt-6 border-t border-slate-800/50 pt-6">
                                            <Button
                                                onClick={() => setSelectedSessionForReschedule(session)}
                                                className="w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 sm:w-auto"
                                            >
                                                Reschedule Session
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reschedule Modal */}
                {selectedSessionForReschedule && (
                    <Reschedule
                        session={selectedSessionForReschedule}
                        onClose={() => setSelectedSessionForReschedule(null)}
                        onSuccess={() => {
                            setSelectedSessionForReschedule(null);
                            // Refresh the data
                        }}
                    />
                )}
            </div>
        </div>
    );
}