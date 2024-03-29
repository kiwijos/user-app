import { expect, test } from '@playwright/test';

test.describe('map page test', () => {
	test.skip('map page (no longer exists!) has one expected map container', async ({ page }) => {
		await page.goto('/me/map');
		const mapContainer = page.locator('.map');
		await expect(mapContainer).toBeTruthy();
		await expect(mapContainer).toHaveCount(1);
	});
});
