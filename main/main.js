import { Rate } from 'k6/metrics';
import {
    options_per_vu_iterations,
    BASE_URL as CONFIG_BASE_URL
} from '../config/config.js';
import { manageUser } from '../tests/managgeUser.js';


export const BASE_URL = CONFIG_BASE_URL;
export const options = options_per_vu_iterations;

export const scenario_manageUser = manageUser;

export let errorRate = new Rate('errors');
export let successRate = new Rate('success');

export default function () {
    manageUser();
}