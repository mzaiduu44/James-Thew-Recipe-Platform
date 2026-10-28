async function testTipRoles() {
  const users = [
    { name: 'Admin (Rehan)', email: 'rehan123@gmail.com', pass: '1234567' },
    { name: 'Member (Subhan)', email: 'subhan@gmail.com', pass: 'subhan123@' },
    { name: 'User (Yahya)', email: 'akelabanda77442200@gmail.com', pass: '12345678' }
  ];

  for (const u of users) {
    const loginRes = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: u.email, password: u.pass })
    });
    const token = (await loginRes.text()).replace(/"/g, '').trim();

    const tipBody = {
      title: 'Tip by ' + u.name + ' ' + Date.now(),
      description: 'A handy cooking tip',
      isFree: true,
      actionType: 'Both',
      profileImage: ''
    };

    const res = await fetch('http://jamesthewrecipe.runasp.net/api/Tip', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tipBody)
    });
    console.log(`${u.name} -> Status: ${res.status} | Body: ${await res.text()}`);
  }
}

testTipRoles();
