import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { useState } from "react";
/** 
 * year, month          — який місяць показати (month: 0–11) 
 * checkIn, checkOut    — 'YYYY-MM-DD' або null 
 * minDate              — дні до неї неактивні (за замовч. сьогодні) 
 * onDayClick(dateStr) 
 */

export default function CalendarMonth({year, checkIn, checkOut, minDate}) {
    const [selected, setSelected] = useState();
    return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}