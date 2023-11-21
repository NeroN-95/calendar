import styled from "styled-components";
import {CalendarGridHeader} from "../CalendarGridHeader/CalendarGridHeader.jsx";
import {MonthDayList} from "../MonthDayList/MonthDayList.jsx";



const CalendarGrid = ({startDay, today, totalDays, events, openFormHendler}) => {


    const GridWrapper = styled.div`
      display: grid;
      grid-template-columns: repeat(7, 2fr);
      //grid-template-rows: repeat(6, 2fr);
      grid-gap: 1px;
      ${props => props.isHeader && "border-bottom: 1px solid black"}
    `;

    // console.log('isCurrentDay',isCurrentDay)
    return (

        <>
            <GridWrapper isHeader>
                <CalendarGridHeader/>

            </GridWrapper>
            <GridWrapper>
                <MonthDayList
                    startDay={startDay}
                    totalDays={totalDays}
                    events={events}
                    openFormHendler={openFormHendler}
                    today={today}
                />
            </GridWrapper>

        </>
    )
        ;
}

export default CalendarGrid;