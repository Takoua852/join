async function initSummary() {
    contacts = JSON.parse(await getItem('contacts'));
    tasks = JSON.parse(await getItem('tasks'));
    greeting();
    getConnectedUser();
    getAlltasks();
 
}

function getAlltasks() {
    numberoftotasks.innerText = countTasks('todo');
    numberofdonetasks.innerText = countTasks('done');
    urgentTasks.innerText = countPrioTasks('Urgent');
    boardTasks.innerText = tasks.length;
    progressTasks.innerText = countTasks('inprogress');
    afTasks.innerText = countTasks('awaitfeedback');
    deadLineDatum.innerText = findUpcomingDate();
}

function countTasks(status) {
    let todoCount = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === status) {
            todoCount++;
        }
    }
    return todoCount;
}

function countPrioTasks(prio) {
    let prioTasksCount = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].prio === prio) {
            prioTasksCount++;
        }
    }
    return prioTasksCount;
}

function findUpcomingDate() {
    let today = new Date();
    let upcomingDate = null;
    for (let i = 0; i < tasks.length; i++) {
        let taskDate = new Date(tasks[i].datum);
        upcomingDate = taskDate;
        if (taskDate > today && (upcomingDate === null || taskDate < upcomingDate)) {
            upcomingDate = taskDate;
        }
    }

    if (upcomingDate !== null) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let day = upcomingDate.getDate();
        let monthIndex = upcomingDate.getMonth();
        let year = upcomingDate.getFullYear();
        return `${monthNames[monthIndex]} ${day}, ${year}`;
    }
    return upcomingDate.toDateString();
}

function getConnectedUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        if (name === 'G') {
            document.getElementById('g_username').innerHTML = 'Guest';
        } else {
            document.getElementById('g_username').innerHTML = name;
        }
    }
}

function greeting(){
    let greeting = document.querySelector('.greetingDiv');
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        greeting.innerHTML = "Good morning,";
    }
    else if (hour >= 12 && hour < 18) {
        greeting.innerHTML = "Good afternoon,";
    }
    else {
        greeting.innerHTML = "Good evening,";
    }

   return greeting.innerHTML += `<br>
    <div id="g_username"></div>`;
}

window.addEventListener("orientationchange", function() {
    if (window.orientation === 90 || window.orientation === -90) {
        document.body.style.transform = "rotate(90deg)";
    } else {
        document.body.style.transform = "none";
    }
});
