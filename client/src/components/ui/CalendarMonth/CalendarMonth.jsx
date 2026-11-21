import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { useEffect, useState } from "react";
/** 
 * year, month          — який місяць показати (month: 0–11) 
 * checkIn, checkOut    — 'YYYY-MM-DD' або null 
 * minDate              — дні до неї неактивні (за замовч. сьогодні) 
 * onDayClick(dateStr) 
 */

export default function CalendarMonth({year = new Date().getFullYear(), month = new Date().getMonth(), checkIn = null, checkOut = null, minDate = new Date()}) {
    const [selected, setSelected] = useState({
    from: checkIn,
    to: checkOut
  });

    return (
    <DayPicker 
      startMonth={minDate}
      defaultMonth={new Date(year, month)}
      disabled={{before: minDate}} 
      navLayout="around"
      animate
      mode="range"
      selected={selected}
      onSelect={setSelected}
      formatters={{
        formatWeekdayName: (date) =>
            ["M", "T", "W", "T", "F", "S", "S"][date.getDay()]
        }}

    />
  );
}