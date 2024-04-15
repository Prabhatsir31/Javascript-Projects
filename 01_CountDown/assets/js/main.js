const endDate = "31 December 2024 12:00 AM"

document.getElementById("end-date").innerHTML = endDate;
const inputs = document.querySelectorAll("input")


function clock() {
    const end = new Date(endDate);
    const now = new Date()
    const diff = (end - now) / 1000;
    if(diff < 0) return;
    
    // convert into Days
    inputs[0].value = Math.floor(diff / 3600 / 24);
    // convert into Hrs
    inputs[1].value = Math.floor(diff / 3600) % 24;
    // convert into Min
    inputs[2].value = Math.floor(diff / 60) % 60;
    // convert into Sec
    inputs[3].value = Math.floor(diff) % 60;
}

// initial call
clock()

/* 
    1 day = 24 hrs
    1 hrs = 60 min
    1 min = 3600 sec
*/

setInterval() (
    () => {
        clock()
    },
    1000
)
