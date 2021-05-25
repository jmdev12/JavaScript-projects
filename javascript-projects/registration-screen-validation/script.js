const inputs = document.querySelectorAll(".input-container");
const emailContainer = document.querySelector('.email-container');
const passwordContainer = document.querySelector('.password-container');
const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[name="password"]');
const passError = document.querySelector('.password-error');
const emailError = document.querySelector('.email-error');
const symbols = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
let chars = [];
let conditions = {
    hasNumber: false,
    hasSmallLetter: false,
    hasBigLetter: false,
    hasSymbol: false
}
let passValidated = false;
let emailValidated = false;



document.addEventListener("DOMContentLoaded", () => {
    // Manage floating label
    inputs.forEach(container => {
        const input = container.querySelector("input");
        const label = container.querySelector('label');

        // Float label if inputs are filled
        floatLabel(input, label, container);

        input.addEventListener("focus", () => {
            container.classList.add('active');
        });
        input.addEventListener("blur", () => {
            floatLabel(input, label, container);
        });
    });
})


function floatLabel(input, label, container) {
    if (input.value != '') {
        label.classList.add("active");
    }
    if (input.value == '') {
        label.classList.remove("active");
    }
    container.classList.remove('active');
}

function validatePassword() {

    var currentValidated = false;

    // Reset conditions
    conditions.hasSymbol = false;
    conditions.hasBigLetter = false;
    conditions.hasSmallLetter = false;
    conditions.hasNumber = false;

    // Get the input value 
    chars = Array.from(password.value);

    // Check if password is 6 characters or longer
    if (chars.length == 0) {
        passwordContainer.classList.remove('error');
        passError.innerHTML = '';
        return;
    }
    if (chars.length < 6) {
        currentValidated = false;
        passError.innerHTML = '<p>Password must be 6 characters or longer</p>';
    } else {

        // Reset password error container
        passError.innerHTML = '';

        // Check if password meets the conditions
        chars.forEach(char => {
            if (char >= 0 && 9 >= char) {
                conditions.hasNumber = true;
            }
            else if (symbols.test(char)) {
                conditions.hasSymbol = true;
            }
            else {
                if (char == char.toUpperCase()) {
                    conditions.hasBigLetter = true;
                }
                if (char == char.toLowerCase()) {
                    conditions.hasSmallLetter = true;
                }
            }


        });
        if (conditions.hasBigLetter == true && conditions.hasSmallLetter == true && conditions.hasSymbol == true && conditions.hasNumber == true) {
            passError.innerHTML = '';
            currentValidated = true;
            passValidated = true;
            passwordContainer.classList.remove('error');
            passError.innerHTML = ''
        }

    }
    if (currentValidated == false) {
        passwordContainer.classList.add('error');
        passError.innerHTML = '<p>Password must contain symbol, number, <br>big and small letter</p>';
    }
}


function emailValidate() {

    let emailChars = email.value;
    if (emailChars.length == 0) {
        emailContainer.classList.remove("error");
        emailError.innerHTML = '';
        return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailChars)) {
        emailContainer.classList.remove("error");
        emailError.innerHTML = '';
        return false;
    } else {
        emailContainer.classList.add("error");
        emailError.innerHTML = '<p>Please insert a valid email address</p>';
        return true;
    }
}

function formValidated() {
    if (passValidated == false || emailValidate()) {
        event.preventDefault();
        return false;
    }
    alert("Form valid!");
    return true;
}


password.addEventListener('blur', validatePassword);
email.addEventListener('blur', emailValidate);