
async function includeHTML() {
    let resp = await fetch('./assets/templates/desktop_template.html');
    if (resp.ok) {
        let desktopTemplateContent = await resp.text();
        document.getElementById('desk-container').innerHTML = desktopTemplateContent;
        getConnectedinitials();
    } else {
        console.error('Desktop template not found');
    }
}

async function includeMobileTemplate() {
    let resp = await fetch('./assets/templates/mobile_template.html');
    if (resp.ok) {
        let mobileTemplateContent = await resp.text();
        document.getElementById('mobile-container').innerHTML = mobileTemplateContent;
        document.getElementById('mobile-container').style.display = 'block';
        document.getElementById('mobile-content').style.display = 'block';
    } else {
        console.error('Mobile template not found');
    }
}

async function openPolicy() {
    let policy = await fetch('assets/templates/privacy_policy.html')
    let resppolicy = await policy.text();
    document.getElementById('desk-content').style.display = 'none'
    document.getElementById('rechtliches-content').style.display = 'block';
    document.getElementById('rechtliches-content').innerHTML = resppolicy;
}

async function openNotice() {
    let notice = await fetch('assets/templates/legal_notice.html')
    let respnotice = await notice.text();
    document.getElementById('desk-content').style.display = 'none';
    document.getElementById('rechtliches-content').style.display = 'block'
    document.getElementById('rechtliches-content').innerHTML = respnotice;
}

async function openHelp() {
    let help = await fetch('assets/templates/help.html')
    let resphelp = await help.text();
    document.getElementById('desk-content').style.display = 'none';
    document.getElementById('rechtliches-content').style.display = 'block'
    document.getElementById('rechtliches-content').innerHTML = resphelp;
}

function goBack() {
    document.getElementById('desk-content').style.display = 'block'
    document.getElementById('rechtliches-content').style.display = 'none';
}


function popupMenu(event) {
    event.stopPropagation();
    document.getElementById('popup-menu').style.display = 'flex';
    document.addEventListener('click', closePopupMenu);
}

function closePopupMenu(event) {
    const popupContainer = document.getElementById('popup-menu');
    if (!popupContainer.contains(event.target)) {
        popupContainer.style.display = 'none';
        document.removeEventListener('click', closePopupMenu);
    }
}

function logOut() {
    window.location.href = 'index.html'
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

function getConnectedinitials() {
    const urlParams = new URLSearchParams(window.location.search);

    const name = urlParams.get('name');
    if (name) {
        document.getElementById('userInitial').innerHTML = getInitials(`${name}`);
    }
    
}

//links

function openSummary() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        window.location.href = `summary.html?name=${name}`;
    }
    else{
        name = 'G'
        window.location.href = `summary.html?name=${name}`;
    }
}

function openAddTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        window.location.href = `addTask.html?name=${name}`;
    }
}

function openBoard() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        window.location.href = `board.html?name=${name}`;
    }
    else{
        name = 'G'
        window.location.href = `board.html?name=${name}`;
    }
}

function openContacts() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    if (name) {
        window.location.href = `contacts.html?name=${name}`;
    }
}