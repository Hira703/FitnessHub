import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useMemo, useState, useEffect } from 'react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444'];

const dayIndex = (shortDay) => {
  const daysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return daysMap[shortDay];
};

const TrainerCalendar = ({ availableSlots = [] }) => {
  const [calendarHeight, setCalendarHeight] = useState(650);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) setCalendarHeight(500);
      else if (window.innerWidth < 1024) setCalendarHeight(600);
      else setCalendarHeight(650);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const events = useMemo(() => {
    return availableSlots.flatMap((slot, index) => {
      const durationMatch = slot.slotTime.match(/(\d+)\s*minutes?/i);
      const durationInMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 60;

      return slot.days.map((day) => {
        const today = new Date();
        const targetDayIndex = dayIndex(day);
        const dayDiff = (targetDayIndex - today.getDay() + 7) % 7;

        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + dayDiff);
        slotDate.setHours(9, 0, 0, 0);

        return {
          title: `${slot.slotName}${slot.className ? ` (${slot.className})` : ''}`,
          start: new Date(slotDate),
          end: new Date(slotDate.getTime() + durationInMinutes * 60000),
          slotId: slot._id,
          color: COLORS[index % COLORS.length],
        };
      });
    });
  }, [availableSlots]);

  const handleSelectEvent = (event) => {
    if (window.confirm(`Book slot: ${event.title}?`)) {
      console.log('Booking slot ID:', event.slotId);
    }
  };

  return (
    <div className="px-2 sm:px-6 lg:px-12 max-w-full mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 select-none">
        Trainer Availability Calendar
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 overflow-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: calendarHeight, width: '100%', minWidth: '320px' }}
          onSelectEvent={handleSelectEvent}
          popup
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
              color: '#fff',
              borderRadius: '8px',
              padding: '6px 12px',
              boxShadow: `0 2px 6px ${event.color}88`,
              fontWeight: '600',
              fontSize: '0.9rem',
            },
          })}
          dayPropGetter={() => ({
            style: { outline: 'none' },
          })}
          toolbar
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>
      <style jsx global>{`
        /* Make the calendar width fluid and responsive */
        .rbc-calendar {
          width: 100% !important;
          min-width: 320px;
        }

        /* Hide horizontal scrollbar but keep scroll */
        .rbc-month-view,
        .rbc-time-view {
          overflow-x: auto;
        }

        /* Responsive tweaks for toolbar */
        .rbc-toolbar {
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        /* Adjust event popups on small screens */
        .rbc-overlay {
          max-width: 90vw !important;
          left: 5% !important;
          right: 5% !important;
        }
      `}</style>
    </div>
  );
};

export default TrainerCalendar;
