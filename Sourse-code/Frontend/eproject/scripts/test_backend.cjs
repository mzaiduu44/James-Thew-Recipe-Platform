const fs = require('fs');

async function test() {
  const loginRes = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rehan123@gmail.com', password: '1234567' })
  });
  let token = await loginRes.text();
  token = token.replace(/^"|"$/g, '').trim();
  console.log('Login token length:', token.length);

  const eps = [
    '/api/User',
    '/api/Contest',
    '/api/Subscription',
    '/api/Recipe',
    '/api/Tip',
    '/api/Category',
    '/api/Ingredient',
    '/api/RecipeIngredient',
    '/api/ContestSubmission',
    '/api/Feedback',
    '/api/SiteFeedback',
    '/api/Announcement',
    '/api/Role',
    '/api/FAQ'
  ];

  for (const ep of eps) {
    const res = await fetch('http://jamesthewrecipe.runasp.net' + ep, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const text = await res.text();
    console.log(ep + ' -> Status: ' + res.status + ' | Length: ' + text.length);
    if (res.status === 200 && text.length > 0) {
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          console.log('   Count:', json.length, 'First item keys:', Object.keys(json[0] || {}));
          if (ep === '/api/User') {
            console.log('   Users:');
            json.forEach(u => console.log('     ID: ' + u.id + ' | Role: ' + u.roleName + ' (' + u.roleId + ') | Name: ' + u.name + ' | Email: ' + u.email + ' | Pwd: ' + u.password));
          }
        }
      } catch (e) {
        console.log('   Non-json or error:', e.message);
      }
    }
  }
}

test();
