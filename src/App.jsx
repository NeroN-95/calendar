import "./App.css";
import moment from "moment";

import styled from "styled-components";
import {useEffect, useState} from "react";
import Control from "./components/Control/Control.jsx";
import CalendarGrid from "./components/CalendarGrid/CalendarGrid.jsx";
import Header from "./components/Header/Header.jsx";

const ShadowWrapper = styled("div")`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #1a1a1a,
  0 0px 20px 6px #000;
`;
const FromPositionWrapper = styled("div")`
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rbga(0, 0, 0, 0.35);
  color: red;
`;
const FromWrapper = styled(ShadowWrapper)`
  width: 200px;
  background: azure;
  color: black;
  box-shadow: unset;
`;
const EventTitle = styled("input")`
  padding: 8px 14px;
  font-size: 0.85rem;
  width: 100%;
  border: unset;
  background: azure;
  color: black;
  outline: unset;
  border-bottom: 1px solid #46464b;
`;
const EventBody = styled("textarea")`
  padding: 8px 14px;
  font-size: 0.85rem;
  width: 100%;
  border: unset;
  background: azure;
  color: black;
  outline: unset;
  border-bottom: 1px solid #46464b;
  resize: none;
  height: 60px;
`;
const EventData = styled("div")`
  padding: 8px 14px;
  font-size: 0.85rem;
  width: 100%;
  border: unset;
  background: azure;
  color: black;
  outline: unset;
  border-bottom: 1px solid #46464b;
`;
const ButtonsWrapper = styled("div")`
  padding: 8px 14px;
  display: flex;
  justify-content: flex-end;
`;
const ButtonWrapper = styled("button")`
  border-radius: 2px;
  color: ${(props) => (props.danger ? "#f00" : "#27282A")};
  border: 1px solid ${(props) => (props.danger ? "#f00" : "#27282A")};
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 2px;
  }
`;

function App() {
    const [today, setToday] = useState(moment());
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [isShowForm, setShowForm] = useState(false);
    const [method, setMethod] = useState(null);

    window.moment = moment;
    // const today = moment();
    moment.updateLocale("en", {week: {dow: 1}});
    const startDay = today.clone().startOf("month").startOf("week");
    const totalDays = 42;
    const url = " http://localhost:3000";
    const defautEvant = {
        title: "",
        description: "",
        date: moment().format("x"),
        create_at: null,
        update_at: null
    };
    const prevHendler = () => {
        setToday((prev) => prev.clone().subtract(1, "month"));
    };

    const todayHendler = () => {
        setToday(moment());
    };
    const nextHendler = () => {
        setToday((next) => next.clone().add(1, "month"));
    };
    const startDayQuery = startDay.clone().format("X");
    const endDayQuery = startDay.clone().add(totalDays, "days").format("X");

    useEffect(() => {
        fetch(`${url}/events?date_gte=${startDayQuery}&date_lte=${endDayQuery}`)
            .then((res) => res.json())
            .then((res) => {
                setEvents(res);
            });
    }, [today]);

    useEffect(() => {
        localStorage.setItem('events', events);
    }, [events]);

    const openFormHendler = (methodName, eventForUpdate, dayItem) => {
        // setShowForm(true);
        //
        // setEvent(eventForUpdate || {...defautEvant, date: dayItem.format("x")});
        //  setMethod(methodName);
        // if (eventForUpdate !== null) {
        //     setShowForm(true);
          //  setEvent({...eventForUpdate, update_at: dayItem.format('x')});
           // console.log('eventForUpdate', eventForUpdate);
        //
        //     setMethod(methodName);
        // } else {
            setShowForm(true);
            setEvent( eventForUpdate || {...defautEvant, date: dayItem.format("x")});
            setMethod(methodName);
        // }
    };

    const updateEvent = ( eventForUpdate) =>{
        setEvent({...eventForUpdate, update_at: moment().format('x')});
        console.log('updateEvent');
    };

    const cancelButtonHandler = () => {
        setShowForm(false);
        setEvent(null);
    };
    const changeEventHandler = (text, field) => {
        setEvent((prevState) => ({
            ...prevState,
            [field]: text,
        }));
    };

    const fetchHandler = (fetchUrl, eventForUpdate, httpMethod) => {
        fetch(fetchUrl, {
            method: httpMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForUpdate),
        })
            .then((res) => res.json())
            .then((res) => {
                if (httpMethod === "PATCH") {
                    setEvents((prevState) =>
                        prevState.map((eventEl) => (eventEl.id === res.id ? res : eventEl)),
                    );
                } else {
                    setEvents((prevState) => [...prevState, res]);
                }
                cancelButtonHandler();
            });
    };

    const eventFetchHandler = () => {
        const fetchUrl =
            method === "Update" ? `${url}/events/${event.id}` : `${url}/events`;
        const httpMethod = method === "Update" ? "PATCH" : "POST";

        fetchHandler(fetchUrl, event, httpMethod);
    };
    const removeEventHandler = () => {
        const fetchUrl = `${url}/events/${event.id}`;
        const httpMethod = "DELETE";

        fetch(fetchUrl, {
            method: httpMethod,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setEvents((prevState) =>
                    prevState.filter((eventEl) => eventEl.id !== event.id),
                );
                cancelButtonHandler();
            });
    };

    return (
        <>
            {isShowForm ? (
                <FromPositionWrapper onClick={cancelButtonHandler}>
                    <FromWrapper onClick={(e) => e.stopPropagation()}>
                        <EventTitle
                            value={event.title}
                            onChange={(e) => changeEventHandler(e.target.value, "title")}
                            placeholder="Title"
                        />
                        <EventBody
                            value={event.description}
                            onChange={(e) =>
                                changeEventHandler(e.target.value, "description")
                            }
                            placeholder="Description"
                        />
                        <EventData>
                            {/*{method === "Update"*/}
                            {/*    ? `"Created at"${moment*/}
                            {/*        .unix(event.date)*/}
                            {/*        .format("YYYY-MM-DD HH:mm:")} `*/}
                            {/*    : `"Create date"${moment().format("YYYY-MM-DD HH:mm:")} `}*/}

                            {event.update_at ? (
                                <p>
                                    Updated Date {moment.unix(event.update_at).format('YYYY-MM-DD HH:mm:')}
                                </p>
                            ): event.date && (
                                <p>
                                    Created Date {moment.unix(event.date).format('YYYY-MM-DD HH:mm:')}
                                </p>
                            )}



                        </EventData>
                        <ButtonsWrapper>
                            <ButtonWrapper onClick={cancelButtonHandler}>
                                Cancel
                            </ButtonWrapper>
                            <ButtonWrapper onClick={eventFetchHandler}>
                                {method}
                            </ButtonWrapper>
                            {method === "Update" ? (
                                <ButtonWrapper danger onClick={removeEventHandler}>
                                    Delete
                                </ButtonWrapper>
                            ) : null}
                        </ButtonsWrapper>
                    </FromWrapper>
                </FromPositionWrapper>
            ) : null}
            <ShadowWrapper>
                <Header/>
                <Control
                    today={today}
                    prevHendler={prevHendler}
                    todayHendler={todayHendler}
                    nextHendler={nextHendler}
                />
                <CalendarGrid
                    startDay={startDay}
                    today={today}
                    totalDays={totalDays}
                    events={events}
                    openFormHendler={openFormHendler}
                    updateEvent={updateEvent}
                    method={method}

                />
            </ShadowWrapper>
        </>
    );
}

export default App;
