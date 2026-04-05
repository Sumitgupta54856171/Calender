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
            <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-xl">
                <CardContent className="px-6 py-12 sm:px-8">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        <span className="text-gray-600">Loading data...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (hasError) {
        return (
            <Card className="overflow-hidden rounded-3xl border-red-200 bg-red-50">
                <CardContent className="px-6 py-6 sm:px-8">
                    <div className="flex items-center gap-3 text-red-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="font-medium">Error loading data</span>
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
        <div className="min-h-full bg-white py-10">
            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Billing Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage sessions, invoices, and adjustments</p>

                    {/* Summary Cards */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-gray-200 bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">Total Sessions</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-gray-900">{totalSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-700">Billed</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-green-600">{billedSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">Unbilled</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-yellow-600">{unbilledSessions}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-purple-600">${totalRevenue}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Data Tables */}
                <Card className="overflow-hidden rounded-3xl border-gray-200 bg-white shadow-xl">
                    <CardHeader className="border-b border-gray-200 bg-gray-50 px-6 py-5 sm:px-8">
                        <CardTitle className="text-xl text-gray-900">Data Tables</CardTitle>
                        <CardDescription className="text-gray-600">Switch between different data views</CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-gray-200 bg-white">
                                <TabsTrigger value="sessions" className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 border-b-2 border-transparent data-[state=active]:border-blue-500">
                                    Sessions
                                </TabsTrigger>
                                <TabsTrigger value="invoices" className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 border-b-2 border-transparent data-[state=active]:border-blue-500">
                                    Invoices
                                </TabsTrigger>
                                <TabsTrigger value="adjustments" className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 border-b-2 border-transparent data-[state=active]:border-blue-500">
                                    Adjustments
                                </TabsTrigger>
                            </TabsList>

                            {/* Sessions Tab */}
                            <TabsContent value="sessions" className="p-6 sm:p-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">All Sessions</h3>
                                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-200 hover:bg-gray-50 bg-gray-50">
                                                    <TableHead className="text-gray-700 font-semibold">Student</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Tutor</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Subject</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Time</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Cost</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sessions.map((session: Session) => (
                                                    <TableRow key={session._id} className="border-gray-200 hover:bg-gray-50">
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-blue-500" />
                                                                {session.student_name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">{session.tutor_name || 'N/A'}</TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="h-4 w-4 text-purple-500" />
                                                                {session.subject}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-green-500" />
                                                                {format(new Date(session.session_date), 'MMM dd, yyyy')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                                {format(new Date(session.start_time), 'HH:mm')} - {format(new Date(session.end_time), 'HH:mm')}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-500" />
                                                                ${session.session_cost}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={session.billing_status === 'billed' ? 'default' : 'secondary'}
                                                                className={
                                                                    session.billing_status === 'billed'
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
                                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200'
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
                                    <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
                                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-200 hover:bg-gray-50 bg-gray-50">
                                                    <TableHead className="text-gray-700 font-semibold">Invoice ID</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Period Start</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Period End</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Total Amount</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Created</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {bills.map((invoice: any) => (
                                                    <TableRow key={invoice._id} className="border-gray-200 hover:bg-gray-50">
                                                        <TableCell className="text-gray-900 font-mono text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-blue-500" />
                                                                {invoice._id.slice(-8)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {format(new Date(invoice.billingPeriod_start), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {format(new Date(invoice.billingPeriod_end), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-500" />
                                                                ${invoice.total_amount}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                                                className={
                                                                    invoice.status === 'paid'
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
                                                                        : invoice.status === 'issued'
                                                                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'
                                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200'
                                                                }
                                                            >
                                                                {invoice.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
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
                                    <h3 className="text-lg font-semibold text-gray-900">Adjustments</h3>
                                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-gray-200 hover:bg-gray-50 bg-gray-50">
                                                    <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Amount</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Description</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Session</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Invoice</TableHead>
                                                    <TableHead className="text-gray-700 font-semibold">Created</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {adjustments.map((adjustment: any) => (
                                                    <TableRow key={adjustment._id} className="border-gray-200 hover:bg-gray-50">
                                                        <TableCell>
                                                            <Badge
                                                                variant={adjustment.type === 'credit' ? 'default' : 'destructive'}
                                                                className={
                                                                    adjustment.type === 'credit'
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
                                                                        : 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200'
                                                                }
                                                            >
                                                                {adjustment.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-green-500" />
                                                                ${adjustment.credit_amount}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900 max-w-xs truncate">
                                                            {adjustment.description}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {adjustment.session_id ? (
                                                                <div className="text-sm">
                                                                    <div>{adjustment.session_id.student_name}</div>
                                                                    <div className="text-gray-500">
                                                                        {format(new Date(adjustment.session_id.session_date), 'MMM dd')}
                                                                    </div>
                                                                </div>
                                                            ) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {adjustment.invoic_id ? (
                                                                <div className="text-sm">
                                                                    <div>${adjustment.invoic_id.total_amount}</div>
                                                                    <div className="text-gray-500">{adjustment.invoic_id.status}</div>
                                                                </div>
                                                            ) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
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