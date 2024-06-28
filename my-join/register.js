let currentUser;

async function init() {
    contacts = JSON.parse(await getItem('contacts'));
    tasks = JSON.parse(await getItem('tasks'));
    users = JSON.parse(await getItem('users'));
}

async function register() {
    subBtn.disabled = true;
    if (userpassword.value === userconfirmpass.value) {
        users.push({
            name: username.value,
            email: useremail.value,
            password: userpassword.value
        });
        subBtn.disabled = false;
        await setItem('users', JSON.stringify(users));
        signupForm.reset();
        hideSignupForm();
       
    } else {
        console.log('passt nicht')
    }
}

function login() {
    let user = users.find(u => u.email === inputemail.value && u.password === inputpassword.value);
    if (user) {
        currentUser = user.name;
        window.location.href = `summary.html?name=${currentUser}`;
        inputemail.value = '';
        inputpassword.value = '';
    }
    else {
        document.getElementById('msgBox').innerHTML = `Ups! Your password and email don't match`;
        inputemail.value = '';
        inputpassword.value = '';
    }
}

function queryString() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        msgBox.innerHTML = msg;
    }
}

function guestLogin() {
    window.location.href = `summary.html?name=G`;
}
