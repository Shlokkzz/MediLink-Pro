import React, { useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import listPlugin from '@fullcalendar/list';
import useAppointments from "../hooks/useAppointments"
import { useState } from "react";


function Calendar() {
 
  const { appointments } = useAppointments();
  const [events,setEvents]=useState([]);

 function addEvents(){
  setEvents(
    appointments.map((meet)=>{
      const newEvent={
        title: meet.name,
        start: new Date(Date.parse(meet.date)),
        description: meet.info
      }
      return newEvent;
    })
  );
 }
  useEffect(()=>{
    addEvents();
  },[appointments]);

  function renderEventContent(eventInfo) {
    return (
      <>{/*Button */}
        <h3>{eventInfo.start}</h3>
        <h4 style={{ marginLeft: "10px", padding: "2px" }}>
          {eventInfo.event.title}
        </h4>
      </>
    );
  }
  return (
    <div>
      <Fullcalendar

        plugins={[listPlugin]}
        initialView={"listDay"}
        views={
          {listDay: { buttonText: 'Day' },
          listWeek: { buttonText: 'Week' },
          listMonth: { buttonText: 'Month' }
        }}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          right: 'listDay,listWeek,listMonth',
        }}
 
        height={"85vh"}
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        // editable={"true"}
        selectable={"true"}
        eventClick={function(info) {
          //show description
             alert(info.event.title +" : "+info.event.extendedProps.description);
          }}
      />
      
    </div>
  );
}
export default Calendar;
