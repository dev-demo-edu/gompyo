import { test, expect } from '@playwright/test';
import { login } from '../utils/login';

test.describe('로그인 테스트', () => {
  test('정상 로그인', async ({ page }) => {
    await login(page, 'admin@example.com', 'password123');
    await expect(page).toHaveURL('http://localhost:3000');
  });

  test('비밀번호 오류', async ({ page }) => {
    await login(page, 'admin@example.com', 'wrongpass');
    await expect(page.locator('text=이메일 또는 비밀번호가 올바르지 않습니다.')).toBeVisible();
  });
});
