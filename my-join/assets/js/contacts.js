let addContactFormOpen = false;
let editContactFormOpen = false;

async function initContacts() {
    await loadContacts();
}

function addContact() {
    console.log("Adding contact...");
    clearInputField();
    if(overlayEditContact){
        overlayEditContact.classList.remove('active'); 
        overlayEditContact.style.display = 'none'
    }
    overlayAddContact.classList.add('active');
    overlayAddContact.style.display = 'flex'
    addContactBtn.disabled = true;
}

function closeAddContact() {
    console.log("Closing add contact...");
    clearInputField();
    overlayAddContact.classList.remove('active');
    overlayAddContact.style.display = 'none'
    addContactBtn.disabled = false;
}

async function createContact() {
    contacts.push({
        name: username.value,
        email: mail.value,
        phone: tel.value,
        color: getRandomColor()
    })
    await setItem('contacts', JSON.stringify(contacts));
    showInfoFloating('Contact succesfully created');
    loadContacts();
    closeAddContact();
}

function clearInputField() {
    document.getElementById('username').value = '';
    document.getElementById('mail').value = '';
    document.getElementById('tel').value = '';
}

async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        const groupedContacts = groupContacts(contacts);
        let htmlContent = document.getElementById('liste');
        htmlContent = '';
        for (const letter in groupedContacts) {
            const contactsGroup = groupedContacts[letter];
            htmlContent += `<div class="groupTitle" data-group="${letter}"><span>${letter}</span></div>`;
            contactsGroup.forEach((contact) => {

                const contactIndex = contacts.indexOf(contact);
                const htmlTemplate = contactsHtmlTemplate(contactIndex);
                htmlContent += htmlTemplate;
            });
        }
        document.getElementById('liste').innerHTML = htmlContent;
    } catch (e) {
        console.error(e);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

function groupContacts(contacts) {
    const groupedContacts = {};
    contacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    });
    return groupedContacts;
}

function contactsHtmlTemplate(i) {
    return  /*html*/`     
<div class="line">
    <hr style="background: rgba(209, 209, 209, 1);">
</div>
<div class="contactInfo" id="contact-${i}" 
onclick="openContact(${i},'${contacts[i].name}', '${contacts[i].email}', ${contacts[i].phone}, '${contacts[i].color}')">
    <div class="profilBadge" id="p-badge" style="background-color: ${contacts[i].color}">${getInitials(contacts[i].name)}
    </div>
    <div class="contactName">
        <span>${contacts[i].name}</span>
        <span>${contacts[i].email}</span>
    </div>
</div>`
}

function openContact(i) {
    document.getElementById(`floatingContact`).innerHTML = `${openContactHtmlTemplate(i)}`;
    var allContactElements = document.querySelectorAll('.contactInfo');
    allContactElements.forEach(function (element) {
        element.classList.remove('contact-selected');
    });
    document.getElementById('contact-' + i).classList.add('contact-selected');
    if (window.innerWidth < 940) {
        document.getElementById('contactList').style.display = 'none';
        document.getElementById('floatingContact').style.display = 'block';
        document.querySelector('.titleBox').style.display = 'flex';
    }
}

function backToListe() {
    document.getElementById('contactList').style.display = 'block';
    document.getElementById('floatingContact').style.display = 'none';
    document.querySelector('.titleBox').style.display = 'none'
}

function editContact(i) {
    overlayEditContact.innerHTML = createOverlayEditContact(`${i}`);
    clearInputField();
    overlayEditContact.classList.add('active');
    overlayEditContact.style.display = 'flex';
    document.getElementById(`editname${i}`).value = `${contacts[i].name}`;
    document.getElementById(`editemail${i}`).value = `${contacts[i].email}`;
    document.getElementById(`edittel${i}`).value = `${contacts[i].phone}`;
    document.getElementById(`editBadge${i}`).innerHTML = `${getInitials(contacts[i].name)}`;
    document.getElementById(`editBadge${i}`).style.backgroundColor = `${contacts[i].color}`;
}

function closeEditContact() {
    clearInputField();
    overlayEditContact.classList.remove('active');
}

async function deleteContact(i) {
    if (contacts.length > 5) {
        try {
            contacts.splice(i, 1);
            await setItem('contacts', JSON.stringify(contacts));
            document.getElementById('floatingContact').innerHTML = '';
            loadContacts();
        } catch (e) {
            console.error('Fehler beim Löschen des Kontakts:', e);
        }
    }
    else {
        alert('Cannot delete contact. You must have more than 5 contacts.');
    }
}

function openContactHtmlTemplate(i) {
    return /*html*/ `
        <div class="f-name-badge">
        <div id="floatingBadge" class="floatingBadge" style="background-color:${contacts[i].color}">${getInitials(contacts[i].name)}</div>
        <div> <div class="contactName" style="width:100% !important;">${contacts[i].name}</div>
        <div  class="edit-delete" id="edit-delete">
            <img style="cursor: pointer;" src="assets/img/edit-contact.png" onclick="editContact(${i})">
            <img style="cursor: pointer;" src="assets/img/delete-contact.png" onclick="deleteContact(${i})">
        </div>
        </div>
        </div>
        <div style="width: 207px; height: 74px; display:flex; flex-direction:column; justify-content:center;">Contact Information</div>
        <div style="width:140px;height:128px;display:flex;flex-direction:column;gap:22px;">
        <div style="font-weight:bold;">Email</div>
        <div>${contacts[i].email}</div>
        <div style="font-weight:bold;">Phone</div>
        <div>${contacts[i].phone}</div>
        </div>
        <div class="popupEditdelete" id="popupEdit" onclick="openPopupdeleteEdit(event)">.<br>.<br>.</div>`;
}

function openPopupdeleteEdit(event) {
    event.stopPropagation();
    document.getElementById('edit-delete').style.display = 'flex';
    document.addEventListener('click', closePopupdeleteEdit);
}

function closePopupdeleteEdit(event) {
    const popupContainer = document.getElementById('edit-delete');
    if (!popupContainer.contains(event.target)) {
        popupContainer.style.display = 'none';
        document.removeEventListener('click', closePopupMenu);
    }
}

function overlayDeleteContact(i) {
    deleteContact(i);
    closeEditContact();
}

function createOverlayEditContact(i) {
    return /*html*/ ` 
     <div class="left-seide">        
         <img class="l-logo" src="assets/img/Capa1.png" alt="">
         <div class="edit-title">Edit contact </div>
         <img class="l-line" src="assets/img/verticalLine.png" alt="">
     </div>

     <div class="edit-badge" id="editBadge${i}"></div>

     <form onsubmit="overlaySaveContact(${i}); return false;">
    <div class="inputBox">
        <input type="text" id="editname${i}" required placeholder="Name" class=" input-name">
        <input type="email" id="editemail${i}" required placeholder="Email" class="input-mail">
        <input type="tel" id="edittel${i}" required placeholder="Phone" pattern="[0-9]{12}" class="input-tel">
    </div>
    <div style="display:flex;gap:8px;padding:24px 0;align-items: center;"> 
        <button class="delete"  type="button" onclick="overlayDeleteContact(${i})">Delete</button>
        <button class="save s-icon" type="submit">Save</button>
    </div>
</form>
<img src="assets/img/close.png" class="closeIcon" onclick="closeEditContact(${i})">`
}

function toggleInstructions(i) {
    const instructions = document.getElementById('telInstructions' + i);
    if (input.validity.patternMismatch || input.validity.valueMissing) {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
}
async function overlaySaveContact(i) {
    contacts[i].name = document.getElementById(`editname${i}`).value;
    contacts[i].email = document.getElementById(`editemail${i}`).value;
    contacts[i].phone = document.getElementById(`edittel${i}`).value;
    await setItem('contacts', JSON.stringify(contacts));
    document.getElementById('floatingContact').innerHTML = '';
    loadContacts();
    closeEditContact(i);
}

function showInfoFloating(info) {
    document.getElementById('infoFloating').innerHTML = info;
    document.getElementById('infoFloating').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('infoFloating').style.display = 'none';
    }, 2000);
}


window.addEventListener("orientationchange", function() {
    if (window.orientation === 90 || window.orientation === -90) {
        document.body.style.transform = "rotate(90deg)";
    } else {
        document.body.style.transform = "none";
    }
});