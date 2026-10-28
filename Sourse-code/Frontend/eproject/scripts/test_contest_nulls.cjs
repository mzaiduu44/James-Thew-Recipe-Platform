async function testContestSubmissionNulls() {
  // Let's test with User 10 (abc@gmail.com / abc12345)
  const loginRes = await fetch('http://jamesthewrecipe.runasp.net/api/Auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'abc@gmail.com', password: 'abc12345' })
  });
  const token = (await loginRes.text()).replace(/"/g, '').trim();

  const res = await fetch('http://jamesthewrecipe.runasp.net/api/ContestSubmission', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contestId: 1,
      recipeId: null,
      tipId: null
    })
  });
  console.log('Nulls test -> Status:', res.status, 'Body:', await res.text());
}

testContestSubmissionNulls();
