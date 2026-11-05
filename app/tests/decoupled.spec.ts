import {test,expect,type Page} from '@playwright/test';

const api='http://127.0.0.1:3101/api';
const key=`talento_sf_session_v2:${api}`;
const password='Demo-decoupled-passphrase-2026';
async function register(page:Page,suffix:string) {
  await page.goto('/');
  await page.getByRole('group').getByRole('button',{name:'English',exact:true}).click();
  await page.getByRole('button',{name:'Create account',exact:true}).click();
  await page.getByLabel('Made-up username').fill(`cross-${suffix}-${Date.now()}`);
  await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Create account',exact:true}).click();
  await expect(page.getByRole('heading',{name:'My students'})).toBeVisible();
}

test('direct cross-site API works without cookies; reload restores the tab and logout revokes duplicated sessions',async({page,context})=>{
  const requests:{url:string;headers:Record<string,string>}[]=[];
  const captures:Promise<void>[]=[];
  page.on('request',request=>{
    if(request.url().startsWith(api))captures.push(request.allHeaders().then(headers=>{requests.push({url:request.url(),headers});}));
  });
  await register(page,'transport');
  const stored=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)!),key);
  expect(stored.token).toMatch(/^[a-f0-9]{64}$/);
  expect(Object.keys(stored).sort()).toEqual(['expiresAt','token']);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(()=>Object.keys(localStorage))).toEqual(['talento_sf_lang_v1']);
  const response=await page.request.get(`${api}/auth/me`,{headers:{Authorization:`Bearer ${stored.token}`}});
  expect(response.status()).toBe(200);
  expect(response.headers()['set-cookie']).toBeUndefined();
  expect((await response.json()).token).toBeUndefined();
  await page.reload();await expect(page.getByRole('heading',{name:'My students'})).toBeVisible();
  await page.getByRole('button',{name:'Add student',exact:true}).click();
  await page.getByLabel('Pseudonym (never a real name)').fill('Cross-site Fox');
  await page.getByRole('button',{name:'Save',exact:true}).click();
  const popup=page.waitForEvent('popup');await page.evaluate(()=>window.open('/', '_blank'));const duplicate=await popup;
  await expect(duplicate.getByRole('heading',{name:'My students'})).toBeVisible();
  await page.getByRole('button',{name:'Start playing',exact:true}).click();
  await expect(duplicate.getByRole('button',{name:'Back to Teacher Profile'})).toBeVisible();
  await duplicate.reload();await expect(duplicate.getByRole('button',{name:'Back to Teacher Profile'})).toBeVisible();
  await page.getByRole('button',{name:'Back to Teacher Profile'}).click();
  await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByRole('dialog').getByRole('button',{name:'Back to Teacher Profile'}).click();
  await expect(page.getByRole('heading',{name:'My students'})).toBeVisible();
  await expect(duplicate.getByRole('heading',{name:'My students'})).toBeVisible();
  await page.getByRole('button',{name:'Sign out'}).click();
  await expect(page.getByRole('heading',{name:'Sign in'})).toBeVisible();
  await expect(duplicate.getByRole('heading',{name:'Sign in'})).toBeVisible();
  expect(await duplicate.evaluate(key=>sessionStorage.getItem(key),key)).toBeNull();
  const revoked=await page.request.get(`${api}/auth/me`,{headers:{Authorization:`Bearer ${stored.token}`}});
  expect(revoked.status()).toBe(401);
  await duplicate.close();
  await Promise.all(captures);
  expect(requests.some(request=>request.url.endsWith('/students')&&request.headers.authorization?.startsWith('Bearer '))).toBe(true);
  for(const request of requests) {
    expect(request.headers.cookie).toBeUndefined();
    expect(request.headers['x-csrf-token']).toBeUndefined();
    expect(request.headers.origin).toBe('http://localhost:3100');
  }
});

test('client expiry requires login; a denied browser origin cannot read the API',async({page,context})=>{
  await register(page,'expiry');
  await page.evaluate(key=>{
    const credential=JSON.parse(sessionStorage.getItem(key)!);
    credential.expiresAt=Date.now()-1;sessionStorage.setItem(key,JSON.stringify(credential));
  },key);
  await page.reload();await expect(page.getByRole('heading',{name:'Sign in'})).toBeVisible();
  expect(await page.evaluate(key=>sessionStorage.getItem(key),key)).toBeNull();
  const denied=await context.newPage();
  await denied.goto('http://127.0.0.1:3100');
  const readable=await denied.evaluate(async api=>{
    try { await fetch(api+'/health',{credentials:'omit'});return true; }catch{return false;}
  },api);
  expect(readable).toBe(false);
  const deniedResponse=await page.request.fetch(`${api}/students`,{method:'OPTIONS',headers:{Origin:'https://evil.example','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'}});
  expect(deniedResponse.status()).toBe(403);
  expect(deniedResponse.headers()['access-control-allow-origin']).toBeUndefined();
  await denied.close();
});
