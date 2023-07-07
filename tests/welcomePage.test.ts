import { test, expect } from '@playwright/test';

test.describe('welcome Page', () => {
  test('should display login and view lyrics buttons for guests', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for the Login button.
    const loginButton = page.locator('text="Login"');
    await expect(loginButton).toBeVisible();

    // Check for the View Lyrics button.
    const viewLyricsButton = page.locator('text="View Lyrics"');
    await expect(viewLyricsButton).toBeVisible();
  });

  // This test assumes that there's a user want to logged in.
  test('should display welcome message and logout button for logged-in users', async ({ page }) => {
   await page.goto('http://localhost:3000/login'); // Go to the login page.
 
   // Fill in the login form and submit it.
   await page.fill('input[name="email"]', 'admin@mail.com'); 
   await page.fill('input[name="password"]', 'adminadmin'); 
   await page.click('button[value="login"]');
 
   // Go to the main page.
   await page.goto('http://localhost:3000');
 
   // Check for the welcome message.
   const welcomeMessage = page.locator('text="Hello"');
   await expect(welcomeMessage).toBeVisible();
 
   // Check for the Logout button.
   const logoutButton = page.locator('text="Logout"');
   await expect(logoutButton).toBeVisible();
 });
 
 
});
