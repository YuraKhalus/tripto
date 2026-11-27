import PlusMinus from "../../icons/PlusMinus";

export default function DateRangePickerButton({text, size}) {
    return (
        <button className="dataRange_changeButton">
            {size ? <span><PlusMinus size={size}/> </span> : null}
            <span>{text}</span> 
        </button>
    )
}