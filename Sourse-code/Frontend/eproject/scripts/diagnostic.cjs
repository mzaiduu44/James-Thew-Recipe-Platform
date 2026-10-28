async function run() {
  const loginRes = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rehan123@gmail.com', password: '1234567' })
  });
  let token = (await loginRes.text()).replace(/^"|"$/g, '').trim();

  const authHeaders = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  console.log('--- GET /api/User/4 ---');
  const uRes = await fetch('http://jamesthewrecipe.runasp.net/api/User/4', { headers: authHeaders });
  const uData = await uRes.json();
  console.log('User 4 current:', uData);

  console.log('--- PUT /api/User/4 ---');
  // Try updating with current values
  const updateRes = await fetch('http://jamesthewrecipe.runasp.net/api/User/4', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      id: 4,
      name: uData.name === 'Rehan' ? 'Chef Rehan' : 'Rehan',
      email: uData.email,
      password: uData.password,
      profileImage: uData.profileImage
    })
  });
  console.log('Update status:', updateRes.status);
  console.log('Update text:', await updateRes.text());

  console.log('--- Media test: Where are files served? ---');
  const uploadRes = await fetch('http://jamesthewrecipe.runasp.net/api/Media', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryX'
    },
    body: Buffer.concat([
      Buffer.from('------WebKitFormBoundaryX\r\nContent-Disposition: form-data; name="ImagePath"; filename="avatar.jpg"\r\nContent-Type: image/jpeg\r\n\r\nfakejpg'),
      Buffer.from('\r\n------WebKitFormBoundaryX--\r\n')
    ])
  });
  const uploadJson = await uploadRes.json();
  console.log('Upload result:', uploadJson);
  const fileName = uploadJson.fileName;

  // Let's test accessing this image
  const imgUrls = [
    `http://jamesthewrecipe.runasp.net/${fileName}`,
    `http://jamesthewrecipe.runasp.net/images/${fileName}`,
    `http://jamesthewrecipe.runasp.net/Images/${fileName}`,
    `http://jamesthewrecipe.runasp.net/uploads/${fileName}`,
    `http://jamesthewrecipe.runasp.net/Uploads/${fileName}`,
    `http://jamesthewrecipe.runasp.net/media/${fileName}`,
    `http://jamesthewrecipe.runasp.net/Media/${fileName}`,
    `http://jamesthewrecipe.runasp.net/api/Media/${fileName}`
  ];
  for (const url of imgUrls) {
    const r = await fetch(url);
    console.log(`Fetch ${url} -> Status: ${r.status}`);
  }

  console.log('--- Subscription test with User 7 (non-admin) ---');
  // Login with yahya (user 7)
  const yahyaLogin = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'akelabanda77442200@gmail.com', password: '12345678' })
  });
  const yahyaToken = (await yahyaLogin.text()).replace(/^"|"$/g, '').trim();
  console.log('Yahya token length:', yahyaToken.length);

  // Can Yahya subscribe?
  const yahyaSub = await fetch('http://jamesthewrecipe.runasp.net/api/Subscription', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + yahyaToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 7,
      planType: 'Monthly',
      amount: 10
    })
  });
  console.log('Yahya subscription status:', yahyaSub.status);
  console.log('Yahya subscription response:', await yahyaSub.text());

  // What about Admin creating subscription for Yahya?
  const adminSub = await fetch('http://jamesthewrecipe.runasp.net/api/Subscription', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      userId: 7,
      planType: 'Monthly',
      amount: 10
    })
  });
  console.log('Admin subscription status:', adminSub.status);
  console.log('Admin subscription response:', await adminSub.text());

  // Can Yahya submit contest to Contest 1?
  console.log('--- Contest submission test with Yahya (user 7) ---');
  // First check if Contest 1 has any recipe Yahya owns or recipe 2
  const yahyaContestSub = await fetch('http://jamesthewrecipe.runasp.net/api/ContestSubmission', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + yahyaToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contestId: 1,
      recipeId: 2,
      tipId: null
    })
  });
  console.log('Yahya contest submission status:', yahyaContestSub.status);
  console.log('Yahya contest submission response:', await yahyaContestSub.text());
}

run();
