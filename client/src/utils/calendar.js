export function getMonthGrid(year, month) {

    const weeksArray = []

    const date = new Date(year, month, 1);
    let dateArray = [];
    let weekArray = []

    while (date.getMonth() === month){
        dateArray.push(new Date(date))
        date.setDate(date.getDate() + 1);
    }
    dateArray.forEach(date => 
    { 
        const day = date.getDay() - 1;

        if (day === -1) {
            weekArray[6] = date
        } else {
            weekArray[day] = date
        }
        
        
        if (day == -1) {
            weeksArray.push(weekArray)
            weekArray = [];
        }
    })

    weeksArray.push(weekArray)

    console.log(weeksArray)
}


export function toISODate(date) {
    let dateISO = date.toISOString()
    return dateISO.slice(0,10)
}