import { env } from '@/config';

export const generatePayPalAccessToken = async () => {
    try {
        const auth = Buffer.from(`${env.paypal.CLIENT_ID}:${env.paypal.CLIENT_SECRET}`).toString('base64');
        const response = await fetch(`${env.paypal.SANDBOX_BASE_URL}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        return (await response.json()).access_token;
    } catch (error) {
        console.error('Failed to generate Access Token: ', error);
    }
};
