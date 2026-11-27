import PlusMinus from "../../icons/PlusMinus";
import CalendarMonth from "../CalendarMonth/CalendarMonth";
import DateRangePickerButton from "./DateRangePickerButton";

export default function DateRangePicker({value = {checkIn: null, checkOut: null}, onChange = null, minDate = new Date()}) {
    const { checkIn, checkOut } = value;
    return (
        <>
        
        
            <div className="modal_window_dataRange">
                <h4 className="dataRange_title">
                    <button className="dataRange_title_button_date">Date</button>
                    <button className="dataRange_title_button_date">Flexible</button>
                </h4>

            <div className="dataRange_calendars_container">
                <CalendarMonth checkIn={checkIn} checkOn={checkOut} minDate={minDate}/>
                <CalendarMonth checkIn={checkIn} checkOn={checkOut} minDate={minDate}/>
            </div>

            <div className="dataRange_changeButtons_container">
                <DateRangePickerButton text={"Exact Day"}/>
                <DateRangePickerButton text={"1 Days"} size={16}/>
                <DateRangePickerButton text={"2 Days"} size={16}/>
                <DateRangePickerButton text={"3 Days"} size={16}/>
                <DateRangePickerButton text={"4 Days"} size={16}/>
            </div>
                
            </div>
        </>
    )
    
}