import { Rate } from 'k6/metrics';
import {
    options as CONFIG_OPTION,
    BASE_URL as CONFIG_BASE_URL
} from '../config/config.js';
import { getUser } from '../tests/getUser.js';
import { updateUser } from '../tests/updateUser.js';


export const BASE_URL = CONFIG_BASE_URL;
export const options = CONFIG_OPTION;

export let errorRate = new Rate('errors');
export let successRate = new Rate('success');

export function scenario_sharediterations() {
    getUser();
}
export function scenario_pervuiterations() {
    updateUser();
}