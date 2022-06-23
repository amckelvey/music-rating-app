const logout = async () => {
  // doing a logout fetch request
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // replace the logout link with login if logged out
    document.location.replace('/login');
  } else {
    alert('Failed to log out');
  }
};

document.querySelector('#logout').addEventListener('click', logout);
