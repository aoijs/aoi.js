function getWeekOfYear(dateMSOrString, Timezone) {
    const date = new Date(dateMSOrString);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));

    const yearStart = new Date(
        new Date(Date.UTC(date.getFullYear(), 0, 1)).toLocaleString("en-us", {
            timeZone: Timezone,
        }),
    );

    const weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);

    return [date.getFullYear(), weekNumber];
}

function getQuarterOfMonth(dateMSOrString) {
    const date = new Date(dateMSOrString);
    return Math.trunc((date.getMonth() + 1) / 4);
}

// Now Making a Pain Generator, i feel pain, i wanna die

module.exports = (format, date, timezone) => {
    const aNewDate = new Date(date);
    switch (format) {
        // Months of Year
        case "M": {
            format = aNewDate.getMonth() + 1;
        }
            break;
        case "MM": {
            format = aNewDate.getMonth() + 1;
        }
            break;
        case "MMM": {
            format = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ][aNewDate.getMonth()];
        }
            break;
        case "MMMM": {
            format = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ][aNewDate.getMonth()];
        }
            break;
        // Date of Month
        case "D": {
            format = aNewDate.getDate();
        }
            break;
        case "DD": {
            format = aNewDate.getDate();
        }
            break;
        // with Ordinal
        case "Do": {
            const month = aNewDate.getDate();
            if (
                month.toString().endsWith("1") &&
                !month.toString().endsWith("11")
            ) {
                format = month.toString() + "st";
            } else if (
                month.toString().endsWith("2") &&
                !month.toString().endsWith("12")
            ) {
                format = month.toString() + "nd";
            } else if (
                month.toString().endsWith("3") &&
                !month.toString().endsWith("13")
            ) {
                format = month.toString() + "rd";
            } else {
                format = month.toString() + "th";
            }
        }
            break;
        // With Abbrev and Full
        case "ddd": {
            format = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                aNewDate.getDay()
                ];
        }
            break;
        case "dddd": {
            format = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ][aNewDate.getDay()];
        }
            break;
        // Day of Year
        case "DDD": {
            const aDay = 1000 * 3600 * 24;
            const nowDate = aNewDate;
            const firstDate = new Date(
                new Date(Date.UTC(nowDate.getFullYear(), 0, 0)).toLocaleString(
                    "en-US",
                    {timeZone: timezone},
                ),
            );

            const difference =
                nowDate -
                firstDate -
                (firstDate.getTimezoneOffset() - nowDate.getTimezoneOffset()) *
                60 *
                1000;

            format = Math.floor(difference / aDay);
        }
            break;
        case "DDDD": {
            const aDay = 1000 * 3600 * 24;
            const nowDate = aNewDate;
            const firstDate = new Date(
                new Date(Date.UTC(nowDate.getFullYear(), 0, 0)).toLocaleString(
                    "en-US",
                    {timeZone: timezone},
                ),
            );

            const difference =
                nowDate -
                firstDate -
                (firstDate.getTimezoneOffset() - nowDate.getTimezoneOffset()) *
                60 *
                1000;

            format = Math.floor(difference / aDay);
        }
            break;
        // Unix Timestamp
        //in MS
        case "x": {
            format = aNewDate.getTime();
        }
            break;
        //in Seconds
        case "X": {
            format = aNewDate.getTime() / 1000;
        }
            break;
        // Year
        // 4 digits
        case "YYYY": {
            format = aNewDate.getFullYear();
        }
            break;
        // 2 digits
        case "YY": {
            format = aNewDate.getFullYear().toString().split("").splice(2).join("");
        }
            break;
        // Quarter of Year
        case "Q": {
            format = getQuarterOfMonth(date);
        }
            break;

        // Week Locales and ISO
        case "gg": {
            format = aNewDate.getFullYear().toString().split("").splice(2).join("");
        }
            break;
        case "gggg": {
            format = aNewDate.getFullYear();
        }
            break;
        case "w": {
            format = getWeekOfYear(aNewDate, timezone);
        }
            break;
        case "ww": {
            format = getWeekOfYear(aNewDate, timezone);
        }
            break;
        case "e": {
            format = aNewDate.getDay();
        }
            break;
        //ISO (idk whats the difference)
        case "GG": {
            format = new Date(aNewDate.toISOString())
                .getFullYear()
                .toString()
                .split("")
                .splice(2)
                .join("");
        }
            break;
        case "GGGG": {
            format = new Date(aNewDate.toISOString()).getFullYear();
        }
            break;
        case "W": {
            format = getWeekOfYear(new Date(aNewDate.toISOString()), timezone);
        }
            break;
        case "WW": {
            format = getWeekOfYear(new Date(aNewDate.toISOString()), timezone);
        }
            break;
        case "E": {
            format = new Date(aNewDate.toISOString()).getDay();
        }
            break;

        // Locale Aware Functions
        case "L": {
            format = aNewDate
                .toLocaleString("en-US", {timeZone: timezone})
                .split(", ")[0];
        }
            break;
        case "LL": {
            const clonedDate = aNewDate;
            format = `${
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][clonedDate.getMonth()]
            } ${clonedDate.getDate()} ${clonedDate.getFullYear()}`;
        }
            break;
        case "LLL": {
            const clonedDate = aNewDate;
            format = `${
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][clonedDate.getMonth()]
            } ${clonedDate.getDate()} ${clonedDate.getFullYear()} ${
                clonedDate.getHours() > 12
                    ? clonedDate.getHours() - 12
                    : clonedDate.getHours()
            }:${
                clonedDate.getMinutes().toString().length === 2
                    ? clonedDate.getMinutes()
                    : "0" + clonedDate.getMinutes().toString()
            } ${clonedDate.getHours() > 12 ? "PM" : "AM"}`;
        }
            break;
        case "LLLL": {
            const clonedDate = aNewDate;
            format = `${
                [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ][clonedDate.getDay()]
            }, ${
                [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ][clonedDate.getMonth()]
            } ${clonedDate.getDate()} ${clonedDate.getFullYear()} ${
                clonedDate.getHours() > 12
                    ? clonedDate.getHours() - 12
                    : clonedDate.getHours()
            }:${
                clonedDate.getMinutes().toString().length === 2
                    ? clonedDate.getMinutes()
                    : "0" + clonedDate.getMinutes().toString()
            } ${clonedDate.getHours() > 12 ? "PM" : "AM"}`;
        }
            break;
        case "LT": {
            const clonedDate = aNewDate;
            const isPM = clonedDate.getHours() > 12;
            format = `${
                isPM ? clonedDate.getHours() - 12 : clonedDate.getHours()
            }:${
                clonedDate.getMinutes().toString().length === 2
                    ? clonedDate.getMinutes()
                    : "0" + clonedDate.getMinutes().toString()
            } ${isPM ? "PM" : "AM"}`;
        }
            break;
        case "LTS": {
            const clonedDate = aNewDate;
            const isPM = clonedDate.getHours() > 12;
            format = `${
                isPM ? clonedDate.getHours() - 12 : clonedDate.getHours()
            }:${
                clonedDate.getMinutes().toString().length === 2
                    ? clonedDate.getMinutes()
                    : "0" + clonedDate.getMinutes().toString()
            }:${
                clonedDate.getSeconds().toString().length === 2
                    ? clonedDate.getSeconds()
                    : "0" + clonedDate.getSeconds().toString()
            } ${isPM ? "PM" : "AM"}`;
        }
            break;

        // Hours, mins,seconds, offset
        //24 Hours Format
        case "H": {
            format = aNewDate.getHours();
        }
            break;
        case "HH": {
            format = aNewDate.getHours();
        }
            break;
        //12 Hours Format
        case "h": {
            const newDate = aNewDate;
            format =
                newDate.getHours() > 12
                    ? newDate.getHours() - 12
                    : newDate.getHours();
        }
            break;
        case "hh": {
            const newDate = aNewDate;
            format =
                newDate.getHours() > 12
                    ? newDate.getHours() - 12
                    : newDate.getHours();
        }
            break;
        case "a": {
            format = aNewDate.getHours() > 12 ? "PM" : "AM";
        }
            break;
        case "A": {
            format = aNewDate.getHours() > 12 ? "PM" : "AM";
        }
            break;
        case "m": {
            format = aNewDate.getMinutes();
        }
            break;
        case "mm": {
            format = aNewDate.getMinutes();
        }
            break;
        case "s": {
            format = aNewDate.getSeconds();
        }
            break;
        case "ss": {
            format = aNewDate.getSeconds();
        }
            break;
        case "ms": {
            format = aNewDate.getMilliseconds();
        }
            break;
    }
    return format;
};
