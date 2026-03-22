import { useState } from "react";

export const useGetDays = () => {
  const [days, useDays] = useState([
    {
      name: "Sunday",
      isActive: false,
      date: 17,
    },
    {
      name: "Monday",
      isActive: false,
      date: 11,
    },
    {
      name: "Tuesday",
      isActive: false,
      date: 12,
    },
    {
      name: "Wednesday",
      isActive: false,
      date: 13,
    },
    {
      name: "Thursday",
      isActive: false,
      date: 14,
    },

    {
      name: "Friday",
      isActive: false,
      date: 15,
    },
    {
      name: "Saturday",
      isActive: false,
      date: 16,
    },
  ]);
  const getTodayDay = () => {
    const dayOfTheWeek = new Date();

    return days[dayOfTheWeek.getDay()];
  };

  const getTodayDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

  return { getTodayDay, getTodayDate, days };
};
