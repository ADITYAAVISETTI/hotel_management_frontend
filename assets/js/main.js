const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass),
    iconEye = document.getElementById(loginEye);

  iconEye.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";

      iconEye.classList.add("ri-eye-line");
      iconEye.classList.remove("ri-eye-off-line");
    } else {
      input.type = "password";

      iconEye.classList.remove("ri-eye-line");
      iconEye.classList.add("ri-eye-off-line");
    }
  });
};



const showHiddenPas= (registerPass, registerEye) => {
  const input = document.getElementById(registerPass),
        iconEye = document.getElementById(registerEye);

  iconEye.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";

      iconEye.classList.add("ri-eye-line");
      iconEye.classList.remove("ri-eye-off-line");
    } else {
      input.type = "password";

      iconEye.classList.remove("ri-eye-line");
      iconEye.classList.add("ri-eye-off-line");
    }
  });
};

// Call the function with the appropriate IDs for registration section
showHiddenPass("register-pass", "register-eye");
showHiddenPas("login-pass", "login-eye");

const start = document.getElementById("welcome-section")
const login = document.getElementById("loginAct");
const register = document.getElementById("registerAct");

const displayLogin = ()=>{
  start.style.display="none";
  login.style.display="flex";
  register.style.display="none";
}
const displayReg = () =>{
  start.style.display="none";
  login.style.display="none";
  register.style.display="flex";
}

var vemail = /^[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,}$/;
var vname = /^[a-zA-Z\s]{1,20}$/           
var vpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$#!_]).{6,20}$/;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("loginAct");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pass").value;
    const isAdminCheckbox = document.getElementById('login-check');

    const role = isAdminCheckbox.checked ? 'admin' : 'user';
    console.log(role);

    if (!vemail.test(email)) {
      window.alert('Enter correct email format \n\n EXAMPLE : example@mail.com');
      return; // Added return statement to exit the function
    }

    if (!vpass.test(password)) {
      window.alert('Password must contain:\n At least one Uppercase,\n At least one LowerCase,\n At least one Number, \n At least one Symbol from(@,$,#,!,_),\n length Must be between 6-20 characters.');
      return; // Added return statement to exit the function
    }
    console.log(role);
    try {
      const response = await fetch('http://127.0.0.1:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        console.log("error");
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json(); // Parse JSON response

      console.log(responseData);
      
      const { token, username } = responseData;

      if (response.status !== 400) {
        localStorage.setItem('auth-token', token);
        localStorage.setItem('username', username);

        const name = localStorage.getItem(username);
        console.log(name);

        const userRole = role;

        if (userRole === 'admin') {
          window.location.href = "../admin.html?name=" + encodeURIComponent(name);
        } else {
          window.location.href = "../user.html?name=" + encodeURIComponent(name);
        }
      } else {
        window.alert("Login with correct Credentials");
      }
    } catch (error) {
      // Handle specific errors
      if (error instanceof TypeError) {
        window.alert("Network error. Please check your internet connection.");
      } else {
        window.alert("Error during login: " + error.message);
      }
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerAct');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-pass').value;
    // const isAdminCheckbox = document.getElementById('register-is-admin'); // Assuming the checkbox ID is 'login-check'

    const role = 'user'; // Check if the checkbox is checked

    if (!vname.test(name)) {
      window.alert('Name must contain Alphabets, Spaces, and length must be less than or equal to 20');
    } else if (!vemail.test(email)) {
      window.alert('Enter correct email format, e.g., example@mail.com');
    } else if (!vpass.test(password)) {
      window.alert('Password must contain:\nAt least one Uppercase,\nAt least one Lowercase,\nAt least one Number,\nAt least one Symbol from (@,$,#,!,_),\nLength must be between 6-20 characters.');
    } else {
      // console.log(role);

      fetch('http://127.0.0.1:3000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password,role}),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          window.alert('Registration Successful!');
          displayLogin();
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
  });
});
