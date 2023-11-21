import styled from "styled-components";
import {CellWrapper, RowCell} from "../containers/index.js";
import {isCurrentDay, isSelectedMon} from "../helpers/index.js";

const DayWrapper = styled.div`
  display: flex;
  height: 33px;
  width: 33px;
  align-items: center;
  justify-content: center;
  margin: 2px;
  cursor: pointer;
`;
const CurrentDay = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ef0a0a;
`;
const ShowDayWrapper = styled("div")`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;
const EventListWrapper = styled("ul")`
  margin: 0;
  padding: 0;
  list-style: none;
`;
const EventItemWrapper = styled("button")`
  position: relative;
  flex-grow: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 114px;
  border: unset;
  cursor: pointer;
  margin: 0;
  padding: 0;
  text-align: left;
`;
const EventListItemWrapper = styled("li")`
  padding-left: 2px;
  padding-right: 2px;
  padding-bottom: 2px;
  display: flex;
`;
export const CalendarCell = ({ dayItem, today, openFormHendler, events }) => {
    return (
        <>
            <CellWrapper
                key={dayItem.unix()}
                isWeekend={dayItem.day() === 6 || dayItem.day() === 0}
                isSelectedMon={isSelectedMon(dayItem, today)}
            >
                <RowCell justifyContent={"flex-end"}>
                    <ShowDayWrapper
                        onClick={() => openFormHendler("Create", null, dayItem)}
                    >
                        <DayWrapper>
                            {isCurrentDay(dayItem) ? (
                                <CurrentDay>{dayItem.format("D")}</CurrentDay>
                            ) : (
                                dayItem.format("D")
                            )}
                        </DayWrapper>
                    </ShowDayWrapper>
                    <EventListWrapper>
                        {events.slice(0, 2).map((event) => (
                            <EventListItemWrapper key={event.id}>
                                <EventItemWrapper
                                    onClick={() => openFormHendler("Update", event)}
                                >
                                    {event.title}
                                </EventItemWrapper>
                            </EventListItemWrapper>
                        ))}
                        {events.length > 2 ? (
                            <EventListItemWrapper key={"show more"}>
                                <EventItemWrapper>show more...</EventItemWrapper>
                            </EventListItemWrapper>
                        ) : null}
                    </EventListWrapper>
                </RowCell>
            </CellWrapper>
        </>
    );
};
