import { test, expect } from '@playwright/test';

//todo need to fix this
test.describe('Flight Search Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.aviasales.ru');
    });

    test('Verify the user can select a departure date from the calendar', async ({ page }) => {
        await page.getByTestId('start-date-field').waitFor({ state: 'attached' });
        await page.getByTestId('start-date-field').click();

        // Verify calendar is opened
        await expect(page.getByTestId('calendar-action-button')).toBeVisible();

        // Navigate to a different month
        await page.getByTestId('calendar-next-month-button').click();
        await page.getByTestId('date-01.10.2024').click();
        await page.getByTestId('calendar-action-button').click();

        // Verify the selected date is applied to the start-date-field
        const selectedDate = await page.getByTestId('start-date-field').inputValue();
        expect(selectedDate).toContain('01.10.2024');
    });
});


test.describe('Flight Search Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.aviasales.ru');
    });

    test('Handle invalid city input gracefully', async ({ page }) => {

        await page.getByTestId('origin-input').waitFor({ state: 'attached' });
        await page.getByTestId('origin-input').clear();
        await page.getByTestId('origin-input').fill('ZZZZ');  // Invalid city code

        await page.getByTestId('destination-input').waitFor({ state: 'attached' });
        await page.getByTestId('destination-input').fill('XXXX'); // Invalid destination

        await page.getByTestId('form-submit').waitFor({ state: 'attached' });
        await page.getByTestId('form-submit').click();

        // Verify an error message is shown
        const errorMessage = await page.getByTestId('error-message').textContent();
        expect(errorMessage).toContain('Не удалось найти город');
    });
});

test.describe('Flight Search Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.aviasales.ru');
    });

    test('Verify search results and filtering functionality', async ({ page }) => {
        // Fill out the form and submit
        await page.getByTestId('start-date-field').waitFor({ state: 'attached' });
        await page.getByTestId('start-date-field').click();
        await page.getByTestId('date-01.10.2024').click();
        await page.getByTestId('calendar-action-button').click();

        await page.getByTestId('origin-input').fill('Самара');
        await page.getByTestId('destination-input').fill('Пхукет');

        await page.getByTestId('checkbox').uncheck();
        await page.getByTestId('form-submit').click();

        // Verify the search results page loads
        await expect(page.getByText('Цены на соседние даты')).toBeVisible();

        // Apply some filters
        await page.getByTestId('filter-direct-flights').click();
        await expect(page.getByTestId('filter-applied')).toBeVisible();

        // Verify that filtered results are displayed
        const flightResults = await page.getByTestId('search-result').count();
        expect(flightResults).toBeGreaterThan(0);
    });
});
