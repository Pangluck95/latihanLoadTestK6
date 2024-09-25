import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import {
    environments
} from '../config/config.js';
// Metrik untuk mencatat kesuksesan dan kegagalan request
export let successRate = new Rate('success');
export let errorRate = new Rate('errors');

// Mengambil environment yang diinginkan, bisa berdasarkan variabel atau input parameter
// Gunakan environment yang diinginkan, misalnya 'development', 'staging', atau 'production'
const ENV = __ENV.ENVIRONMENT || 'development';  // Gunakan variabel ENV untuk menentukan environment, default 'development'
const url = environments[ENV];

export function updateUser() {
    group('update User Workflow', function () {
        // Step 1: Login menggunakan URL dari environment
        const loginResponse = http.post(url.loginURL, JSON.stringify({
            username: 'nkjshjkcckjhxewewjfhxkjqehnqlx@example.com',
            password: 'secret',
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        check(loginResponse, { 'login successful': (r) => r.status === 200 });
        const cookies = loginResponse.cookies;
        const cookieHeader = `sessionid=${cookies.sessionid[0].value}`;

        // Step 2: Get User Data menggunakan baseURL dari environment
        const getUserResponse = http.get(url.baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
            },
        });

        check(getUserResponse, { 'get user request successful': (r) => r.status === 200 });
        const getUserData = JSON.parse(getUserResponse.body);
        const lastUserId = getUserData[getUserData.length - 1].id;

        // Step 3: Update User
        const updateUserResponse = http.put(`${url.baseURL}${lastUserId}/`, {
            name: 'Usertest update',
            sex: 'M',
            date_of_birth: '2024-09-01',
        }, {
            headers: {
                'Cookie': cookieHeader,
            },
        });

        check(updateUserResponse, { 'update user successful': (r) => r.status === 200 });
        console.log(`🚀 ~ Updated user with ID: ${lastUserId}`);

        // Pause for 1 second between iterations
        sleep(1);
    });
}