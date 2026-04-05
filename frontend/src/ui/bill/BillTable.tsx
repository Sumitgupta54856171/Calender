import { useState } from "react";
import { useGetSessionsQuery, useBillQuery, useAdjustmentsQuery } from "../../store/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { format } from "date-fns";
import { Calendar, DollarSign, User, BookOpen, Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface Session {
    _id: string;
    student_name: string;
    tutor_name?: string;
    subject?: string;
    session_date: string;
    start_time: string;
    end_time: string;
    session_cost: number;
    billing_status: 'billed' | 'unbilled';
}

export default function BillTable() {
    const [activeTab, setActiveTab] = useState("sessions");

    const { data: sessionsData, error: sessionsError, isLoading: sessionsLoading } = useGetSessionsQuery('69d238682c6bf21474605183');
    const { data: billData, error: billError, isLoading: billLoading } = useBillQuery('69d238682c6bf21474605183');
    const { data: adjustmentsData, error: adjustmentsError, isLoading: adjustmentsLoading } = useAdjustmentsQuery('69d238682c6bf21474605183');

    const sessions = (sessionsData?.data || []) as Session[];
    const bills = billData?.data || [];
    const adjustments = adjustmentsData?.data || [];

    const isLoading = sessionsLoading || billLoading || adjustmentsLoading;
    const hasError = sessionsError || billError || adjustmentsError;

    if (isLoading) {
        return (
            <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80 shadow-xl">
                <CardContent className="px-6 py-12 sm:px-8">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                        <span className="text-slate-400">Loading data...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (hasError) {
        return (
            <Card className="overflow-hidden rounded-3xl border-red-900/50 bg-red-950/30">
                <CardContent className="px-6 py-6 sm:px-8">
                    <div className="flex items-center gap-3 text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>Error loading data</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate totals
    const totalSessions = sessions.length;
    const billedSessions = sessions.filter((s: Session) => s.billing_status === 'billed').length;
    const unbilledSessions = sessions.filter((s: Session) => s.billing_status === 'unbilled').length;
    const totalRevenue = sessions.reduce((sum: number, s: Session) => sum + (s.session_cost || 0), 0);

    return (
        <div className="min-h-full bg-slate-950/50 py-10">
            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <section className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">Billing Dashboard</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage sessions, invoices, and adjustments</p>

                    {/* Summary Cards */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-slate-800/50 bg-slate-800/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm font-medium text-slate-300">Total Sessions</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-slate-100">{totalSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800/50 bg-slate-800/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span className="text-sm font-medium text-slate-300">Billed</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-green-400">{billedSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800/50 bg-slate-800/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm font-medium text-slate-300">Unbilled</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-yellow-400">{unbilledSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800/50 bg-slate-800/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-purple-400" />
                                    <span className="text-sm font-medium text-slate-300">Total Revenue</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-purple-400">${totalRevenue}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Data Tables */}
                <Card className="overflow-hidden rounded-3xl border-slate-800/80 bg-slate-900/80 shadow-xl">
                    <CardHeader className="border-b border-slate-800/80 bg-slate-950/50 px-6 py-5 sm:px-8">
                        <CardTitle className="text-xl text-slate-50">Data Tables</CardTitle>
                        <CardDescription className="text-slate-400">Switch between different data views</CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-slate-800/50 bg-slate-950/50">
                                <TabsTrigger value="sessions" className="rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                                    Sessions
                                </TabsTrigger>
                                <TabsTrigger value="invoices" className="rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                                    Invoices
                                </TabsTrigger>
                                <TabsTrigger value="adjustments" className="rounded-none data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                                    Adjustments
                                </TabsTrigger>
                            </TabsList>

                            {/* Sessions Tab */}
                            <TabsContent value="sessions" className="p-6 sm:p-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-100">All Sessions</h3>
                                    <div className="rounded-xl border border-slate-800/50 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-slate-800/50 hover:bg-slate-800/30">
                                                    <TableHead className="text-slate-300">Student</TableHead>
                                                    <TableHead className="text-slate-300">Tutor</TableHead>
                                                    <TableHead className="text-slate-300">Subject</TableHead>
                                                    <TableHead className="text-slate-300">Date</TableHead>
                                                    <TableHead className="text-slate-300">Time</TableHead>
                                                    <TableHead className="text-slate-300">Cost</TableHead>
                                                    <TableHead className="text-slate-300">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sessions.map((session: Session) => (
                                                    <TableRow key={session._id} className="border-slate-800/50 hover:bg-slate-800/20">
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-blue-400" />
                                                                {session.student_name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">{session.tutor_name || 'N/A'}</TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="h-4 w-4 text-purple-400" />
                                                                {session.subject}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-green-400" />
                                                                {format(new Date(session.session_date), 'MMM dd, yyyy')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-yellow-400" />
                                                                {format(new Date(session.start_time), 'HH:mm')} - {format(new Date(session.end_time), 'HH:mm')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                                ${session.session_cost}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={session.billing_status === 'billed' ? 'default' : 'secondary'}
                                                                className={
                                                                    session.billing_status === 'billed'
                                                                        ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70'
                                                                        : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900/70'
                                                                }
                                                            >
                                                                {session.billing_status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Invoices Tab */}
                            <TabsContent value="invoices" className="p-6 sm:p-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-100">Invoices</h3>
                                    <div className="rounded-xl border border-slate-800/50 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-slate-800/50 hover:bg-slate-800/30">
                                                    <TableHead className="text-slate-300">Invoice ID</TableHead>
                                                    <TableHead className="text-slate-300">Period Start</TableHead>
                                                    <TableHead className="text-slate-300">Period End</TableHead>
                                                    <TableHead className="text-slate-300">Total Amount</TableHead>
                                                    <TableHead className="text-slate-300">Status</TableHead>
                                                    <TableHead className="text-slate-300">Created</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {bills.map((invoice: any) => (
                                                    <TableRow key={invoice._id} className="border-slate-800/50 hover:bg-slate-800/20">
                                                        <TableCell className="text-slate-100 font-mono text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-blue-400" />
                                                                {invoice._id.slice(-8)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {format(new Date(invoice.billingPeriod_start), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {format(new Date(invoice.billingPeriod_end), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                                ${invoice.total_amount}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                                                className={
                                                                    invoice.status === 'paid'
                                                                        ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70'
                                                                        : invoice.status === 'issued'
                                                                        ? 'bg-blue-900/50 text-blue-400 hover:bg-blue-900/70'
                                                                        : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900/70'
                                                                }
                                                            >
                                                                {invoice.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Adjustments Tab */}
                            <TabsContent value="adjustments" className="p-6 sm:p-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-100">Adjustments</h3>
                                    <div className="rounded-xl border border-slate-800/50 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-slate-800/50 hover:bg-slate-800/30">
                                                    <TableHead className="text-slate-300">Type</TableHead>
                                                    <TableHead className="text-slate-300">Amount</TableHead>
                                                    <TableHead className="text-slate-300">Description</TableHead>
                                                    <TableHead className="text-slate-300">Session</TableHead>
                                                    <TableHead className="text-slate-300">Invoice</TableHead>
                                                    <TableHead className="text-slate-300">Created</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {adjustments.map((adjustment: any) => (
                                                    <TableRow key={adjustment._id} className="border-slate-800/50 hover:bg-slate-800/20">
                                                        <TableCell>
                                                            <Badge
                                                                variant={adjustment.type === 'credit' ? 'default' : 'destructive'}
                                                                className={
                                                                    adjustment.type === 'credit'
                                                                        ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70'
                                                                        : 'bg-red-900/50 text-red-400 hover:bg-red-900/70'
                                                                }
                                                            >
                                                                {adjustment.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                                ${adjustment.credit_amount}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-100 max-w-xs truncate">
                                                            {adjustment.description}
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {adjustment.session_id ? (
                                                                <div className="text-sm">
                                                                    <div>{adjustment.session_id.student_name}</div>
                                                                    <div className="text-slate-400">
                                                                        {format(new Date(adjustment.session_id.session_date), 'MMM dd')}
                                                                    </div>
                                                                </div>
                                                            ) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {adjustment.invoic_id ? (
                                                                <div className="text-sm">
                                                                    <div>${adjustment.invoic_id.total_amount}</div>
                                                                    <div className="text-slate-400">{adjustment.invoic_id.status}</div>
                                                                </div>
                                                            ) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-slate-100">
                                                            {format(new Date(adjustment.createdAt), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}