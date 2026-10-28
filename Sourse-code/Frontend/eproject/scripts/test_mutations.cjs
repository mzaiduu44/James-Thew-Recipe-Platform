async function testMutations() {
  const loginRes = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rehan123@gmail.com', password: '1234567' })
  });
  let token = await loginRes.text();
  token = token.replace(/^"|"$/g, '').trim();

  const authHeaders = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  console.log('--- 1. Testing Media Upload (POST /api/Media) ---');
  try {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const fakeImageBuffer = Buffer.from('fake-image-content-bytes');
    const formBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="ImagePath"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
      fakeImageBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const mediaRes = await fetch('http://jamesthewrecipe.runasp.net/api/Media', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formBody
    });
    console.log('Media upload status:', mediaRes.status);
    const mediaText = await mediaRes.text();
    console.log('Media upload response:', mediaText);
  } catch (err) {
    console.error('Media upload error:', err);
  }

  console.log('\n--- 2. Testing Profile Update (PUT /api/User/4) ---');
  try {
    // Let's check UserForUpdation: { id, name, email, password, profileImage }
    const userUpdateBody = {
      id: 4,
      name: 'Rehan Updated',
      email: 'rehan123@gmail.com',
      password: '1234567',
      profileImage: 'rehan.png'
    };
    const userRes = await fetch('http://jamesthewrecipe.runasp.net/api/User/4', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(userUpdateBody)
    });
    console.log('User update status:', userRes.status);
    console.log('User update response:', await userRes.text());
  } catch (err) {
    console.error('User update error:', err);
  }

  console.log('\n--- 3. Testing Recipe Addition (POST /api/Recipe) ---');
  try {
    // RecipeForCreation: { title, description, isFree, procedure, actionType, categoryId, imagePaths }
    // RecipeActionType: "User" | "Member" | "Both"
    const recipeBody = {
      title: 'Test Recipe Handi',
      description: 'Test recipe description',
      isFree: true,
      procedure: 'Step 1: cook it. Step 2: eat it.',
      actionType: 'Both',
      categoryId: 1,
      imagePaths: ['test.jpg']
    };
    const recRes = await fetch('http://jamesthewrecipe.runasp.net/api/Recipe', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(recipeBody)
    });
    console.log('Recipe add status:', recRes.status);
    console.log('Recipe add response:', await recRes.text());
  } catch (err) {
    console.error('Recipe add error:', err);
  }

  console.log('\n--- 4. Testing Contest Submission (POST /api/ContestSubmission) ---');
  try {
    // ContestSubmissionForCreation: { contestId, recipeId, tipId }
    const subBody = {
      contestId: 1,
      recipeId: 2,
      tipId: null
    };
    const subRes = await fetch('http://jamesthewrecipe.runasp.net/api/ContestSubmission', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(subBody)
    });
    console.log('Contest submission status:', subRes.status);
    console.log('Contest submission response:', await subRes.text());
  } catch (err) {
    console.error('Contest submission error:', err);
  }

  console.log('\n--- 5. Testing Subscription Creation / Update ---');
  try {
    // SubscriptionForCreation: { userId, planType, amount }
    // PlanType: "Weekly" | "Monthly" | "Yearly"
    const subCreateBody = {
      userId: 7, // yahya
      planType: 'Monthly',
      amount: 10
    };
    const subRes = await fetch('http://jamesthewrecipe.runasp.net/api/Subscription', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(subCreateBody)
    });
    console.log('Subscription create status:', subRes.status);
    console.log('Subscription create response:', await subRes.text());
  } catch (err) {
    console.error('Subscription error:', err);
  }
}

testMutations();
