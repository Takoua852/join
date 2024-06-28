let selectedContacts = [];
var defaultStatus = 'todo';
let isChecked = false;
let addedContacts = new Set();

async function init() {
    let addtaskForm = await fetch('assets/templates/task_form.html');
    let addTaskresp = await addtaskForm.text();
    document.getElementById('desk-addtaskForm').innerHTML = addTaskresp;
    contacts = JSON.parse(await getItem('contacts'));
    tasks = JSON.parse(await getItem('tasks'));
}

async function createTask() {
    tasks.push({
        title: title.value,
        description: descriptionText.value,
        assignedTo: getContactName(),
        datum: date.value,
        prio: getSelectedPriority(),
        category: getSelectedValue(),
        subtasks: getSubtaskList(),
        status: defaultStatus
    });
    await setItem('tasks', JSON.stringify(tasks));
    clearTaskForm();
    setTimeout(() => {
        openBoard();
    }, 1000);

}


function selectPriority(selectedBtn) {
    document.querySelectorAll('.p-btn').forEach(function (btn) {
        btn.classList.remove('selected');
    });
    document.querySelector('.' + selectedBtn).classList.add('selected');
}

function getSelectedPriority() {
    var selectedBtn = document.querySelector('.p-btn.selected');
    if (selectedBtn) {
        if (selectedBtn.classList.contains('urgent')) {
            return document.getElementById('urgentBtn').innerText;
        } else if (selectedBtn.classList.contains('low')) {
            return document.getElementById('lowBtn').innerText;
        } else if (selectedBtn.classList.contains('medium')) {
            return document.getElementById('mediumBtn').innerText;
        }
    }
    return '';
}

function togglePlusIcon() {
    var inputValue = document.getElementById('subtaskInput').value;
    if (inputValue === '') {
        document.querySelector('.plus-icon').style.display = 'flex';
    } else {
        document.querySelector('.plus-icon').style.display = 'none';
    }
}

function showIcons() {
    document.querySelector('.delete-icon').style.display = 'flex';
    document.querySelector('.save-icon').style.display = 'flex';
    document.querySelector('.plus-icon').style.display = 'none';
}

function hideIcons() {
    document.querySelector('.delete-icon').style.display = 'none';
    document.querySelector('.save-icon').style.display = 'none';
    document.querySelector('.plus-icon').style.display = 'flex';
}

function deleteTask() {
    document.getElementById('subtaskInput').value = '';
    hideIcons();
}

function addSubtask() {
    let newTask = document.getElementById('subtaskInput');
    if(newTask.value != ''){
        document.getElementById('newsubtasks').innerHTML += `<li class="subtaskListe">${newTask.value}</li>`;
        newTask.value = '';
        const subtaskItems = document.querySelectorAll('.subtaskListe');
        subtaskItems.forEach(function (item) {
            item.addEventListener('click', function () {
                item.remove();
            });
        });
    }
    hideIcons();
}

function clearTaskForm() {
    var form = document.getElementById("taskForm");
    form.reset();
    document.getElementById('assignedContact').innerHTML = '';
    document.getElementById('newsubtasks').innerHTML = '';
    document.querySelectorAll('.p-btn').forEach(function (btn) {
        btn.classList.remove('selected');
    });
}

function openContactList() { 
    getAssignedContacts();
    let contactListe = document.getElementById('contact');
    if (contactListe.style.display === 'none' || contactListe.style.display === '') {
        contactListe.style.display = 'flex';
      
    } else {
        contactListe.style.display = 'none';
    }
}

function getAssignedContacts() {
    let contactListe = document.getElementById('contact');
    contactListe.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contactListe.innerHTML += `<div class="contactOption">
            <div class="profilBadge" style="background-color: ${contact.color}">${getInitials(contact.name)}</div>
        <div style="text-align= left;">${contact.name}</div>
        <div><input class="form-check-input mt-0" type="checkbox" value="" id="radioBtn${i}" onclick="handleRadioClick(${i})"></div></div>`;
    }
}

function handleRadioClick(i) {
    const contact = contacts[i];
    const isSelected = selectedContacts.includes(contact);
    if (isSelected && contact.name) {
        selectedContacts += selectedContacts.filter(selectedContact => selectedContact !== contact);
    } else {
        selectedContacts.push(contact);
    }
    updateSelectedContactsDiv();
}

function updateSelectedContactsDiv() {
    const assignedContactDiv = document.getElementById('assignedContact');
    assignedContactDiv.innerHTML = '';
    selectedContacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.innerHTML = `<div style="margin-right:-16px;" >
        <div class="profilBadge" style="background-color: ${contact.color}" >${getInitials(contact.name)}</div>`;
        assignedContactDiv.appendChild(contactDiv);
    });
}

function getContactName() {
    var contactNames = [];
    for (var i = 0; i < selectedContacts.length; i++) {
        var contact = selectedContacts[i];
        contactNames.push(contact.name);
    }
    return contactNames
}

function getInitials(name) {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < words.length; i++) {
        const initial = words[i].charAt(0).toUpperCase();
        initials += initial;
    }
    return initials;
}

function getSelectedValue() {
    let selectElement = document.getElementById("select-task");
    let selectedOption = selectElement.options[selectElement.selectedIndex].innerText;
    return selectedOption
}

// function getSubtaskList() {
//     const subtaskItems = document.querySelectorAll('.subtaskListe');
//     const subtaskList = [];
//     subtaskItems.forEach(function (item) {
//         subtaskList.push(item.textContent);
//     });
//     return subtaskList;
// }

// Die Liste der Unteraufgaben aus den HTML-Elementen extrahieren, einschließlich des Status
function getSubtaskList() {
    const subtaskItems = document.querySelectorAll('.subtaskListe');
    const subtaskList = [];
    subtaskItems.forEach(function (item) {
        const subtask = {
            title: item.textContent,
            checked: isChecked
        };
        subtaskList.push(subtask);
    });
    return subtaskList;
}


function togglePlusIcon() {
    var inputValue = document.getElementById('subtaskInput').value;
    if (inputValue === '') {
        document.querySelector('.plus-icon').style.display = 'inline-block';
    } else {
        document.querySelector('.plus-icon').style.display = 'none';
    }
}

window.addEventListener("orientationchange", function() {
    // Überprüfen Sie die Ausrichtung und setzen Sie sie auf Hochformat, wenn sie im Landschaftsmodus ist
    if (window.orientation === 90 || window.orientation === -90) {
        document.body.style.transform = "rotate(90deg)";
    } else {
        document.body.style.transform = "none";
    }
});