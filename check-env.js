#!/usr/bin/env node

const { API_KEY, SECRET_KEY } = process.env;

if (!API_KEY || !SECRET_KEY) {
  console.error('ERROR: Please export your Last.fm API credentials:');
  console.log('  export API_KEY=xxx');
  console.log('  export SECRET_KEY=xxx\n');
  process.exit(1);
}
