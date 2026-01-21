const http = require('http');

console.log('Testing Zod validation...\n');

// Test 1: Valid data (should pass)
console.log('Test 1: Valid data (should pass)');
const validData = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 22
};

const validOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const validReq = http.request(validOptions, (res) => {
  let data = '';
  console.log(`Status: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('');
    
    // Test 2: Invalid data (should fail validation)
    console.log('Test 2: Invalid data (should fail validation)');
    const invalidData = {
      name: 'A',
      email: 'bademail'
    };

    const invalidOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const invalidReq = http.request(invalidOptions, (res2) => {
      let data2 = '';
      console.log(`Status: ${res2.statusCode}`);
      
      res2.on('data', (chunk) => {
        data2 += chunk;
      });
      
      res2.on('end', () => {
        console.log('Response:', data2);
        console.log('\nValidation test completed!');
      });
    });

    invalidReq.on('error', (e) => {
      console.error('Error in invalid request:', e);
    });

    invalidReq.write(JSON.stringify(invalidData));
    invalidReq.end();
  });
});

validReq.on('error', (e) => {
  console.error('Error in valid request:', e);
});

validReq.write(JSON.stringify(validData));
validReq.end();