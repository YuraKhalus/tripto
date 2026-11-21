import CalendarMonth from "../../../components/ui/CalendarMonth/CalendarMonth";

export default function CalendarSection() {
    return (
        <CalendarMonth  checkIn={new Date(2026, 10, 22)}
  checkOut={new Date(2026, 10, 25)}/>
    )
}