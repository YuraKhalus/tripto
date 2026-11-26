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

    return (<>
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
            return (
              <svg width={24} height={24} transform="rotate(180 0 0)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99978 19.75C8.80778 19.75 8.61575 19.6771 8.46975 19.5301C8.17675 19.2371 8.17675 18.762 8.46975 18.469L14.9397 11.999L8.46975 5.52908C8.17675 5.23608 8.17675 4.76104 8.46975 4.46804C8.76275 4.17504 9.23779 4.17504 9.53079 4.46804L16.5308 11.468C16.8238 11.761 16.8238 12.2361 16.5308 12.5291L9.53079 19.5291C9.38379 19.6771 9.19178 19.75 8.99978 19.75Z" fill="#000"/>
              </svg>
              )
          }
          if (orientation === "right") {
            return (
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.99978 19.75C8.80778 19.75 8.61575 19.6771 8.46975 19.5301C8.17675 19.2371 8.17675 18.762 8.46975 18.469L14.9397 11.999L8.46975 5.52908C8.17675 5.23608 8.17675 4.76104 8.46975 4.46804C8.76275 4.17504 9.23779 4.17504 9.53079 4.46804L16.5308 11.468C16.8238 11.761 16.8238 12.2361 16.5308 12.5291L9.53079 19.5291C9.38379 19.6771 9.19178 19.75 8.99978 19.75Z" fill="#000"/>
              </svg>
              )
          }
          
          return <ChevronRight {...props} className="w-4 h-4 rotate-90" />;
        },
      }}

      classNames={styles}
    />

        </>
  );
}