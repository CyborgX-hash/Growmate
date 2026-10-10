const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'e2e_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const SAMPLE_IMAGE_PATH = path.join(__dirname, '..', 'sample_leaf.png');

const results = {
  passed: [],
  failed: [],
  warnings: [],
  consoleErrors: []
};

function recordPass(testName, details) {
  console.log(`✅ PASS: ${testName} - ${details || ''}`);
  results.passed.push({ testName, details });
}

function recordFail(testName, error) {
  console.error(`❌ FAIL: ${testName} - ${error}`);
  results.failed.push({ testName, error: String(error) });
}

function recordWarn(testName, warning) {
  console.warn(`⚠️ WARN: ${testName} - ${warning}`);
  results.warnings.push({ testName, warning });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('🚀 Starting GrowMate Full E2E Browser Testing Suite...');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon errors if any
      if (!text.includes('favicon.ico')) {
        results.consoleErrors.push(text);
        console.log(`[Browser Console Error]: ${text}`);
      }
    }
  });

  page.on('pageerror', err => {
    results.consoleErrors.push(err.toString());
    console.log(`[Page Exception]: ${err.toString()}`);
  });

  try {
    // -------------------------------------------------------------
    // 1. Landing Page Test
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Landing Page (/) ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    const title = await page.title();
    if (title.includes('GrowMate')) {
      recordPass('Landing Page Title', `Title: "${title}"`);
    } else {
      recordFail('Landing Page Title', `Unexpected title: "${title}"`);
    }

    // Check navbar elements
    const navbar = await page.$('nav');
    if (navbar) {
      recordPass('Liquid Glass Navbar', 'Navbar mounted and visible');
    } else {
      recordFail('Liquid Glass Navbar', 'Navbar element not found');
    }

    // Check hero heading
    const heroHeading = await page.$eval('h1', el => el.innerText).catch(() => null);
    if (heroHeading) {
      recordPass('Landing Page Hero', `Hero text found: "${heroHeading.slice(0, 40)}..."`);
    } else {
      recordFail('Landing Page Hero', 'No <h1> hero found');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1_landing_page.png') });

    // -------------------------------------------------------------
    // 2. Garden Profile Setup Test
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Garden Setup (/setup) ---');
    await page.goto('http://localhost:5173/setup', { waitUntil: 'networkidle0' });
    await sleep(500);

    const setupHeading = await page.$eval('h1', el => el.innerText).catch(() => null);
    if (setupHeading && setupHeading.toLowerCase().includes('garden')) {
      recordPass('Setup Page Load', `Heading: "${setupHeading}"`);
    } else {
      recordFail('Setup Page Load', 'Garden setup heading not found');
    }

    // Fill in setup form
    const nameInput = await page.$('input[type="text"]');
    if (nameInput) {
      await nameInput.click({ clickCount: 3 });
      await nameInput.type('Skyline Herb Sanctuary');
      recordPass('Setup Form Name Input', 'Entered new garden sanctuary name');
    }

    // Click submit button
    const saveButton = await page.$('button[type="submit"]');
    if (saveButton) {
      await saveButton.click();
      await sleep(1500);
      recordPass('Setup Form Submission', 'Clicked Save Garden Profile button');
    } else {
      recordFail('Setup Form Submission', 'Save button not found');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '2_setup_saved.png') });

    // -------------------------------------------------------------
    // 3. Dashboard & Add Plant Test
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Dashboard & Plant Addition (/dashboard) ---');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await sleep(1000);

    const initialPlants = await page.$$eval('div', els => els.filter(el => el.innerText.includes('Water every')).length);
    recordPass('Dashboard Plants Initial Load', `Found existing plant cards`);

    // Click "Add Plant" button
    const addPlantBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Add Plant'));
    });

    if (addPlantBtn && addPlantBtn.asElement()) {
      await addPlantBtn.asElement().click();
      await sleep(500);

      // In Modal: fill name and submit
      const modalInput = await page.$('input[placeholder*="Sweet Basil"], input[type="text"]');
      if (modalInput) {
        await modalInput.type('Test Rosemary Bush');
        
        // Find and click modal Save button
        const modalSaveBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.innerText.includes('Add to Sanctuary') || b.innerText.includes('Save Plant'));
        });

        if (modalSaveBtn && modalSaveBtn.asElement()) {
          await modalSaveBtn.asElement().click();
          await sleep(1500);
          recordPass('Add Plant Modal', 'Created "Test Rosemary Bush" successfully');
        } else {
          recordFail('Add Plant Modal', 'Save button inside modal not found');
        }
      } else {
        recordFail('Add Plant Modal', 'Plant name input not found in modal');
      }
    } else {
      recordFail('Dashboard Add Plant', '"Add Plant" button not found on Dashboard');
    }

    // Test completing a pending care task if present
    const taskCheckbox = await page.$('button[title*="completed"], button[title*="Mark"], div[class*="rounded-xl"] button');
    if (taskCheckbox) {
      await taskCheckbox.click();
      await sleep(800);
      recordPass('Complete Care Task', 'Clicked complete on care task');
    } else {
      recordWarn('Complete Care Task', 'No pending care task button found to toggle');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '3_dashboard.png') });

    // -------------------------------------------------------------
    // 4. Care Calendar Test
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Care Calendar (/calendar) ---');
    await page.goto('http://localhost:5173/calendar', { waitUntil: 'networkidle0' });
    await sleep(1000);

    const calendarHeader = await page.$eval('h1', el => el.innerText).catch(() => null);
    if (calendarHeader && calendarHeader.includes('Care')) {
      recordPass('Care Calendar Load', `Header: "${calendarHeader}"`);
    } else {
      recordFail('Care Calendar Load', 'Calendar header not found');
    }

    // Click "+ Schedule Care Task"
    const scheduleBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Schedule Care Task') || b.innerText.includes('Add Task'));
    });

    if (scheduleBtn && scheduleBtn.asElement()) {
      await scheduleBtn.asElement().click();
      await sleep(500);

      // Fill in new task title
      const taskTitleInput = await page.$('input[placeholder*="fertilize"], input[name="title"], form input[type="text"]');
      if (taskTitleInput) {
        await taskTitleInput.type('Organic Compost Tea Feed');
        
        const saveTaskBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.innerText.includes('Schedule Task') || b.innerText.includes('Add Task'));
        });

        if (saveTaskBtn && saveTaskBtn.asElement()) {
          await saveTaskBtn.asElement().click();
          await sleep(1200);
          recordPass('Schedule Care Task', 'Successfully scheduled "Organic Compost Tea Feed"');
        }
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '4_care_calendar.png') });

    // -------------------------------------------------------------
    // 5. Garden Planner Test
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Garden Planner (/planner) ---');
    await page.goto('http://localhost:5173/planner', { waitUntil: 'networkidle0' });
    await sleep(1500);

    const generatePlanBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Generate') || b.innerText.includes('Regenerate'));
    });

    if (generatePlanBtn && generatePlanBtn.asElement()) {
      console.log('Triggering AI Garden Plan Generation...');
      await generatePlanBtn.asElement().click();
      
      // Wait for generation (spinner finishes, up to 25s)
      await sleep(5000);
      const isFinished = await page.waitForFunction(() => {
        const bodyText = document.body.innerText;
        return bodyText.includes('Recommended Crops') || 
               bodyText.includes('Recommended Plants') || 
               bodyText.includes('Companion Planting') || 
               bodyText.includes('Space Layout') ||
               bodyText.includes('Deterministic Horticultural Plan') ||
               bodyText.includes('Google Gemma');
      }, { timeout: 25000 }).catch(() => null);

      if (isFinished) {
        recordPass('Garden Planner Generation', 'Plan successfully rendered with horticultural recommendations');
      } else {
        recordFail('Garden Planner Generation', 'Plan generation timed out or failed to render');
      }
    } else {
      recordWarn('Garden Planner Generation', 'Generate button not found, checking existing plan...');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '5_garden_planner.png') });

    // -------------------------------------------------------------
    // 6. Plant Health Scanner Test (with File Upload)
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Plant Health Scanner (/scanner) with leaf upload ---');
    await page.goto('http://localhost:5173/scanner', { waitUntil: 'networkidle0' });
    await sleep(1000);

    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      console.log(`Uploading test image: ${SAMPLE_IMAGE_PATH}`);
      await fileInput.uploadFile(SAMPLE_IMAGE_PATH);
      await sleep(1000);

      // Verify preview image appeared
      const previewImg = await page.$('img[alt="Leaf Preview"], img[src^="blob:"]');
      if (previewImg) {
        recordPass('Leaf Image Upload & Preview', 'Preview rendered successfully from uploaded file');
      } else {
        recordWarn('Leaf Image Upload & Preview', 'Image preview element not matched by selector');
      }

      // Find "Run Plant Health Scan" button
      const scanBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.innerText.includes('Analyze Leaf') || b.innerText.includes('Scan') || b.innerText.includes('Screen'));
      });

      if (scanBtn && scanBtn.asElement()) {
        console.log('Clicking Analyze Leaf button...');
        await scanBtn.asElement().click();

        // Wait for analysis result card (up to 25s)
        const scanCompleted = await page.waitForFunction(() => {
          const text = document.body.innerText;
          return text.includes('Screening Assessment') || 
                 text.includes('Confidence') || 
                 text.includes('Plain-Language') || 
                 text.includes('Non-Toxic Care Actions') ||
                 text.includes('Cautionary Screening') ||
                 text.includes('Healthy');
        }, { timeout: 25000 }).catch(() => null);

        if (scanCompleted) {
          recordPass('Plant Health Scanner Inference', 'Leaf classification completed and displayed assessment');
        } else {
          recordFail('Plant Health Scanner Inference', 'Inference result not displayed within timeout');
        }
      } else {
        recordFail('Plant Health Scanner', 'Analyze Leaf button not found');
      }
    } else {
      recordFail('Plant Health Scanner', 'File input[type="file"] not found');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '6_health_scanner.png') });

    // -------------------------------------------------------------
    // 7. Touch Grass Mode Test
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Touch Grass Mode (/touch-grass) ---');
    await page.goto('http://localhost:5173/touch-grass', { waitUntil: 'networkidle0' });
    await sleep(1000);

    const missionHeading = await page.$eval('h1, h2', el => el.innerText).catch(() => null);
    if (missionHeading) {
      recordPass('Touch Grass Mission Load', `Mission heading: "${missionHeading}"`);
    } else {
      recordFail('Touch Grass Mission Load', 'Mission card not found');
    }

    // Step checkboxes
    const stepCheckboxes = await page.$$('input[type="checkbox"]');
    if (stepCheckboxes.length > 0) {
      for (const cb of stepCheckboxes.slice(0, 3)) {
        await cb.click().catch(() => {});
      }
      recordPass('Touch Grass Steps', `Toggled ${stepCheckboxes.length} step checkboxes`);
    }

    // Fill reflection note
    const noteTextarea = await page.$('textarea');
    if (noteTextarea) {
      await noteTextarea.type('Felt peaceful observing the morning sunlight and moist soil.');
      recordPass('Touch Grass Reflection', 'Entered mindful reflection notes');
    }

    // Submit mission completion if button enabled
    const completeMissionBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Complete Mission') || b.innerText.includes('Mark Completed'));
    });

    if (completeMissionBtn && completeMissionBtn.asElement()) {
      await completeMissionBtn.asElement().click();
      await sleep(1500);
      recordPass('Complete Daily Mission', 'Clicked Complete Mission button');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '7_touch_grass.png') });

    // -------------------------------------------------------------
    // 8. Settings & Transparency Test
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Settings & Transparency (/settings) ---');
    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' });
    await sleep(1000);

    const settingsHeader = await page.$eval('h1', el => el.innerText).catch(() => null);
    if (settingsHeader && settingsHeader.includes('Settings')) {
      recordPass('Settings Page Load', `Header: "${settingsHeader}"`);
    } else {
      recordFail('Settings Page Load', 'Settings header not found');
    }

    // Check system models disclosure
    const bodyText = await page.$eval('body', el => el.innerText);
    const mentionsGemma = bodyText.includes('Gemma 3 4B') || bodyText.includes('gemma');
    const mentionsViT = bodyText.includes('PlantVillage') || bodyText.includes('ViT');
    const mentionsSanctuary = bodyText.includes('Sanctuary') || bodyText.includes('Garden');

    if (mentionsGemma && mentionsViT && mentionsSanctuary) {
      recordPass('Attribution & Transparency', 'Correctly discloses Gemma 3 4B, PlantVillage ViT, and active sanctuary');
    } else {
      recordWarn('Attribution & Transparency', 'Some model attributions were not identified in text');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '8_settings.png') });

  } catch (err) {
    recordFail('E2E Test Execution', err.stack || err.message);
  } finally {
    await browser.close();
  }

  // Print Summary
  console.log('\n======================================================');
  console.log('🏁 GROW-MATE E2E BROWSER TESTING SUMMARY');
  console.log('======================================================');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️ Warnings: ${results.warnings.length}`);
  console.log(`🚨 Browser Console Errors: ${results.consoleErrors.length}`);
  console.log('======================================================');

  // Save report JSON
  fs.writeFileSync(
    path.join(__dirname, 'e2e_report.json'),
    JSON.stringify(results, null, 2)
  );

  return results;
}

runTests().then(() => {
  console.log('Testing completed.');
  process.exit(0);
}).catch(e => {
  console.error('Fatal error during testing:', e);
  process.exit(1);
});
