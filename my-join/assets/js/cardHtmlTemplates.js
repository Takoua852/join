function htmlTemplateCard(i) {
    return /*html*/ `<div id="card${i}" class="card draggable" onclick="openTaskOverlay(${i})" draggable="true" ondragstart="drag(event)">
    <div id="labelBoard" style="background-color:${getCategoryBackground(`${tasks[i].category}`)}" >${tasks[i].category}</div>
    <div id="cardContent">
        <div id="cardTitle">${tasks[i].title}</div>
        <div id="cardText">${tasks[i].description}</div>
    </div>
    <div class="progressBar" >
        <progress value="${countCheckedSubtasks(i)}" max="${tasks[i].subtasks.length}" ></progress>
        <div id="subTasks${i}" style="font-size:12px;display:flex;">${countCheckedSubtasks(i)}/${tasks[i].subtasks.length} Subtasks</div>
    </div>
    <div id="cardBottom" style="display:flex;justify-content:space-between;align-items:center;">
        <div id="contacts" style="display:flex;">${getAssignedtoContact(tasks[i].assignedTo)}</div>
        <div id="prioIcon" ><img src="assets/img/${tasks[i].prio}-btn.png"></div>
    </div>
</div>`;
}

function htmlTemplateTaskOverlay(i) {
    return /*html*/ `<div class="taskOverlay" id="taskoverlay${i}">
    <div style="display: flex;justify-content: space-between;align-items: center;"> 
    <div class="overlayLabel" style="background-color:${getCategoryBackground(`${tasks[i].category}`)} !important" >${tasks[i].category}</div>
    <img style="object-fit:contain; cursor:pointer; align-self:flex-end;" src="assets/img/close.png" onclick="closeTaskOverlay(${i})"></div>
    <div class="overlayTitle">${tasks[i].title}</div>
    <div style="font-weight:400;font-size:20px;Line-height:24px;">${tasks[i].description}</div>
    <div>Due date: ${tasks[i].datum}</div>
    <div style="display: flex;gap:20px;"> Priority:<div style="display:flex;gap:20px;">${tasks[i].prio} <img src="assets/img/${tasks[i].prio}-btn.png" style="object-fit:contain;"></div></div>
    <div>Assigned to: 
        <div style="display: flex;flex-direction: column; gap: 20px; padding-top: 20px; height: auto; overflow-y: scroll;
        scrollbar-width: none;">${getContactsInfo(tasks[i].assignedTo)}</div>
    </div>
    Subtasks:  ${generateSubtaskDivs(i)}
    <div class="editDeleteBtn"> 
    <img class="deleteContactBtn" style="cursor: pointer;" src="assets/img/delete-contact.png" onclick="deleteTaskOverlay(${i})"> | 
    <img class="editContactBtn" style="cursor: pointer;" src="assets/img/edit-contact.png" onclick="toggleEditOpen(${i})">    
    </div>
</div>`;
}
function editTaskOverlay(i) {
    let taskOverlay = document.getElementById(`taskoverlay${i}`);
    taskOverlay.innerHTML = '';
    taskOverlay.innerHTML = /*html*/ `
    <img style="width:16px;align-self:flex-end;" src="assets/img/close.png" onclick="closeEditTask(${i})">
    Title<input placeholder="Enter Title" id="editTitle" style=" padding: 16px 8px;">
    Description <textarea placeholder="Enter Deascription" id="editDescription"></textarea>
    Due date <input type="date" id="editDate" style="padding:20px 8px;">
    Priority <div style="display:flex;align-items:center; justify-content:space-between"> 
        <button class="urgent p-btn" onclick="selectPriority('urgent')" id="UrgentBtn">Urgent</button>
        <button class="medium p-btn" onclick="selectPriority('medium')" id="MediumBtn">Medium</button>
        <button class="low p-btn" onclick="selectPriority('low')" id="LowBtn">Low</button></div>
        Assigned to
        <div class="assignedto-input" onclick="openContactList(event)" style=" padding: 16px 6px;">Select contact to Assign<img src="assets/img/arrow_drop_down.png" ></div>
        <div class="contactListe" id="contact" style="display:none;width: calc(100% - 80px);;position:absolute;bottom:95px"></div>
        <div id="assignedContact" style="position:unset" onclick=""></div>
        subtasks
        <div class="subtasks"><input id="subtaskInput" type="text" placeholder="Add new subtask" onclick="showIcons()" oninput="togglePlusIcon()" >
            <span class="plus-icon updateIcons" onclick="showIcons()"><img src="assets/img/plus.png" ></span>
            <span class="save-icon updateIcons" onclick="addSubtask()"><img style="filter: brightness(0.5);" src="assets/img/check.png"></span> 
            <span class="delete-icon updateIcons" onclick="deleteTask()"><img src="assets/img/close.png">|</span>
            <ul id="newsubtasks">${generateSubtaskListe(`${i}`)}</ul></div>
            
            <button type="button" class="editBtn" onclick="updateTask(${i})">Ok <img src="assets/img/check.png"></button>`;
    getTaskInfo(i);
}
