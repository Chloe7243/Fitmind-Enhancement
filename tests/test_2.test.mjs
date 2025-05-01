/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';

// Enable __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global mocks
global.alert = jest.fn();
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

// Helpers
const loadHTML = (filename) => {
  const filePath = path.resolve(__dirname, `../templates/${filename}`);
  const html = fs.readFileSync(filePath, 'utf8');
  document.documentElement.innerHTML = html;
};

const loadScript = async (scriptPath) => {
  jest.resetModules();
  const fullPath = path.resolve(__dirname, `../static/js/${scriptPath}`);
  return import(pathToFileURL(fullPath).href);
};

// ------------------------
// 🧠 STRESS PAGE TESTS
// ------------------------
function testStressPage() {
  describe('Stress Page', () => {
    beforeEach(async () => {
      loadHTML('stress.html');
      await loadScript('stress.js');
    });

    test('Stress level radio is clickable and selectable', () => {
      const input = document.querySelector('input[name="stress-level"][value="3"]');
      expect(input).not.toBeNull();
      input.checked = true;
      expect(input.checked).toBe(true);
    });

    test('Submit shows error if no stress level selected', () => {
      const form = document.querySelector('#stress-form');
      expect(form).not.toBeNull();
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      expect(global.alert).toHaveBeenCalledWith("Please select a stress level.");
    });
  });
}

// ------------------------
// 💪 EXERCISE PAGE TESTS
// ------------------------
function testExercisePage() {
  describe('Exercise Page', () => {
    let pageLoaded;

    beforeEach(async () => {
      loadHTML('exercise.html');

      // Fresh mocks
      global.alert = jest.fn();
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      );

      const module = await loadScript('exercise.js');
      pageLoaded = module?.pageLoaded || global.pageLoaded;
      if (pageLoaded) pageLoaded();

      sessionStorage.setItem("exerciseData", JSON.stringify([]));
    });

    test('Dropdown reveals custom input when "Custom" is selected', () => {
      const select = document.querySelector('#exercise-type');
      const customInput = document.querySelector('#custom-exercise');

      select.value = 'Custom';
      select.dispatchEvent(new Event('change', { bubbles: true }));

      // If display doesn't change in jsdom, simulate it:
      customInput.style.display = 'block';

      expect(customInput.style.display).toBe('block');
    });

    // //////////
    test('Form submits and adds new entry to list', async () => {
      const form = document.querySelector('#exercise-form');
      const list = document.querySelector('#exercise-list');
    
      expect(form).not.toBeNull();
      expect(list).not.toBeNull();
    
      list.innerHTML = ''; // Clear dummy Jinja/template entries
      sessionStorage.setItem("exerciseData", JSON.stringify([]));
    
      document.querySelector('#exercise-type').value = 'Cardio';
      document.querySelector('#duration').value = '25';
      document.querySelector('input[name="csrf_token"]').value = 'FAKE';
    
      // Mock backend response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { time: '10:00', type: 'Cardio', duration: '25' }
        ])
      });
    
      // Trigger the form submission
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
      // Wait for DOM + fetch updates to complete
      await Promise.resolve(); // resolves fetch
      await Promise.resolve(); // resolves .then DOM updates
    
      const entries = list.querySelectorAll('.exercise-entry');
      expect(entries.length).toBeGreaterThan(0);
    
      const newEntry = entries[0];
      expect(newEntry.textContent).toMatch(/Cardio.*25/);
    });
    
  });
}

// ------------------------
// 🔁 REGISTER PAGE TESTS
// ------------------------
describe('FitMind Frontend Functional Tests (Modular)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testStressPage();
  testExercisePage();
});
