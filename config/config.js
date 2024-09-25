// Definisi berbagai environment yang digunakan dalam pengujian
export const environments = {
    // Environment development, digunakan untuk pengujian pada tahap pengembangan
    development: {
        loginURL: 'https://test-api.k6.io/auth/basic/login/',
        baseURL: 'https://test-api.k6.io/my/crocodiles/',
    },
    
    // Environment staging, digunakan untuk pengujian pada tahap staging (pre-prod)
    staging: {
        loginURL: 'https://test-api.k6.io/auth/basic/login/',
        baseURL: 'https://test-api.k6.io/my/crocodiles/',
    },
    
    // Environment production, digunakan untuk pengujian di lingkungan prod
    production: {
        loginURL: 'https://test-api.k6.io/auth/basic/login/',
        baseURL: 'https://test-api.k6.io/my/crocodiles/',
    },
};

// Fungsi untuk mengambil konfigurasi environment berdasarkan variabel ENV
// Fungsi ini akan menggunakan environment yang diberikan, atau default ke 'development' jika tidak ada
// Cara Menjalankan k6 dengan data environment diatas dengan eksekusi script : k6 run -e ENVIRONMENT=development script.js
export function getEnvironment(env) {
    return environments[env] || environments.development;
}

// Mendapatkan environment dari variabel environment yang diteruskan saat runtime (ENV)
const currentEnv = getEnvironment(__ENV.ENVIRONMENT); // Mengambil environment dari __ENV.ENVIRONMENT

export const options = {
    // Konfigurasi ekstensi untuk Load Impact (K6 Cloud)
    ext: {
        loadimpact: {
            // Konfigurasi distribusi beban ke lokasi geografis tertentu
            distribution: {
                // Lokasi geografis untuk pengujian (Amazon AWS - Ashburn, US)
                // Dokumentasi : https://k6.io/docs/cloud/creating-and-running-a-test/cloud-scripting-extras/load-zones/
                "amazon:us:ashburn": { 
                    loadZone: "amazon:us:ashburn", // Zona pengujian 
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            // Konfigurasi untuk Application Performance Monitoring (APM)
            // APM memungkinkan integrasi dengan alat monitoring eksternal (dikosongkan dalam contoh ini)
            apm: []
        }
    },

    // Thresholds menentukan kriteria keberhasilan pengujian berdasarkan metrik tertentu
    thresholds: {
        // Tingkat keberhasilan (success rate) harus lebih dari 95%
        success: ["rate>0.95"],

        // Tingkat kesalahan (error rate) harus kurang dari 10%
        errors: ["rate<0.1"],

        // Durasi permintaan HTTP (response time) harus kurang dari 1500ms untuk 90% permintaan
        http_req_duration: ["p(90)<5000"] // p(90) berarti 90% dari semua permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Shared Iterations: Eksekutor ini membagi sejumlah iterasi tetap di antara semua VUs
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/shared-iterations/
        scenario_1: {
            executor: 'shared-iterations',
            iterations: 4, // Total iterasi yang dibagikan oleh semua VU
            vus: 2, // jumlah VUs
            maxDuration: '30s', // durasi maksimum eksekusi
            exec: 'scenario_sharediterations' // Fungsi yang akan dieksekusi
        },

        // Constant Arrival Rate: Eksekutor ini menjaga jumlah request tetap konstan selama durasi tertentu.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/constant-arrival-rate/
        scenario_2: {
            executor: 'per-vu-iterations',
            vus: 1, // jumlah VUs
            iterations: 2, // Jumlah iterasi per VU
            maxDuration: '30s', // Batas waktu untuk setiap iterasi
            exec: 'scenario_pervuiterations' // Fungsi yang akan dieksekusi
        }
    }
};

export const options_shared_iterations = {
    // Konfigurasi ekstensi untuk Load Impact (K6 Cloud)
    ext: {
        loadimpact: {
            // Konfigurasi distribusi beban ke lokasi geografis tertentu
            distribution: {
                // Lokasi geografis untuk pengujian (Amazon AWS - Ashburn, US)
                // Dokumentasi: https://k6.io/docs/cloud/creating-and-running-a-test/cloud-scripting-extras/load-zones/
                "amazon:us:ashburn": {
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            // Konfigurasi untuk Application Performance Monitoring (APM)
            // APM memungkinkan integrasi dengan alat monitoring eksternal (dikosongkan dalam contoh ini)
            apm: []
        }
    },

    // Thresholds menentukan kriteria keberhasilan pengujian berdasarkan metrik tertentu
    thresholds: {
        // Tingkat keberhasilan (success rate) harus lebih dari 95%
        success: ["rate>0.95"],

        // Tingkat kesalahan (error rate) harus kurang dari 10%
        errors: ["rate<0.1"],

        // Durasi permintaan HTTP (response time) harus kurang dari 1500ms untuk 90% permintaan
        http_req_duration: ["p(90)<5000"] // p(90) berarti 90% dari semua permintaan harus selesai dalam 1.5 detik
    },

    scenarios: {
        // Shared Iterations: Eksekutor ini membagi sejumlah iterasi tetap di antara semua VUs
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/shared-iterations/
        scenario_sharediterations: {
            executor: 'shared-iterations',
            iterations: 100, // Total iterasi yang dibagikan oleh semua VU
            vus: 5,          // Jumlah VUs
            maxDuration: '30s', // Durasi maksimum eksekusi
        }
    }
};

export const options_constant_arrival_rate = {
    ext: {
        loadimpact: {
            distribution: { // Dokumentasi : https://k6.io/docs/cloud/creating-and-running-a-test/cloud-scripting-extras/load-zones/
                "amazon:us:ashburn": {  
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            apm: []
        }
    },
    thresholds: {
        success: ["rate>0.95"], // Tingkat keberhasilan harus lebih dari 95%
        errors: ["rate<0.1"],    // Tingkat kesalahan harus kurang dari 10%
        http_req_duration: ["p(90)<5000"] // 90% permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Constant Arrival Rate: Eksekutor ini menjaga jumlah request tetap konstan selama durasi tertentu.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/constant-arrival-rate/
        scenario_constantarrivalrate: {
            executor: 'constant-arrival-rate',
            rate: 5,               // Jumlah permintaan yang harus disimulasikan per detik
            timeUnit: '1s',        // Unit waktu untuk rate
            duration: '30s',       // Durasi di mana tingkat kedatangan konstan
            preAllocatedVUs: 5,    // Jumlah awal VUs yang dialokasikan
            maxVUs: 10,            // Jumlah maksimum VUs yang dapat dialokasikan
        }
    }
};

export const options_ramping_arrival_rate = {
    ext: {
        loadimpact: {
            distribution: {
                "amazon:us:ashburn": {
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            apm: []
        }
    },
    thresholds: {
        success: ["rate>0.95"], // Tingkat keberhasilan harus lebih dari 95%
        errors: ["rate<0.1"],    // Tingkat kesalahan harus kurang dari 10%
        http_req_duration: ["p(90)<5000"] // 90% permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Ramping Arrival Rate: Eksekutor ini meningkatkan atau menurunkan jumlah permintaan selama beberapa tahap.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/ramping-arrival-rate/
        scenario_rampingarrivalrate: {
            executor: 'ramping-arrival-rate',
            startRate: 2,           // Mulai dengan 2 request/detik
            timeUnit: '1s',         // Unit waktu untuk rate
            preAllocatedVUs: 5,     // Alokasi VU awal
            maxVUs: 10,             // Jumlah VU maksimum
            stages: [
                { duration: '15s', target: 5 },  // Menaikkan ke 5 request/detik dalam 15 detik
                { duration: '15s', target: 10 }, // Menaikkan ke 10 request/detik dalam 15 detik
                { duration: '15s', target: 5 }   // Mengurangi ke 5 request/detik dalam 15 detik
            ],
        }
    }
};

export const options_per_vu_iterations = {
    ext: {
        loadimpact: {
            distribution: {
                "amazon:us:ashburn": {
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            apm: []
        }
    },
    thresholds: {
        success: ["rate>0.95"], // Tingkat keberhasilan harus lebih dari 95%
        errors: ["rate<0.1"],    // Tingkat kesalahan harus kurang dari 10%
        http_req_duration: ["p(90)<5000"] // 90% permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Per VU Iterations: Setiap VU menjalankan sejumlah iterasi tetap. Iterasi dapat berbeda untuk setiap VU.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/per-vu-iterations/
        scenario_pervuiterations: {
            executor: 'per-vu-iterations',
            vus: 1,               // Jumlah VUs
            iterations: 2,        // Jumlah iterasi per VU
            maxDuration: '30s',   // Batas waktu untuk setiap iterasi
        }
    }
};

export const options_constant_vus = {
    ext: {
        loadimpact: {
            distribution: {
                "amazon:us:ashburn": {
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            apm: []
        }
    },
    thresholds: {
        success: ["rate>0.95"], // Tingkat keberhasilan harus lebih dari 95%
        errors: ["rate<0.1"],    // Tingkat kesalahan harus kurang dari 10%
        http_req_duration: ["p(90)<5000"] // 90% permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Constant VUs: Menjalankan sejumlah VUs yang konstan selama durasi tertentu.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/constant-vus/
        scenario_constantvus: {
            executor: 'constant-vus',
            vus: 5,               // Jumlah VUs
            duration: '30s',      // Durasi eksekusi konstan
        }
    }
};

export const options_ramping_vus = {
    ext: {
        loadimpact: {
            distribution: {
                "amazon:us:ashburn": {
                    loadZone: "amazon:us:ashburn", // Zona pengujian
                    percent: 100 // 100% dari beban dialokasikan ke zona ini
                }
            },
            apm: []
        }
    },
    thresholds: {
        success: ["rate>0.95"], // Tingkat keberhasilan harus lebih dari 95%
        errors: ["rate<0.1"],    // Tingkat kesalahan harus kurang dari 10%
        http_req_duration: ["p(90)<5000"] // 90% permintaan harus selesai dalam 1.5 detik
    },
    scenarios: {
        // Ramping VUs: Secara bertahap menambah atau mengurangi jumlah VUs selama beberapa tahap.
        // Dokumentasi: https://k6.io/docs/using-k6/scenarios/executors/ramping-vus/
        scenario_rampingvus: {
            executor: 'ramping-vus',
            stages: [
                { duration: '15s', target: 5 },   // Naikkan ke 5 VUs dalam 15 detik
                { duration: '15s', target: 10 },  // Pertahankan di 10 VUs selama 15 detik
                { duration: '15s', target: 0 }    // Kurangi ke 0 VUs dalam 15 detik
            ],
        }
    }
};
