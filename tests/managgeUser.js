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

// Opsi untuk menggunakan executor `per-vu-iterations`
export const options = {
    scenarios: {
        my_scenario: {
            executor: 'per-vu-iterations',
            vus: 1,             // Hanya 1 VU yang menjalankan iterasi
            iterations: 1,      // Setiap VU menjalankan 1 iterasi
            maxDuration: '1m',  // Durasi maksimum eksekusi per VU
            exec: 'manageUser'
        }
    },
    thresholds: {
        success: ['rate>0.95'],  // 95% request harus berhasil
        http_req_duration: ['p(90)<5000'], // 90% permintaan harus selesai dalam 5000ms
    },
};

export function manageUser() {
    group('User Management Workflow', function () {
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
        const userCount = getUserData.length;
        console.log(`🚀 ~ User count: ${userCount}`);

        // Step 3: Delete last user if count >= 100
        if (userCount >= 100) {
            const lastUserId = getUserData[getUserData.length - 1].id;
            console.log(`Deleting user with ID: ${lastUserId}`);

            const deleteResponse = http.del(`${url.baseURL}${lastUserId}/`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader,
                },
            });

            check(deleteResponse, { 'delete user successful': (r) => r.status === 204 });
        }

        // Step 4: Create User
        const createUserResponse = http.post(url.baseURL, {
            name: 'Usertest',
            sex: 'M',
            date_of_birth: '2020-02-02',
        }, {
            headers: {
                'Cookie': cookieHeader,
            },
        });

        check(createUserResponse, { 'create user successful': (r) => r.status === 201 });
        const createUserData = JSON.parse(createUserResponse.body);
        const userId = createUserData.id;

        console.log(`🚀 ~ Created user with ID: ${userId}`);

        // Step 5: Update User
        const updateUserResponse = http.put(`${url.baseURL}${userId}/`, {
            name: 'Usertest update',
            sex: 'M',
            date_of_birth: '2024-09-01',
        }, {
            headers: {
                'Cookie': cookieHeader,
            },
        });

        check(updateUserResponse, { 'update user successful': (r) => r.status === 200 });
        console.log(`🚀 ~ Updated user with ID: ${userId}`);

        // Pause for 1 second between iterations
        sleep(1);
    });
}