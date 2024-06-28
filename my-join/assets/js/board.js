let isTaskOverlayOpen = false;
let isEditing = false;

async function initBoard() {
    contacts = JSON.parse(await getItem('contacts'));
    tasks = JSON.parse(await getItem('tasks'));
    todoliste();
    inProgressliste();
    awaitFeedbackListe();
    doneListe();
    checkTasks();
}

async function showFloatingTask() {
    let addTask = await fetch('assets/templates/task_form.html');
    let addTaskresp = await addTask.text();
    document.getElementById('floatingTask').style.display = 'block';
    document.getElementById('floatingTask').innerHTML = addTaskresp;
    document.getElementById('floatingTask').innerHTML += `<img src="assets/img/close.png"
     style="position:absolute;top:60px; right:60px; cursor:pointer" onclick="closeFloatingTask()">`
    document.addEventListener('click', handleClickOutside);
}

function handleClickOutside(event) {
    const floatingTaskContainer = document.getElementById('floatingTask');
    if (!floatingTaskContainer.contains(event.target)) {
        closeFloatingTask();
        document.removeEventListener('click', handleClickOutside);
    }
}

function closeFloatingTask() {
    document.getElementById('floatingTask').style.display = 'none';
}

async function addTodo() {
    showFloatingTask();
}

function addInProgress() {
    defaultStatus = 'inprogress';
    showFloatingTask();
}

function addAwaitFeedback() {
    defaultStatus = 'awaitfeedback';
    showFloatingTask();
}

function todoliste() {
    todo.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === 'todo') {
            todo.innerHTML += htmlTemplateCard(i)
        }
    }
}

function inProgressliste() {
    if (inprogress.length === 0) {
        inprogress.innerHTML = '<div>no tasks</div>'
    } else {
        inprogress.innerHTML = ''
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].status === 'inprogress') {
                inprogress.innerHTML += htmlTemplateCard(i)
            }
        }
    }
}

function awaitFeedbackListe() {
    awaitfeedback.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === 'awaitfeedback')
            awaitfeedback.innerHTML += htmlTemplateCard(i);
    }
}

function doneListe() {
    done.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].status === 'done')
            done.innerHTML += htmlTemplateCard(i);
    }
}

function checkTasks() {
    noTasksTodo.style.display = (todo.children.length === 0) ? 'flex' : 'none';
    noTasksInProgress.style.display = (inprogress.children.length === 0) ? 'flex' : 'none';
    noTasksAwaitingFeedback.style.display = (awaitfeedback.children.length === 0) ? 'flex' : 'none';
}

document.querySelectorAll('.column').forEach(function (column) {
    column.addEventListener('DOMSubtreeModified', checkTasks);
});

function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    initColumns();
    tasks.forEach((task, i) => {
        if (taskMatchesSearch(task, searchTerm)) {
            addToColumn(task, i);
        }
    });
}

function taskMatchesSearch(task, searchTerm) {
    return task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
}

function addToColumn(task, index) {
    const column = getColumnElement(task.status);
    column.innerHTML += htmlTemplateCard(index);
}

function getColumnElement(status) {
    return document.getElementById(status);
}

function initColumns() {
    const columns = ['todo', 'inprogress', 'awaitfeedback', 'done'];
    columns.forEach(column => {
        const columnElement = getColumnElement(column);
        columnElement.innerHTML = '';
    });
}

// Task Card 
function countCheckedSubtasks(i) {
    let count = 0;
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
        if (tasks[i].subtasks[j].checked) {
            count++;
        }
    }
    return count;
}

function getAssignedtoContact(assignedContacts) {
    let result = '';
    for (let assignedContact of assignedContacts) {
        let contact = contacts.find(c => c.name === assignedContact);
        if (contact) {
            result += `<div class="profilBadge" style="background-color: ${contact.color};margin-right:-8px">${getInitials(contact.name)}</div>`;
        } else {
            result += `<div class="profilBadge">${getInitials(assignedContact)}</div>`;
        }
    }
    return result;
}

function getCategoryBackground(category) {
    if (category === 'User Story') {
        return 'rgba(0, 56, 255, 1)';
    } else if (category === 'Technical Task') {
        return 'rgba(31, 215, 193, 1)';
    }
}

// opened task
function getContactsInfo(assignedContacts) {
    let info = '';
    for (let assignedContact of assignedContacts) {
        let contact = contacts.find(c => c.name === assignedContact);
        let badgeHTML;
        if (contact) {
            badgeHTML = `<div class="profilBadge" style="background-color: ${contact.color};">${getInitials(contact.name)}</div>`;
        } else {
            badgeHTML = `<div class="profilBadge">${getInitials(assignedContact)}</div>`;
        }
        info += `<div style="display:flex;align-items:center;gap:20px;">${badgeHTML}<div>${assignedContact}</div></div>`;
    }
    return info;
}

function generateSubtaskDivs(i) {
    const subtaskDivs = [];
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
        let task = tasks[i].subtasks[j].title
        let checkboxId = `subtask${i}_${j}`;
        isChecked = tasks[i].subtasks[j].checked;
        subtaskDivs.push(`<div style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="${checkboxId}" ${isChecked ? 'checked' : ''}>
        <label for="${checkboxId}">${task}</label></div>`);
    }
    return subtaskDivs.join('')
}

function closeTaskOverlay(i) {
    let taskOverlay = document.getElementById(`taskoverlay${i}`);
    if (taskOverlay) {
        taskOverlay.parentNode.removeChild(taskOverlay);
        isTaskOverlayOpen = false;
    }
    initBoard();
}

function getTaskInfo(i) {
    editTitle.value = `${tasks[i].title}`;
    editDescription.value = `${tasks[i].description}`;
    editDate.value = `${tasks[i].datum}`;
    let priorityBtn = document.getElementById(`${tasks[i].prio}` + 'Btn');
    if (priorityBtn) {
        priorityBtn.classList.add('selected');
    }
    assignedContact.innerHTML = `${getAssignedtoContact(tasks[i].assignedTo)}`;
}

function toggleEditOpen(i) {
    let isEditing = (document.getElementById(`editOverlay${i}`) !== null);
    if (!isEditing) {
        editTaskOverlay(i);
    } else {
        updateTask(i);
    }
}

function closeEditTask(i) {
    closeTaskOverlay(i);
    isEditing = false;
}

function generateSubtaskListe(i) {
    const subtaskDivs = [];
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
        let task = tasks[i].subtasks[j].title
        subtaskDivs.push(`<li class="subtaskListe" onclick="setupSubtaskRemoval()">${task}</li>`);
    }
    return subtaskDivs.join('');
}

function setupSubtaskRemoval() {
    const subtaskItems = document.querySelectorAll('.subtaskListe');
    subtaskItems.forEach(function (item) {
        item.addEventListener('click', function () {
            item.remove();
        });
    });
}

function openTaskOverlay(i) {
    let taskOverlayHTML = htmlTemplateTaskOverlay(i);

    document.getElementById('desk-content').innerHTML += taskOverlayHTML;
    checkSubtasks(i);
    isTaskOverlayOpen = true;
}

async function checkSubtasks(i) {
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
        const checkboxId = `subtask${i}_${j}`;
        document.getElementById(checkboxId).addEventListener('click', function () {
            const isChecked = this.checked;
            tasks[i].subtasks[j].checked = isChecked;
            setItem('tasks', JSON.stringify(tasks));
        });
    }
}

async function deleteTaskOverlay(i) {
    try {
        tasks.splice(i, 1);
        await setItem('tasks', JSON.stringify(tasks));
        closeTaskOverlay(i);
        initBoard();

    } catch (e) {
        console.error('Fehler beim Löschen des Kontakts:', e);
    }
}

function editSelectedPriority() {
    var selectedBtn = document.querySelector('.p-btn.selected');
    if (selectedBtn) {
        if (selectedBtn.classList.contains('urgent')) {
            return document.getElementById('UrgentBtn').innerText;
        } else if (selectedBtn.classList.contains('low')) {
            return document.getElementById('LowBtn').innerText;
        } else if (selectedBtn.classList.contains('medium')) {
            return document.getElementById('MediumBtn').innerText;
        }
    }
    return '';
}

function subtaskchecked(i) {
    let checkedusbTasks = [];
    for (let j = 0; j < tasks[i].length; j++) {
        if (tasks[i].subtasks[j].checked === true) {
            checkedusbTasks.push(tasks[i].subtasks[j].checked)
        }
        return checkedusbTasks.length
    }
}

async function updateTask(i) {
    tasks[i].title = editTitle.value;
    tasks[i].description = editDescription.value;
    tasks[i].datum = editDate.value;
    tasks[i].prio = editSelectedPriority();
    tasks[i].assignedTo = getContactName();
    tasks[i].subtasks = getSubtaskList();
    await setItem('tasks', JSON.stringify(tasks));
    closeEditTask(i);
    initBoard()
}

window.addEventListener("orientationchange", function () {
    if (window.orientation === 90 || window.orientation === -90) {
        document.body.style.transform = "rotate(90deg)";
    } else {
        document.body.style.transform = "none";
    }
});











