import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров', () => {
    test.beforeEach(async ({ page }) => {

        await page.addInitScript(() => {
            localStorage.setItem('accessToken', 'mock-token-for-test');
        });

        // Открываем главную страницу перед каждым тестом
        await page.goto('/');
        
        // Ждем загрузки ингредиентов
        await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 10000 });
    });

    test('действия пользователя', async ({ page }) => {
        
        // ========== 1. Перетаскивание ингредиентов ==========
        
        // Зоны для перетаскивания
        const bunArea = page.locator('[data-testid="constructor-bun-area"]').first();
        const ingredientArea = page.locator('[data-testid="constructor-ingredients-area"]');
        
        // Проверяем, что зоны существуют
        await expect(bunArea).toBeVisible();
        await expect(ingredientArea).toBeVisible();
        
        // Перетаскиваем булку
        const bun = page.locator('[data-testid="ingredient-card"][data-type="bun"]').first();
        await bun.dragTo(bunArea);
        await page.waitForTimeout(1000);
        
        // Проверяем, что булка добавилась
        const bunZones = page.locator('[data-testid="constructor-bun-area"]');
        await expect(bunZones).toHaveCount(2);
        
        // Перетаскиваем начинку
        const main = page.locator('[data-testid="ingredient-card"][data-type="main"]').first();
        await main.dragTo(ingredientArea);
        await page.waitForTimeout(1000);
        
        // Проверяем, сколько ингредиентов добавилось
        const ingredients = page.locator('[data-testid="constructor-ingredient"]');
        const count = await ingredients.count();
        console.log(`Количество ингредиентов: ${count}`);
        
        // Перетаскиваем соус
        const sauce = page.locator('[data-testid="ingredient-card"][data-type="sauce"]').first();
        await sauce.dragTo(ingredientArea);
        await page.waitForTimeout(1000);

        // Проверяем, что ингредиентов больше 0 (хотя бы один добавился)
        const ingredientsCount = await ingredients.count();
        expect(ingredientsCount).toBeGreaterThan(0);
        
        // Проверяем, что общая стоимость изменилась (стала больше 0)
        const totalPrice = page.locator('[data-testid="total-price"]');
        const priceText = await totalPrice.textContent();
        const price = parseInt(priceText?.replace(/\D/g, '') || '0');
        expect(price).toBeGreaterThan(0);
        
        // 2. Создание заказа
        
        // Нажимаем кнопку "Оформить заказ"
        const orderButton = page.locator('[data-testid="order-button"]');
        await expect(orderButton).toBeEnabled();
        await orderButton.click();
        
        // 3. Модальное окно заказа
        
        // Проверяем, что открылось модальное окно заказа
        const orderModal = page.locator('[data-testid="order-modal"]');
        await expect(orderModal).toBeVisible({ timeout: 15000 });
        
        // Проверяем, что номер заказа отображается и это число
        const orderNumber = page.locator('[data-testid="order-number"]');
        await expect(orderNumber).toBeVisible();
        const orderNumberText = await orderNumber.textContent();
        const orderNumberValue = parseInt(orderNumberText?.replace(/\D/g, '') || '0');
        expect(orderNumberValue).toBeGreaterThan(0);
        
        // Проверяем, что статус заказа отображается
        const orderStatus = page.locator('[data-testid="order-status"]');
        await expect(orderStatus).toBeVisible();
        
        // 4. Закрытие модального окна
        
        // Нажимаем клавишу ESC
        await page.keyboard.press('Escape');
        
        // Ждем, пока модальное окно закроется
        await expect(orderModal).not.toBeVisible({ timeout: 5000 });
        
        // Небольшая задержка для обновления UI
        await page.waitForTimeout(500);
        
        // 5. Проверка очистки конструктора
        
        // Проверяем, что ингредиенты удалены
        await expect(page.locator('[data-testid="constructor-ingredient"]')).toHaveCount(0);
        
        // Проверяем, что общая стоимость сбросилась
        await expect(totalPrice).toHaveText('0');
        
        // Проверяем, что кнопка заказа снова неактивна
        await expect(orderButton).toBeDisabled();
        
        // Проверяем, что в зонах булок нет активных элементов (только заглушки)
        const bun_area = page.locator('[data-testid="constructor-bun-area"]');
        await expect(bun_area).toHaveCount(2); // зоны существуют
        
        // Проверяем, что в зонах нет компонентов ConstructorElement (значит булка удалена)
        const bunElements = page.locator('[data-testid="constructor-bun-area"] .constructor-element');
        await expect(bunElements).toHaveCount(0)

    });
});