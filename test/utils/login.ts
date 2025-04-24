import { Page } from '@playwright/test';

export async function login(page: Page, id: string, password: string): Promise<void> {
    await page.goto('http://localhost:3000/login');

    await page.getByRole('textbox', { name: '이메일' }).fill(id);
    await page.getByRole('textbox', { name: '비밀번호' }).fill(password);
    await page.getByRole('button', { name: '로그인' }).click();

    const failureLocator = page.getByText('이메일 또는 비밀번호가 올바르지 않습니다.', { exact: false });

    const result = await Promise.race([
        page.waitForURL('http://localhost:3000', { timeout: 5000 }).then(() => 'success'),
        failureLocator.waitFor({ timeout: 5000 }).then(() => 'failure')
    ]);

    if (result == 'success') {
        console.log('[로그인 성공]');
    } else {
        console.warn('[로그인 실패]');
    }
};