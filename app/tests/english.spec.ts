import {test,expect,type Page} from '@playwright/test';
const password='Demo-passphrase-2026';
async function register(page:Page, suffix:string){
 await page.goto('/');await page.getByLabel('Idioma',{exact:true}).selectOption('en');
 await expect(page.getByRole('heading',{name:'Sign in'})).toBeVisible();
 await page.getByRole('button',{name:'Create account',exact:true}).click();
 await page.getByLabel('Made-up username').fill('demo-'+suffix+'-'+Date.now());
 await page.getByLabel('Password',{exact:true}).fill(password);
 await page.getByRole('button',{name:'Create account',exact:true}).click();
 await expect(page.getByRole('heading',{name:'My students'})).toBeVisible();
}
async function add(page:Page,alias:string){
 await page.getByRole('button',{name:'Add student',exact:true}).click();
 await page.getByLabel('Pseudonym (never a real name)').fill(alias);
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await expect(page.getByRole('heading',{name:'🦊 '+alias})).toBeVisible();
}
test('login first, full student CRUD, child/professional separation, persistence and export',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Iniciar sesión'})).toBeVisible();await page.screenshot({path:'test-results/login.png'});
 await register(page,'crud');await add(page,'Fox Alpha');await page.screenshot({path:'test-results/professional.png'});
 await page.getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Pseudonym (never a real name)').fill('Fox Beta');await page.getByRole('button',{name:'Save',exact:true}).click();await expect(page.getByRole('heading',{name:'🦊 Fox Beta'})).toBeVisible();
 await page.getByRole('button',{name:'Start playing',exact:true}).click();
 await expect(page.getByRole('button',{name:'Back to adult'})).toBeVisible();
 await expect(page.getByRole('button',{name:'My students',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Results',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Family summary',exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole('button',{name:'Back to adult'})).toBeVisible();await page.screenshot({path:'test-results/child.png'});
 await page.getByRole('button',{name:/What Do You Invent/}).filter({hasText:'Play now'}).click();
 await page.getByRole('button',{name:/Flying or space vehicle/}).click();
 await page.getByRole('button',{name:'Save my invention'}).click();
 // The badge modal is purely a game celebration, not a professional navigation.
 const badge=page.getByRole('button',{name:"Great! Let's keep playing!"});if(await badge.isVisible())await badge.click();
 await expect(page.getByRole('status')).toContainText('Saved');
 await page.getByRole('button',{name:'Back to adult'}).click();
 await page.getByLabel('Password',{exact:true}).fill('incorrect-password');await page.getByRole('dialog').getByRole('button',{name:'Back to adult'}).click();
 await expect(page.getByRole('alert')).toContainText('Incorrect username or password');
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('dialog').getByRole('button',{name:'Back to adult'}).click();
 await expect(page.getByRole('heading',{name:'My students'})).toBeVisible();
 await page.getByRole('article').getByRole('button',{name:'Results',exact:true}).click();
 await expect(page.getByRole('heading',{name:'What Do You Invent?',exact:true})).toBeVisible();
 await expect(page.locator('main')).toContainText('1');
 const download=page.waitForEvent('download');await page.getByTitle('Download a formatted report for printing').click();expect((await download).suggestedFilename()).toContain('Professional_Report');
 await page.getByPlaceholder('Add educator qualitative observations...').fill('Example observation from play.');await page.getByRole('button',{name:'Save and Confirm Review'}).click();
 await expect(page.getByRole('button',{name:'Review Saved!'})).toBeVisible();
 await page.reload();await page.getByRole('article').getByRole('button',{name:'Results',exact:true}).click();await expect(page.getByPlaceholder('Add educator qualitative observations...')).toHaveValue('Example observation from play.');
 await page.getByRole('button',{name:'My students',exact:true}).click();
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Delete',exact:true}).click();await expect(page.getByText('No students yet. Create your first student to begin.')).toBeVisible();
 await page.getByRole('button',{name:'Sign out'}).click();await expect(page.getByRole('heading',{name:'Sign in'})).toBeVisible();
 expect(errors).toEqual([]);
});
test('two accounts, synchronized child lock in another tab, all five login languages',async({page,browser})=>{
 await register(page,'isolate');await add(page,'Private Fox');
 const other=await page.context().newPage();await other.goto('/');await expect(other.getByRole('heading',{name:'My students'})).toBeVisible();
 await page.getByRole('button',{name:'Start playing'}).click();await expect(other.getByRole('button',{name:'Back to adult'})).toBeVisible();await expect(other.getByRole('button',{name:'My students',exact:true})).toHaveCount(0);
 await other.close();
 const context=await browser.newContext();const second=await context.newPage();await register(second,'second');await expect(second.getByText('Private Fox')).toHaveCount(0);await second.getByRole('button',{name:'Sign out'}).click();
 for(const lang of ['es','en','fr','ar','uk']){await second.locator('select').selectOption(lang);await expect(second.locator('html')).toHaveAttribute('lang',lang);await expect(second.locator('input[autocomplete=username]')).toHaveCount(1);await expect(second.locator('input[type=password]')).toHaveCount(1);await expect(second.locator('html')).toHaveAttribute('dir',lang==='ar'?'rtl':'ltr');}
 await expect(second.locator('html')).toHaveAttribute('dir','ltr');await context.close();
});

test('failed and conflicting saves never claim success or unlock the child view',async({page})=>{
 await register(page,'failure');await add(page,'Retry Fox');await page.getByRole('button',{name:'Start playing'}).click();
 await page.route('**/api/students/*/progress',route=>route.abort());
 await page.getByRole('button',{name:'Open Worlds Map'}).click();await page.getByRole('button',{name:/Building World/}).click();
 await expect(page.getByRole('status')).toContainText('Unsaved changes');await expect(page.getByRole('alert')).toBeVisible();
 await page.getByRole('button',{name:'Back to adult'}).click();await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('dialog').getByRole('button',{name:'Back to adult'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.unroute('**/api/students/*/progress');await page.getByRole('button',{name:'Retry',exact:true}).click();await expect(page.getByRole('status')).toContainText('Saved');
 await page.route('**/api/students/*/progress',route=>route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({error:'VERSION_CONFLICT'})}));
 await page.getByRole('button',{name:'Back to Worlds',exact:true}).click();await page.getByRole('button',{name:/Exploring World/}).click();
 await expect(page.getByRole('alert')).toContainText('There are newer changes');await expect(page.getByRole('button',{name:'Retry',exact:true})).toBeDisabled();
 page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Load server state'}).click();await expect(page.getByRole('button',{name:'Back to adult'})).toBeVisible();await expect(page.getByRole('status')).toContainText('Saved');
 await expect(page.getByRole('button',{name:'Results',exact:true})).toHaveCount(0);
});
