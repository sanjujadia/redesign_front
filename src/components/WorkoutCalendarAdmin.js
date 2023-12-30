import React, { useState } from 'react';
import moment from 'moment';
import './WorkoutCalendar.css'
import { useNavigate } from 'react-router-dom';

function WorkoutCalendar({ callBack, callbackMonth, events }) {
  const [month, setMonth] = useState(moment());
  const [selected, setSelected] = useState(moment().startOf('day'));
  // const [events, setEvents] = useState([
  //   {
  //     date: moment('2023-10-11'), // Example event on the 3rd day of the current month
  //     title: 'Example Event 1',
  //   },
  //   // Add more events as needed
  // ]);

  const previous = () => {
    setMonth(month.clone().subtract(1, 'month'));
    callbackMonth(month.clone().date(1).subtract(1, 'month'))
  };

  const next = () => {
    setMonth(month.clone().add(1, 'month'));
    callbackMonth(month.clone().date(1).add(1, 'month'))
  };

  const select = (day) => {
    setSelected(day.date);
    setMonth(day.date.clone());
  };

  const renderWeeks = () => {
    let weeks = [];
    let done = false;
    let date = month.clone().startOf('month').add('w' - 1).day('Sunday');
    let count = 0;
    let monthIndex = date.month();

    while (!done) {
      weeks.push(
        <Week
          key={date.toString()}
          date={date.clone()}
          month={month}
          select={(day) => select(day)}
          selected={selected}
          events={events}
        />
      );

      date.add(1, 'w');

      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return (
      <div className='abc'>
        <DayNames />
        {weeks}
      </div>
    )
  };

  const renderMonthLabel = () => {
    return <span className="month-label">{month.format('MMMM YYYY')}</span>;
  };

  return (
    <section className="calendar">
      <header className="header">
        <div className="month-display">
          <i className="arrow fa fa-angle-left" onClick={previous} />
          {renderMonthLabel()}
          <i className="arrow fa fa-angle-right" onClick={next} />
        </div>
      </header>
      {renderWeeks()}
    </section>
  );
}

function DayNames() {
  return (
    <div className="day-names">
      <span className="day">Sunday</span>
      <span className="day">Monday</span>
      <span className="day">Tuesday</span>
      <span className="day">Wednesday</span>
      <span className="day">Thursday</span>
      <span className="day">Friday</span>
      <span className="day">Saturday</span>
    </div>
  );
}

function Week({ date, month, select, selected, events }) {
  let days = [];

  for (var i = 0; i < 7; i++) {
    let day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      date: date,
    };
    days.push(
      <Day
        key={date.toString()}
        day={day}
        selected={selected}
        select={select}
        events={events}
      />
    );

    date = date.clone();
    date.add(1, 'day');
  }

  return (

    <div className="week">{days}</div>

  );
}

function Day({ day, select, selected, events }) {
  const navigate = useNavigate()
  const dayEvents = events.filter((event) =>
    moment(event.workout_date).isSame(day.date, 'day')
  );

  console.log('dayEvents', dayEvents)
  const noEvents = Object.keys(dayEvents).length === 0;
  const isClickable = day.isCurrentMonth;

  return (
    <span
      className={
        'day' +
        (day.isToday ? ' today' : '') +
        (day.isCurrentMonth ? '' : ' different-month') +
        (day.date.isSame(selected) ? ' selected' : '')
      }
      onClick={() => isClickable && select(day)}
    >
      <div className='day-number'>
        <p className={`${day.isCurrentMonth ? '' : 'different-month-day'}`}>{day.number}</p>
        {dayEvents.map((status, index) => (
          <div key={index}>
            <span>
              <h5>0/{dayEvents[index].workout_elements.length}</h5>
            </span>
          </div>
        ))}
        {noEvents && (
          <div>
            <span>
              <h5>{day.isCurrentMonth ? '0/0' : ''}</h5>
            </span>
          </div>
        )}

      </div>
      {moment(day.date, 'YYYY-MM-DD').isSameOrAfter(moment(), 'day')
        ?
        <button className="date-button" onClick={() => { navigate(`/add-workout?date=${moment(day.date).format("YYYY-MM-DD")}`) }}>{day.isCurrentMonth ? 'Add/Edit Workout' : ''}</button>
        :
        <></>
      }
      {/* <div>
        <span></span>
      </div> */}
      <div className="event-container">
        {dayEvents.map((event, index) => (
          <div key={index} className="event" onClick={() => navigate(`/workout-view?date=${moment(day.date).format("YYYY-MM-DD")}`)}>
            <div style={{ whiteSpace: 'pre-line' }}>{event.workout_for[0].replace(/,/g, ',\n')}</div>
          </div>
        ))}
      </div>
    </span>
  );
}



// function Day({ day, select, selected, events }) {
//   const dayEvents = events.filter((event) =>
//     event.date.isSame(day.date, 'day')
//   );

//   return (
//     <span
//       className={
//         'day' +
//         (day.isToday ? ' today' : '') +
//         (day.isCurrentMonth ? '' : ' different-month') +
//         (day.date.isSame(selected) ? ' selected' : '')
//       }
//       onClick={() => select(day)}
//     >
//       {day.number}
//       <div className="event-container">
//         {dayEvents.map((event, index) => (
//           <div key={index} className="event">
//             {event.title}
//           </div>
//         ))}
//       </div>
//     </span>
//   );
// }

export default WorkoutCalendar;
