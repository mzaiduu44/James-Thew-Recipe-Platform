async function testDetails() {
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

  // 1. Inspect all existing recipes' imagePaths
  console.log('--- RECIPES IN DB ---');
  const recRes = await fetch('http://jamesthewrecipe.runasp.net/api/Recipe', { headers: authHeaders });
  const recipes = await recRes.json();
  recipes.forEach(r => {
    console.log(`ID: ${r.id} | Title: ${r.title} | CategoryId: ${r.categoryId} (${r.categoryName}) | actionType: ${r.actionType} | imagePaths: ${JSON.stringify(r.imagePaths)}`);
  });

  // 2. Inspect all existing subscriptions in DB
  console.log('\n--- SUBSCRIPTIONS IN DB ---');
  const subRes = await fetch('http://jamesthewrecipe.runasp.net/api/Subscription', { headers: authHeaders });
  const subs = await subRes.json();
  subs.forEach(s => {
    console.log(`ID: ${s.id} | userId: ${s.userId} | planType: ${s.planType} | amount: ${s.amount} | status: ${s.status}`);
  });

  // 3. Test Subscription amounts for Weekly, Monthly, Yearly
  console.log('\n--- TESTING SUBSCRIPTION PLAN VALIDATIONS ---');
  const plans = [
    { planType: 'Weekly', amount: 10 },
    { planType: 'Weekly', amount: 20 },
    { planType: 'Weekly', amount: 25 },
    { planType: 'Monthly', amount: 50 },
    { planType: 'Monthly', amount: 100 },
    { planType: 'Yearly', amount: 100 },
    { planType: 'Yearly', amount: 1000 },
  ];

  // Test with user 8 or 9 or 10 or 11
  const yahyaLogin = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nawaz@gmail.com', password: 'nawaz1234' })
  });
  const nawazToken = (await yahyaLogin.text()).replace(/^"|"$/g, '').trim();

  for (const p of plans) {
    const res = await fetch('http://jamesthewrecipe.runasp.net/api/Subscription', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + nawazToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 9,
        planType: p.planType,
        amount: p.amount
      })
    });
    console.log(`Plan: ${p.planType} with amount ${p.amount} -> Status: ${res.status} | Body: ${await res.text()}`);
    if (res.status === 200) break; // succeeded
  }

  // 4. Test where media is served or if there is a static file route
  console.log('\n--- TESTING STATIC FILE LOCATIONS ---');
  // Check if garlic.jpg or smoked-paprika.jpg can be retrieved
  const testFiles = ['garlic.jpg', 'smoked-paprika.jpg', 'rehan.png'];
  const prefixes = [
    '',
    '/images/',
    '/Images/',
    '/img/',
    '/uploads/',
    '/Uploads/',
    '/media/',
    '/Media/',
    '/assets/',
    '/files/',
    '/StaticFiles/',
    '/wwwroot/'
  ];
  for (const f of testFiles) {
    for (const p of prefixes) {
      const u = `http://jamesthewrecipe.runasp.net${p}${f}`;
      try {
        const r = await fetch(u);
        if (r.status !== 404) {
          console.log(`FOUND: ${u} -> Status: ${r.status}`);
        }
      } catch {}
    }
  }
}

testDetails();
