import CalendarMonth from "../../../components/ui/CalendarMonth/CalendarMonth";

export default function CalendarSection() {
    return (
        <div style={{
            "backgroundColor": "gray",
            "padding": "20px",
            "display": "flex",
            "gap": "10px"}}>
            <CalendarMonth />
            <CalendarMonth size="sm"/>
        </div>
        
    )
}