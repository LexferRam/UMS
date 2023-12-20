export const eventForToday = (arr: any) => {

    const dates = arr?.map((date:any) => date?.start)

    let arrayLength: any[] = []

    arr?.map((date: any) => {
        const givenDate = new Date(date?.start);
        const today = new Date();

        // Compare only the year, month, and day to avoid timezone issues
        const isToday = givenDate.getFullYear() === today.getFullYear() &&
            givenDate.getMonth() === today.getMonth() &&
            givenDate.getDate() === today.getDate();

        isToday && arrayLength.push(date)
    })

    return arrayLength
}