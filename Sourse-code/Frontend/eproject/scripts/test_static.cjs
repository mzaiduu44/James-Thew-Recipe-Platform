async function checkStatic() {
  const f = 'f9f3e6fe-1223-4c31-9221-369b673aea86_Screenshot (35).png';
  const encodedF = encodeURIComponent(f);
  const paths = [
    `/${f}`,
    `/${encodedF}`,
    `/images/${f}`,
    `/images/${encodedF}`,
    `/Images/${f}`,
    `/Images/${encodedF}`,
    `/uploads/${f}`,
    `/uploads/${encodedF}`,
    `/Uploads/${f}`,
    `/Uploads/${encodedF}`,
    `/media/${f}`,
    `/media/${encodedF}`,
    `/Media/${f}`,
    `/Media/${encodedF}`,
    `/Resources/${f}`,
    `/Resources/${encodedF}`,
    `/StaticFiles/${f}`,
    `/wwwroot/${f}`,
    `/api/Media/download/${f}`,
    `/api/Media/${f}`
  ];

  for (const p of paths) {
    try {
      const res = await fetch('http://jamesthewrecipe.runasp.net' + p);
      console.log(`Path: ${p} -> Status: ${res.status}`);
      if (res.status === 200) {
        console.log('FOUND IT AT:', p);
        break;
      }
    } catch (e) {
      console.log(`Err on ${p}:`, e.message);
    }
  }
}

checkStatic();
