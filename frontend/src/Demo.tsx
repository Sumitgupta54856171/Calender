import { Calendar,momentLocalizer } from 'react-big-calendar';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetSessionsQuery } from './store/api';

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

const eventStyleGetter = (event:any) => {
  const backgroundColor = event.billing_status === 'billed' ? '#4caf50' : '#f44336';
  return { style: { backgroundColor } };
};

function RescheduleEvent({ event, title }: any) {
  const handleReschedule = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    window.alert(`Reschedule event: ${title}`);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-1 text-xs">
      <div>
        <strong>{title}</strong>
        <div className="text-[10px] text-slate-600">{event.tutor_name}</div>
      </div>
      <button
        type="button"
        onClick={handleReschedule}
        className="rounded bg-blue-600 px-2 py-1 text-[10px] text-white hover:bg-blue-700"
      >
        Reschedule
      </button>
    </div>
  )
}

export default function Demo(){
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const { data, error, isLoading } = useGetSessionsQuery('69fc09d98c998a9f02fce7cd');
  console.log("Fetched sessions:", data, "Error:", error, "Loading:", isLoading);

  const events = data?.data?.map((session:any) => ({
    title: `${session.student_name} - ${session.tutor_name}`,
    start: new Date(session.start_time),
    end: new Date(session.end_time),
    billing_status: session.billing_status,
    tutor_name: session.tutor_name,
    student_name: session.student_name,
    session_cost: session.session_cost,
    invoice_id: session.invoice_id
  })) || [];

  if (isLoading) return <div className="p-4">Loading sessions...</div>
  if (error) return <div className="p-4 text-red-500">Error loading sessions</div>

  return <>
    <div className="max-h-full w-screen">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height:600}}
        view={view}
        date={date}
        onView={(newView:any) => setView(newView)}
        onNavigate={(newDate:any) => setDate(newDate)}
        views={['month','week','day']}
        toolbar={true}
        eventPropGetter={eventStyleGetter}
        selectable
        components={{ event: RescheduleEvent }}
        onSelectEvent={(event)=>window.alert(`Event: ${event.title}`)}
        onSelectSlot={(slotinfo)=>{console.log("this is a slot", slotinfo)}}
      />
    </div>
  </>
}
