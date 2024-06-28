function showSignupForm() {
    document.getElementById('loginHeader').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
    document.getElementById('signupForm').style.display = 'flex';
    document.getElementById('login-container').style.display = 'none';
}

function hideSignupForm() {
    document.getElementById('loginHeader').style.display = 'flex';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function register() {
    clearInput();
}

function clearInput() {
    document.getElementById('username').value = '';
    document.getElementById('useremail').value = '';
    document.getElementById('userpassword').value = '';
    document.getElementById('userconfirmpass').value = '';
}

async function openPolicy() {
    IncludeTemplate();
    let policy = await fetch('assets/templates/privacy_policy.html');
    let resppolicy = await policy.text();
    document.getElementById('desk-container').style.display = 'block';
    document.getElementById('rechtliches-container').style.display = 'block';
    document.getElementById('rechtliches-container').innerHTML = resppolicy;
    hideIndexElements();
}

async function openNotice() {
    IncludeTemplate();
    let notice = await fetch('assets/templates/legal_notice.html');
    let respnotice = await notice.text();
    document.getElementById('desk-container').style.display = 'block';
    document.getElementById('rechtliches-container').style.display = 'block';
    document.getElementById('rechtliches-container').innerHTML = respnotice;
    hideIndexElements();
}

function goBack() {
    showIndexElements();
    document.getElementById('desk-container').style.display = 'none';
    document.getElementById('rechtliches-container').style.display = 'none';
}

async function IncludeTemplate() {
    let deskresp = await fetch('./assets/templates/desktop_template.html');
    let deskcontent = await deskresp.text();
    let deskContainer = document.getElementById('desk-container');
    deskContainer.innerHTML = deskcontent;
    manipulateTemplate();
}

function hideIndexElements() {
    document.getElementById('loadImage').style.display = 'none';
    document.getElementById('loginHeader').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('footer-links').style.display = 'none';
}

function showIndexElements() {
    document.getElementById('loadImage').style.display = 'block';
    document.getElementById('loginHeader').style.display = 'flex';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('footer-links').style.display = 'flex';
}

function manipulateTemplate() {
    let smoothLinks = document.querySelectorAll('.smooth-link');
    smoothLinks.forEach(link => {
        link.style.display = 'none';
    });
    document.getElementById('deskTitle').style.display = 'none';
    document.querySelector('.desk-nav').style.display = 'none';
    document.getElementById('rechtliches').style.display = 'none';
    document.getElementById('loginHeader').style.display = 'flex';

}



