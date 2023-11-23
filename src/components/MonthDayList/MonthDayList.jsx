import {CalendarCell} from "../CalendarCell/CalendarCell.jsx";
import {isDayContainCurrentEvent} from "../helpers/index.js";


export const MonthDayList = ({
                                 startDay,
                                 totalDays,
                                 events,
                                 openFormHendler,
                                 today,
                                 updateEvent,
                                 method
                             }) => {
    const day = startDay.clone().subtract(1, "day");

    const daysArray = [...Array(totalDays)].map(() => day.add(1, "day").clone());
    return daysArray.map((dayItem) => (
        <CalendarCell
            today={today}
            dayItem={dayItem}
            openFormHendler={openFormHendler}
            updateEvent={updateEvent}
            method={method}
            events={events.filter((event) =>
                isDayContainCurrentEvent(event, dayItem),
            )}
        />
    ));
};
