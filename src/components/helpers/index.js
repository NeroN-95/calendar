import moment from "moment/moment.js";

export const isCurrentDay = (day) => moment().isSame(day, "day");
export const isSelectedMon = (day, today) => today.isSame(day, "month");

export const isDayContainCurrentEvent = (event, dayItem) =>
    event.date >= dayItem.format("X") &&
    event.date <= dayItem.clone().endOf("day").format("X");
