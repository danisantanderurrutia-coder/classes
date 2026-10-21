import { test, expect } from '@playwright/test';

test('verify physicist skins, pause button & modal, and victory screen', async ({ page }) => {
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));

  await page.goto('http://localhost:5173/phi-fighter/index.html');
  await page.waitForLoadState('networkidle');

  // 1. Verify all physicist buttons exist in the Pilot Dossier
  const einsteinBtn = page.locator('#species-selector-group [data-species="einstein"]');
  const curieBtn = page.locator('#species-selector-group [data-species="curie"]');
  const newtonBtn = page.locator('#species-selector-group [data-species="newton"]');
  const schrodingerBtn = page.locator('#species-selector-group [data-species="schrodinger"]');

  await expect(einsteinBtn).toBeVisible();
  await expect(curieBtn).toBeVisible();
  await expect(newtonBtn).toBeVisible();
  await expect(schrodingerBtn).toBeVisible();

  // 2. Click Einstein and verify avatar canvas & defaults
  await einsteinBtn.click();
  await page.waitForTimeout(100);
  let pilotName = await page.locator('#pilot-name-input').inputValue();
  console.log('Pilot name after Einstein click:', pilotName);
  expect(pilotName).toBe('Albert Einstein');
  let speciesBadge = await page.locator('#avatar-species-badge').innerText();
  expect(speciesBadge).toBe('EINSTEIN');

  // Take screenshot of Einstein dossier
  await page.screenshot({ path: '/Users/danielsantander/.gemini/antigravity/brain/67cda7d0-28d0-433c-a9d0-5ef3da36051a/dossier_einstein.png' });

  // 3. Click Marie Curie
  await curieBtn.click();
  await page.waitForTimeout(100);
  pilotName = await page.locator('#pilot-name-input').inputValue();
  console.log('Pilot name after Curie click:', pilotName);
  expect(pilotName).toBe('Marie Curie');

  // 4. Click Newton
  await newtonBtn.click();
  await page.waitForTimeout(100);
  pilotName = await page.locator('#pilot-name-input').inputValue();
  console.log('Pilot name after Newton click:', pilotName);
  expect(pilotName).toBe('Isaac Newton');

  // 5. Click Schrödinger's Cat
  await schrodingerBtn.click();
  await page.waitForTimeout(100);
  pilotName = await page.locator('#pilot-name-input').inputValue();
  console.log('Pilot name after Schrodinger click:', pilotName);
  expect(pilotName).toBe('Schrödinger');

  // Take screenshot of Schrödinger's Cat dossier
  await page.screenshot({ path: '/Users/danielsantander/.gemini/antigravity/brain/67cda7d0-28d0-433c-a9d0-5ef3da36051a/dossier_schrodinger.png' });

  // 6. Launch Game with Schrödinger Cat
  await page.locator('#btn-launch-mission').click();
  await page.waitForTimeout(800);

  // 7. Test Pause Button & Modal
  const pauseBtn = page.locator('#btn-pause-game');
  await expect(pauseBtn).toBeVisible();
  await pauseBtn.click();
  await page.waitForTimeout(200);

  const pauseModal = page.locator('#pause-modal');
  await expect(pauseModal).toBeVisible();
  const pauseScore = await page.locator('#pause-score-stat').innerText();
  console.log('Pause score stat:', pauseScore);

  await page.screenshot({ path: '/Users/danielsantander/.gemini/antigravity/brain/67cda7d0-28d0-433c-a9d0-5ef3da36051a/game_paused_modal.png' });

  // Resume with Resume button
  await page.locator('#btn-resume-game').click();
  await page.waitForTimeout(200);
  await expect(pauseModal).not.toBeVisible();

  // Test Pause with 'P' key
  await page.keyboard.press('p');
  await page.waitForTimeout(200);
  await expect(pauseModal).toBeVisible();

  // Resume with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(pauseModal).not.toBeVisible();

  // 8. Test Campaign Victory Screen with 5 Stars and Skin Showcase
  await page.evaluate(() => {
    window.currentSectorIdx = 9; // Final Singularity sector
    window.score = 64200;
    window.completeSlingshotEscape();
  });
  await page.waitForTimeout(300);

  const victoryModal = page.locator('#sector-cleared-modal');
  await expect(victoryModal).toBeVisible();

  const victoryTitle = await page.locator('#cleared-headline').innerText();
  console.log('Victory Title:', victoryTitle);
  expect(victoryTitle).toContain('YOU WON');

  const starRatingBox = page.locator('#victory-rating-box');
  await expect(starRatingBox).toBeVisible();
  const starsText = await page.locator('#victory-star-display').innerText();
  console.log('Stars display:', starsText);
  expect(starsText).toContain('⭐');

  const rankText = await page.locator('#victory-rating-rank').innerText();
  console.log('Rank text:', rankText);
  expect(rankText).toContain('5/5 STARS');

  const showcaseBox = page.locator('#victory-showcase-box');
  await expect(showcaseBox).toBeVisible();
  const showcasePilot = await page.locator('#victory-pilot-name').innerText();
  console.log('Showcase Pilot Name:', showcasePilot);
  expect(showcasePilot).toBe('SCHRÖDINGER');

  await page.screenshot({ path: '/Users/danielsantander/.gemini/antigravity/brain/67cda7d0-28d0-433c-a9d0-5ef3da36051a/campaign_victory_showcase.png' });
});
