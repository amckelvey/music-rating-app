const loginFormHandler = async (event) => {
  // prevent default behavior of event so form behaves how we want it
  event.preventDefault();

  // set variables for the form fields and trim off the leading or trailing characters with .trim
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // if we receive a valid email and password
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
