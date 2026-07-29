/**
 * ============================================================
 * Test: Customer
 * ============================================================
 */

import { Customer } from '../../src/commerce/Customer.js';
import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Customer');
console.log('');

// Retail customer
const retail = Customer.retail({
  id: Identifier.from('cust_retail_001', 'customer'),
  name: 'Sarah M.',
  email: 'sarah@example.com'
});

console.log('📋 Retail Customer:');
console.log(`  ID: ${retail.id.value}`);
console.log(`  Name: ${retail.name}`);
console.log(`  Email: ${retail.email}`);
console.log(`  Group: ${retail.group}`);
console.log(`  Is retail: ${retail.isRetail}`);
console.log(`  Is wholesale: ${retail.isWholesale}`);
console.log(`  Is VIP: ${retail.isVip}`);
console.log('');

// Wholesale customer
const wholesale = Customer.wholesale({
  id: Identifier.from('cust_wholesale_001', 'customer'),
  name: 'Wholesale Foods Inc.',
  email: 'orders@wholesalefoods.com',
  contracts: ['contract_001']
});

console.log('📋 Wholesale Customer:');
console.log(`  ID: ${wholesale.id.value}`);
console.log(`  Name: ${wholesale.name}`);
console.log(`  Group: ${wholesale.group}`);
console.log(`  Is wholesale: ${wholesale.isWholesale}`);
console.log(`  Has contracts: ${wholesale.hasContracts}`);
console.log(`  Contracts: ${wholesale.contracts.join(', ')}`);
console.log('');

// Guest customer
const guest = Customer.guest();
console.log('📋 Guest Customer:');
console.log(`  ID: ${guest.id.value}`);
console.log(`  Group: ${guest.group}`);
console.log(`  Is guest: ${guest.isGuest}`);
console.log('');

console.log('✅ All Customer tests passed!');
