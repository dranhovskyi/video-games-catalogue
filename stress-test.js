import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    cpu_stress_test: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '3m', target: 300 },
        { duration: '3m', target: 600 },
        { duration: '2m', target: 1000 },
      ],
      gracefulRampDown: '30s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.5'],
    http_req_duration: ['p(95)<5000'],
  },
};

const BASE_URL =
  'http://videogames-external-alb-222468514.us-east-2.elb.amazonaws.com';

export default function () {
  // Multiple requests per iteration to maximize CPU usage
  const responses = http.batch([
    ['GET', `${BASE_URL}`],
    ['GET', `${BASE_URL}`],
    ['GET', `${BASE_URL}`],
    ['GET', `${BASE_URL}`],
    ['GET', `${BASE_URL}`],
  ]);

  for (const res of responses) {
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  }

  // Optional tiny sleep to avoid overwhelming local machine first
  sleep(0.1);
}