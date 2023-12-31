import "./App.css";
import moment from "moment";
import { ColorRing } from 'react-loader-spinner'
import styled from "styled-components";
import {useEffect, useState} from "react";
import Control from "./components/Control/Control.jsx";
import CalendarGrid from "./components/CalendarGrid/CalendarGrid.jsx";
import Header from "./components/Header/Header.jsx";
import ErrorSidePanel from "./components/ErrorSidePanel/ErrorSidePanel.jsx";

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
const LouderWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
    const [today, setToday] = useState(moment());
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [isShowForm, setShowForm] = useState(false);
    const [method, setMethod] = useState(null);
    const [isLoader, setLoader] = useState(true);
    const [apiError, setApiError] = useState(null);

    //window.moment = moment;
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
        setToday((prev) => {
            const prevItem =
                prev.clone().subtract(1, "month");
            localStorage.setItem('today', JSON.stringify(prevItem));
            return prevItem;
        });
    };

    const todayHendler = () => {
        const itemToday = moment();
        setToday(itemToday);
        localStorage.setItem('today', JSON.stringify(itemToday));
    };
    const nextHendler = () => {

        setToday((next) => {
            const nextItem =
                next.clone().add(1, "month");
            localStorage.setItem('today', JSON.stringify(nextItem));
            return nextItem;
        });
    };
    const startDayQuery = startDay.clone().format("X");
    const endDayQuery = startDay.clone().add(totalDays, "days").format("X");


    useEffect(() => {
      const storedData =  localStorage.getItem('today');
        storedData ? setToday(moment(JSON.parse(storedData))) : null
    }, []);


    useEffect(() => {
        fetch(`${url}/events?date_gte=${startDayQuery}&date_lte=${endDayQuery}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data from the server');
                }
                return res.json();
            })
            .then((res) => {
                setEvents(res);
                setLoader(false);
                setApiError(null); // Reset error state on successful API response
                localStorage.setItem('eventsData', JSON.stringify(res)); // Save data to localStorage
            })
            .catch((error) => {
                console.error(error);
                setApiError(error.message);
                setLoader(false);
                const storedData = localStorage.getItem('eventsData');
                if (storedData) {
                    setEvents(JSON.parse(storedData));
                }
            });
    }, [today, startDayQuery, endDayQuery]);


    const openFormHendler = (methodName, eventForUpdate, dayItem) => {

        setShowForm(true);
        if (events.length === 0) {
            const storedData = localStorage.getItem("eventsData");
            if (storedData) {
                setEvents(JSON.parse(storedData));
            }
        }
        setEvent(eventForUpdate || {...defautEvant, date: dayItem.format("X")});
        setMethod(methodName);
    };

    const updateEvent = (eventForUpdate) => {
        setEvent({...eventForUpdate, update_at: moment().format('X')});
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
    const closeErrorSidePanel = () => {
        setApiError(null);
    };
    const fetchHandler = (fetchUrl, eventForUpdate, httpMethod, onSuccess) => {
        fetch(fetchUrl, {
            method: httpMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForUpdate),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((res) => {
                setEvents((prevState) =>
                    httpMethod === "PATCH"
                        ? prevState.map((eventEl) => (eventEl.id === res.id ? res : eventEl))
                        : [...prevState, res]
                );

                if (onSuccess && typeof onSuccess === "function") {
                    onSuccess(res);
                }

                setApiError(null);
                cancelButtonHandler();
            })
            .catch((error) => {
                setApiError("Error fetching data from the server");
                console.error("Fetch error:", error);
                cancelButtonHandler();
            });
    };

    const eventFetchHandler = () => {
        const fetchUrl = method === "Update" ? `${url}/events/${event.id}` : `${url}/events`;
        const httpMethod = method === "Update" ? "PATCH" : "POST";
        const dataToSend = httpMethod === "PATCH" ? event : { ...event, id: undefined };

        fetchHandler(fetchUrl, dataToSend, httpMethod, (responseData) => {
            if (httpMethod === "POST") {
                setEvent({ ...event, id: responseData.id });
            }
        });
    };
    const removeEventHandler = () => {
        const updatedEvents = events.filter((eventEl) => eventEl.id !== event.id);
        setEvents(updatedEvents);
        localStorage.setItem('eventsData', JSON.stringify(updatedEvents));
        if (navigator.onLine) {
            fetch(`${url}/events/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(() => {
                    setApiError(null);
                    cancelButtonHandler();
                })
                .catch((error) => {
                    setApiError('Error deleting data from the server');
                    console.error('Delete error:', error);
                });
        } else {
            const dataToDelete = { id: event.id };
            fetchHandler(`${url}/events/${event.id}`, dataToDelete, 'DELETE');
            setApiError('Server is not available. Changes saved locally.');
            cancelButtonHandler();
        }
    };
    if (isLoader ){
        return <LouderWrapper >
            <ColorRing

                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperClass="blocks-wrapper"
                colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
            />
        </LouderWrapper>
    }

    return (
        <>
            {apiError && (
                <ErrorSidePanel message={apiError} onClose={closeErrorSidePanel} />
            )}
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
                            {event.update_at ? (
                                <p>
                                    Updated Date {moment.unix(event.update_at).format('YYYY-MM-DD HH:mm:')}
                                </p>
                            ) : event.date && (
                                <p>
                                    Created Date {moment.unix(event.date).format('YYYY-MM-DD ')}
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
