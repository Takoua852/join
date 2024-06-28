function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    document.getElementById(ev.target.id).style.transform = 'rotate(5deg)';
    checkTasks();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target;
    var parentColumn = target.closest('.col');
    if (parentColumn) {
        parentColumn.appendChild(document.getElementById(data));
        var columnId = parentColumn.id;
        var cardId = data.substring(4);
        var card = document.getElementById(data);
        card.dataset.status = columnId;
        var taskId = parseInt(cardId);
        tasks[taskId].status = columnId;
        updateTaskStatus(taskId, columnId);
    }
    document.getElementById(data).style.transform = 'rotate(0deg)';
    checkTasks();
}

async function updateTaskStatus(i, newStatus) {
    tasks[i].status = newStatus;
    await setItem('tasks', JSON.stringify(tasks));
}
