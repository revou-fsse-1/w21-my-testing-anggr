import { chromium, Browser, Page } from 'playwright';
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5173/login'); 
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('should log in successfully with valid credentials', async () => {
    const emailInputSelector = '#email';
    const passwordInputSelector = '#password';
    
  
    await page.waitForSelector(emailInputSelector, { timeout: 60000 });  
    
   
    await page.fill(emailInputSelector, 'superman@mail.com');
    await page.fill(passwordInputSelector, 'supermansuperman');

    
    await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]'),
    ]);

    expect(page.url()).toBe("http://localhost:5173/"); 
  });
});
