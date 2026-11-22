import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import styles from "./CalendarMonth.module.css"
import { useState } from "react";
import ChevronRight from "../../icons/ChevronRight";

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

      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            <ChevronRight
            size={24}
            style={{ transform: "rotate(180deg)", color: "#111827" }}
          />
          }
          if (orientation === "right") {
            return <ChevronRight size={24}  />;
          }
         
          return <ChevronRight size={24} className="w-4 h-4 rotate-90" />;
        },
      }}

      classNames={styles}
    />
  );
}