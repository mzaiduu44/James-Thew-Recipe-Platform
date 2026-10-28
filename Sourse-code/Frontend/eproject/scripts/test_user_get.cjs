async function testUserUpdate() {
  const yahyaLogin = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'akelabanda77442200@gmail.com', password: '12345678' })
  });
  let token = (await yahyaLogin.text()).replace(/"/g, '').trim();

  const updateRes = await fetch('http://jamesthewrecipe.runasp.net/api/User/7', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: 7,
      name: 'yahya updated',
      email: 'akelabanda77442200@gmail.com',
      password: '12345678',
      profileImage: 'test-avatar.jpg'
    })
  });
  console.log('Update status:', updateRes.status);
  console.log('Update response:', await updateRes.text());

  await fetch('http://jamesthewrecipe.runasp.net/api/User/7', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: 7,
      name: 'yahya',
      email: 'akelabanda77442200@gmail.com',
      password: '12345678',
      profileImage: 'test-avatar.jpg'
    })
  });
}

testUserUpdate();
