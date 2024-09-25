import { Rate } from 'k6/metrics';
import {
    options_per_vu_iterations} from '../config/config.js';
import { manageUser } from '../tests/managgeUser.js';

export const options = options_per_vu_iterations;


export let errorRate = new Rate('errors');
export let successRate = new Rate('success');

export default function () {
    manageUser();
}