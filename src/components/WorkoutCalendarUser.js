import React, { useState } from 'react';
import moment from 'moment';
import './WorkoutCalendar.css'
import { useNavigate } from 'react-router-dom';

function WorkoutCalendar({ callBack, callbackMonth, events }) {
  const [month, setMonth] = useState(moment());
  const [selected, setSelected] = useState(moment().startOf('day'));
  console.log(events, 'hhhhhhh')
  // const [events, setEvents] = useState([
  //   {
  //     date: moment().startOf('day').add(2, 'days'), // Example event on the 3rd day of the current month
  //     title: 'Example Event 1',
  //   },
  //   // Add more events as needed
  // ]);

  const previous = () => {
    setMonth(month.clone().subtract(1, 'month'));
    console.log(month.clone().date(1).subtract(1, 'month'))
    callbackMonth(month.clone().date(1).subtract(1, 'month'))
  };

  const next = () => {
    setMonth(month.clone().add(1, 'month'));
    console.log(month.clone().date(1).add(1, 'month'))
    callbackMonth(month.clone().date(1).add(1, 'month'))
  };

  const select = (day) => {
    setSelected(day.date);
    setMonth(day.date.clone());
    // callbackMonth(month.clone().add(1, 'month'))
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
          callBack={callBack}
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
    <div>
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

    </div>
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

function Week({ date, month, select, selected, events, callBack }) {
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
        month={month}
        callBack={callBack}
      />
    );

    date = date.clone();
    date.add(1, 'day');
  }

  return (

    <div className="week">{days}</div>

  );
}

// function Day({ day, select, selected, callBack, events }) {
//   const navigate = useNavigate()
//   const dayEvents = events.filter((event) =>
//     moment(event.workout_date).isSame(day.date, 'day')
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
//       <div className='day-number'>
//         <p className={`${day.isCurrentMonth ? '' : 'different-month-day'}`}>{day.number}</p>
//         <span className={`${day.isCurrentMonth ? '' : 'different-month-day'}`}><h5>0/37</h5></span>
//       </div>

//       <span style={{background:'#ff964a', color:'#fff',width:'120px', textAlign:'center', padding:'5px'}} onClick={() => callBack(true)}>Workout</span>
//       <button className="date-button">{day.isCurrentMonth ? 'Add/Edit Workout' : ''}</button>
//       <div>
//         <span></span>
//       </div>
//       <div className="event-container">
//         {dayEvents.map((event, index) => (
//           <div key={index} className="event">
//             {event.workout_for}
//           </div>
//         ))}
//       </div>
//     </span>
//   );
// }

function Day({ day, select, selected, callBack, events }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  // Filter events for the current day and group them by status
  const dayEvents = events
    .filter((event) => moment(event.workout_date).isSame(day.date, 'day'))
    .reduce((acc, event) => {
      if (!acc[event.status]) {
        acc[event.status] = [];
      }
      acc[event.status].push(event);
      return acc;
    }, {});

  console.log('day events', dayEvents)

  // Check if there are no events for the day
  const noEvents = Object.keys(dayEvents).length === 0;
  const isClickable = day.isCurrentMonth;
  const shouldShowEvents = Object.keys(dayEvents).includes(day.date.format('YYYY-MM-DD'))
  const isButtonClickable = !noEvents && day.isCurrentMonth
  const isPastDay = moment(day.date).isBefore(moment(), 'day');
  const statusColors = {
    Workout: '#FF964A', // Example color for 'workout' status
    Completed: '#85C52E', // Example color for another status
    Missed: '#F55656', // Example color for yet another status
  };

  return (
    <span
      className={
        'day' +
        (day.isToday ? ' today' : '') +
        (day.isCurrentMonth ? '' : ' different-month') +
        (day.date.isSame(selected) ? ' selected' : '')
      }
      onClick={() => isClickable && select(day)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='day-number'>
        <p className={`${day.isCurrentMonth ? '' : 'different-month-day'}`}>{day.number}</p>
        {Object.keys(dayEvents).map((status, index) => (
          <div key={index}>
            <span>
              <h5>0/{dayEvents[status][0].workout_elements.length}</h5>
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
      
      {Object.keys(dayEvents).map((status, index) => (
        <>
          <div key={index} className="event-container">
            <div className='workout_status'>
              <span className='workout' style={{ background: statusColors[status] || '#000' }} onClick={() => status === 'Workout' && callBack(true, day.date)}>
                {status}
              </span>
              <button className="date-button" >{day.isCurrentMonth ? 'Add/Edit Workout' : ''}</button>
            </div>
            <div>
              {isHovered ? ( // Show all elements when hovered
                <div className="event">
                  <span>
                    {Array.isArray(dayEvents[status][0].workout_for)
                      ? dayEvents[status][0].workout_for.map((item, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <br />}
                          {item}
                        </React.Fragment>
                      ))
                      : dayEvents[status][0].workout_for}
                  </span>
                </div>
              ) : (
                // Show only the first element by default
                <div className="event">
                  {dayEvents[status][0].workout_for[0]}
                </div>
              )}
              {/* {dayEvents[status].map((event, index) => (
              <div key={index} className="event">
                {event.workout_for}
              </div>
            ))} */}
            </div>
          </div>
        </>
      ))}

    </span>
  );
}

export default WorkoutCalendar;

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

// export default WorkoutCalendar;
