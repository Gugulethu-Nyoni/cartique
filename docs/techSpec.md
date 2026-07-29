# 🏗️ Cartique Technical Specification

## Commerce Decision Kernel v1.0

---

## Overview

Cartique is a **deterministic commerce decision engine** that transforms commercial intent into immutable commercial truth. It is not a shopping cart, not a pricing engine, and not an e-commerce platform. It is a **kernel** that computes commercial decisions.

### The Core Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   INPUT                            OUTPUT                                   │
│   ─────                            ──────                                   │
│   Sellable    ──────────────────┐                                           │
│   Customer   ──────────────────┤                                           │
│   Configuration ──────────────┤    Resolution Engine    CommercialDecision │
│   Place      ──────────────────┤    ─────────────────    ───────────────── │
│   Contexts   ──────────────────┘                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── core/          ← Immutable value objects (Money, Identifier, etc.)
├── commerce/      ← Commerce domain objects (Sellable, Variant, Customer, etc.)
├── engine/        ← Resolution engine and resolvers
├── persistence/   ← Data loading (fixtures, repositories, mappers)
├── catalog/       ← Catalog domain (placeholder for future)
├── rules/         ← Rule definitions (placeholder for future)
├── query/         ← Search & filtering (placeholder for future)
└── ui/            ← UI components (placeholder for future)
```

---

## 1. Core Layer (`src/core/`)

### Purpose
Provide **immutable value objects** that form the foundation of all commerce calculations.

### Components

| File | Purpose | Example |
|------|---------|---------|
| **Money.js** | Monetary value with currency | `new Money(28000, 'ZAR', 2)` → R280.00 |
| **Identifier.js** | Typed unique identifier | `Identifier.from('prod_123', 'product')` |
| **Quantity.js** | Quantity with unit | `Quantity.kg(2.5)` → 2.500 kg |
| **Diagnostics.js** | Errors, warnings, notices collection | `diagnostics.addError('STOCK_001', 'Out of stock')` |
| **Adjustment.js** | Price modification (discount, surcharge) | `Adjustment.discount('BLACK_FRIDAY', R20)` |
| **ResolutionItem.js** | Individual line item in a resolution | `ResolutionItem { sellable, variant, quantity, unitPrice }` |
| **ResolutionPatch.js** | Immutable patch from a resolver | `ResolutionPatch.success({ items: [...] })` |
| **ResolutionJournal.js** | Audit trail of all decisions | `journal.addEntry({ resolver: 'PricingResolver', ... })` |
| **ResolutionState.js** | Immutable state passed between resolvers | `ResolutionState { sellable, customer, items, resolved }` |
| **CommercialDecision.js** | Final immutable output | `CommercialDecision { items, adjustments, totals, journal }` |

### Example: Money

```javascript
import { Money } from '@semantq/cartique/core';

// Creating money
const price = Money.fromDecimal(140.00, 'ZAR');  // R140.00
const discount = Money.fromDecimal(20.00, 'ZAR'); // R20.00

// Operations
const final = price.subtract(discount);          // R120.00
console.log(final.toFormatted());                // "R120.00"
```

### Example: Adjustment

```javascript
import { Adjustment, Money } from '@semantq/cartique/core';

// Black Friday 20% off
const discount = Adjustment.discount(
  'promotion.black_friday',
  Money.fromDecimal(56.00),
  'Black Friday 20% off',
  'Applied to order'
);

console.log(discount.isDiscount());  // true
console.log(discount.amount);        // -R56.00
```

---

## 2. Commerce Layer (`src/commerce/`)

### Purpose
Define **immutable commerce domain objects** that the resolution engine consumes.

### Components

| File | Purpose | Example |
|------|---------|---------|
| **Sellable.js** | Anything that can be sold (product, bundle, service) | Chia Seeds, T-Shirt, Subscription |
| **Variant.js** | Specific configuration of a sellable | 1kg Bag, Size M, Color Red |
| **Customer.js** | Buyer entity | Retail, Wholesale, VIP |
| **Place.js** | Geographic location | South Africa, UK, USA |
| **Context.js** | Commercial conditions | Black Friday, Summer Sale |
| **Promotion.js** | Marketing promotion | 20% off, Free Shipping |
| **Coupon.js** | Discount code | SUMMER20, SAVE50 |
| **Cart.js** | Temporary collection of items | Shopping cart |

### Example: Sellable (Product)

```javascript
import { Sellable, Variant } from '@semantq/cartique/commerce';
import { Money } from '@semantq/cartique/core';

// Chia Seeds with variants
const chiaSeeds = new Sellable({
  id: 'prod_chia_001',
  type: 'product',
  title: 'Organic Chia Seeds',
  sku: 'CHIA-001',
  pricing: { base: 140 },
  variants: [
    new Variant({
      id: 'var_chia_100g',
      attributes: { weight: '100g' },
      pricing: { base: 25 },
      inventory: 100
    }),
    new Variant({
      id: 'var_chia_250g',
      attributes: { weight: '250g' },
      pricing: { base: 45 },
      inventory: 80
    }),
    new Variant({
      id: 'var_chia_1kg',
      attributes: { weight: '1kg' },
      pricing: { 
        base: 140, 
        wholesale: 120,
        bulk: [{ minQuantity: 10, price: 100 }]
      },
      inventory: 30,
      isDefault: true
    })
  ]
});
```

### Example: Customer

```javascript
import { Customer } from '@semantq/cartique/commerce';

// Different customer types
const retail = Customer.retail({
  id: 'cust_retail_001',
  name: 'Sarah M.',
  email: 'sarah@example.com'
});

const wholesale = Customer.wholesale({
  id: 'cust_wholesale_001',
  name: 'Wholesale Foods Inc.',
  email: 'orders@wholesalefoods.com'
});

console.log(retail.isRetail);     // true
console.log(wholesale.isWholesale); // true
```

### Example: Place

```javascript
import { Place } from '@semantq/cartique/commerce';

// Different regions
const za = Place.southAfrica();
const uk = Place.uk();
const us = Place.usa();

console.log(za.taxRate);        // 0.15 (15% VAT)
console.log(za.currency);       // 'ZAR'
console.log(uk.taxRate);        // 0.20 (20% VAT)
console.log(us.taxRate);        // 0 (Varies by state)
```

### Example: Context (Promotion)

```javascript
import { Context } from '@semantq/cartique/commerce';

const blackFriday = new Context({
  id: 'promo_black_friday',
  name: 'Black Friday 2026',
  type: 'promotion',
  injects: ['pricing.promotion'],
  metadata: {
    type: 'percentage',
    value: 20,
    conditions: {
      activeFrom: '2024-01-01T00:00:00Z',
      activeTo: '2030-12-31T23:59:59Z',
      minQuantity: 1
    }
  }
});
```

---

## 3. Persistence Layer (`src/persistence/`)

### Purpose
Load data from the **source of truth** (fixtures, database, API) and transform it into commerce objects.

### Components

| File | Purpose | Example |
|------|---------|---------|
| **fixtures/** | Temporary data source (development) | Botaniq products, customers |
| **repositories/** | Load data and build aggregates | ProductRepository.loadById(9) |
| **aggregates/** | Persistence aggregates | LoadedProduct { product, variants, pricingRules } |
| **mappers/** | Transform aggregates → commerce objects | SellableMapper.fromLoadedProduct() |

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERSISTENCE FLOW                                  │
│                                                                           │
│  Fixtures (JSON)                                                          │
│       │                                                                   │
│       ▼                                                                   │
│  Repository.loadById(9)                                                  │
│       │                                                                   │
│       ▼                                                                   │
│  LoadedProduct { product, variants, pricingRules, inventory, reviews }   │
│       │                                                                   │
│       ▼                                                                   │
│  SellableMapper.fromLoadedProduct()                                       │
│       │                                                                   │
│       ▼                                                                   │
│  Sellable (commerce object)                                              │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Example: ProductRepository

```javascript
import { ProductRepository } from '@semantq/cartique/persistence';

// Load a product by ID
const loaded = ProductRepository.loadById(9);
console.log(loaded.product.title);     // "Organic Chia Seeds"
console.log(loaded.variants.length);   // 4
console.log(loaded.pricingRules.length); // 7

// Load by slug
const bySlug = ProductRepository.loadBySlug('organic-chia-seeds');
console.log(bySlug.product.id);        // 9

// Load all products
const all = ProductRepository.loadAll();
console.log(all.length);                // 2
```

### Example: SellableMapper

```javascript
import { ProductRepository, SellableMapper } from '@semantq/cartique/persistence';

const loaded = ProductRepository.loadById(9);
const sellable = SellableMapper.fromLoadedProduct(loaded);

console.log(sellable.title);        // "Organic Chia Seeds"
console.log(sellable.basePrice);    // 140
console.log(sellable.variants.length); // 4
console.log(sellable.inventory);    // 260 (total across all variants)
```

---

## 4. Engine Layer (`src/engine/`)

### Purpose
Execute the resolution pipeline to produce a `CommercialDecision`.

### Components

| File | Purpose | Example |
|------|---------|---------|
| **ResolutionEngine.js** | Orchestrates the pipeline | Runs resolvers in sequence |
| **resolvers/VariantResolver.js** | Finds matching variant | weight: '1kg' → variant 104 |
| **resolvers/PricingResolver.js** | Applies pricing rules | Base → Wholesale → Bulk |
| **resolvers/PromotionResolver.js** | Creates adjustments | 20% off → -R56 adjustment |
| **resolvers/TaxResolver.js** | Calculates tax | 15% VAT → R42 |
| **resolvers/ShippingResolver.js** | Calculates shipping | Standard → R50 |
| **strategies/** | Composition strategies | Bundle, Package, Kit, Collection |
| **rules/** | Pricing rules (placeholder) | Future extension |

### Resolver Contract

```javascript
// Every resolver follows this pattern
resolve(state) {
  // 1. Read from state (immutable)
  // 2. Compute (pure logic)
  // 3. Return ResolutionPatch

  return ResolutionPatch.success({
    resolved: {},      // Additional data for downstream resolvers
    items: [],         // ResolutionItem[]
    adjustments: [],   // Adjustment[]
    journalEntries: [] // Audit trail
  });
}
```

### Example: Complete Resolution

```javascript
import { ProductRepository, SellableMapper } from '@semantq/cartique/persistence';
import { Customer, Place } from '@semantq/cartique/commerce';
import { ResolutionEngine } from '@semantq/cartique/engine';
import { 
  VariantResolver, 
  PricingResolver, 
  PromotionResolver, 
  TaxResolver, 
  ShippingResolver 
} from '@semantq/cartique/engine/resolvers';

// 1. Load data
const loaded = ProductRepository.loadById(9);
const sellable = SellableMapper.fromLoadedProduct(loaded);
const customer = Customer.wholesale({ id: 'cust_001', name: 'Wholesale Foods' });
const place = Place.southAfrica();

// 2. Create engine
const engine = new ResolutionEngine({
  resolvers: [
    new VariantResolver(),
    new PricingResolver(),
    new PromotionResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});

// 3. Resolve
const decision = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 12,
    selections: { weight: '1kg' }
  },
  contexts: []
});

// 4. Output
console.log(`Total: R${decision.total}`);
console.log(`Subtotal: R${decision.subtotal}`);
console.log(`Tax: R${decision.taxAmount}`);
console.log(`Shipping: R${decision.shippingAmount}`);
console.log(`Adjustments: ${decision.adjustments.length}`);
```

---

## 5. Commerce Scenarios Across Industries

### Scenario 1: Health & Wellness (Botaniq Chia Seeds)

```javascript
// Product: Chia Seeds with weight variants
const chiaSeeds = new Sellable({
  id: 'prod_chia_001',
  title: 'Organic Chia Seeds',
  variants: [
    { id: '100g', price: 25, inventory: 100 },
    { id: '250g', price: 45, inventory: 80 },
    { id: '500g', price: 80, inventory: 50 },
    { id: '1kg', price: 140, wholesale: 120, bulk: [{ min: 10, price: 100 }], inventory: 30 }
  ]
});

// Resolution: Wholesale customer buys 12 × 1kg
// Result: R100/unit × 12 = R1,200
```

### Scenario 2: Fashion (T-Shirts)

```javascript
// Product: T-Shirt with size + color variants
const tShirt = new Sellable({
  id: 'prod_tshirt_001',
  title: 'Premium Cotton T-Shirt',
  variants: [
    { id: 's_red', size: 'S', color: 'Red', price: 300, inventory: 50 },
    { id: 'm_red', size: 'M', color: 'Red', price: 300, inventory: 40 },
    { id: 'l_red', size: 'L', color: 'Red', price: 320, inventory: 30 },
    { id: 's_blue', size: 'S', color: 'Blue', price: 300, inventory: 45 },
    { id: 'm_blue', size: 'M', color: 'Blue', price: 300, inventory: 35 },
    { id: 'l_blue', size: 'L', color: 'Blue', price: 320, inventory: 25 }
  ]
});

// Resolution: Retail customer buys 2 × M Blue
// Result: R300 × 2 = R600
```

### Scenario 3: Automotive (Car Configurator)

```javascript
// Product: Car with trim + options
const car = new Sellable({
  id: 'prod_car_001',
  title: 'Luxury Sedan',
  variants: [
    { id: 'base', trim: 'Base', transmission: 'Manual', price: 280000 },
    { id: 'premium', trim: 'Premium', transmission: 'Automatic', price: 350000 },
    { id: 'luxury', trim: 'Luxury', transmission: 'Automatic', price: 420000 }
  ],
  metadata: {
    options: [
      { id: 'towbar', label: 'Tow Bar', price: 5000 },
      { id: 'canopy', label: 'Canopy', price: 15000 },
      { id: 'rubber_mats', label: 'Rubber Mats', price: 2000 }
    ]
  }
});

// Resolution: Corporate customer buys 5 × Premium + Tow Bar + Rubber Mats
// Result: (350000 + 5000 + 2000) × 5 = R1,785,000
```

### Scenario 4: Subscription (SaaS)

```javascript
// Product: CRM Subscription with plans
const crmPlan = new Sellable({
  id: 'prod_crm_001',
  title: 'CRM Subscription',
  variants: [
    { id: 'starter', plan: 'Starter', price: 99, interval: 'monthly' },
    { id: 'business', plan: 'Business', price: 299, interval: 'monthly' },
    { id: 'enterprise', plan: 'Enterprise', price: 999, interval: 'monthly' }
  ],
  metadata: {
    yearlyDiscount: 0.15  // 15% off yearly
  }
});

// Resolution: Enterprise customer buys yearly subscription
// Result: 999 × 12 × 0.85 = R10,189.80
```

### Scenario 5: Herbal/Wellness (Soursop Leaves)

```javascript
// Product: Soursop Leaves with bulk pricing
const soursop = new Sellable({
  id: 'prod_soursop_001',
  title: 'Organic Soursop Leaves',
  variants: [
    { 
      id: '50g', 
      price: 80, 
      wholesale: 68,
      bulk: [
        { min: 10, price: 60 },
        { min: 50, price: 50 }
      ],
      inventory: 40 
    }
  ]
});

// Resolution: Wholesale customer buys 50 × 50g
// Result: R50 × 50 = R2,500
```

---

## 6. The Resolution Pipeline in Detail

### Step 1: VariantResolver

```
Input:  { selections: { weight: '1kg' } }
Process: Find variant matching all selections
Output: { items: [ResolutionItem], resolved: { selections: { variant: {...} } } }
```

### Step 2: PricingResolver

```
Input:  { items: [ResolutionItem], customer: { group: 'wholesale' }, quantity: 12 }
Process: Apply base → wholesale → bulk pricing
Output: { resolved: { pricing: { unitPrice: 100, subtotal: 1200 } } }
```

### Step 3: PromotionResolver

```
Input:  { contexts: [BlackFriday], resolved: { pricing: { subtotal: 1200 } } }
Process: Check eligibility → calculate discount → create adjustment
Output: { adjustments: [Adjustment { amount: -240 }] }
```

### Step 4: TaxResolver

```
Input:  { place: { taxRate: 0.15 }, resolved: { pricing: { subtotal: 1200 } } }
Process: subtotal × taxRate = 180
Output: { resolved: { tax: { rate: 0.15, amount: 180 } } }
```

### Step 5: ShippingResolver

```
Input:  { place: { shippingCost: 50 } }
Process: Standard shipping = 50
Output: { resolved: { shipping: { method: 'standard', amount: 50 } } }
```

### Final: CommercialDecision

```
{
  items: [ResolutionItem],
  adjustments: [Adjustment { amount: -240 }],
  totals: {
    subtotal: 1200,
    tax: 180,
    shipping: 50,
    total: 1190
  },
  journal: ResolutionJournal,
  valid: true
}
```

---

## 7. Key Design Decisions

### Decision 1: Immutability

All commerce objects are immutable. This ensures:

- ✅ No accidental mutations
- ✅ Complete audit trail
- ✅ Deterministic replay
- ✅ Thread safety

### Decision 2: Separation of Concerns

- **Persistence** → Source of truth
- **Commerce Model** → Immutable facts
- **Resolution Engine** → Pure computation
- **Commercial Decision** → Immutable output

### Decision 3: Resolver Independence

- Each resolver answers exactly one question
- No resolver knows about other resolvers
- No resolver mutates state
- The engine composes resolvers

### Decision 4: Audit Trail

Every decision is recorded in the `ResolutionJournal`:

```
✅ Variant selected: 1kg
✅ Pricing applied: R140 → R120 → R100
✅ Promotion applied: Black Friday 20% off
✅ Tax applied: 15% VAT
✅ Shipping applied: R50
```

---

## 8. Future Extensions

### Resolvers to Add

| Resolver | Purpose | Priority |
|----------|---------|----------|
| **InventoryResolver** | Check stock availability | High |
| **EligibilityResolver** | Check customer eligibility | Medium |
| **CompositionResolver** | Handle bundles and kits | Medium |
| **FulfillmentResolver** | Determine fulfillment method | Medium |

### Adapters to Build

| Adapter | Purpose | Priority |
|---------|---------|----------|
| **REST API** | HTTP interface | High |
| **Prisma** | Database persistence | High |
| **Shopify** | Shopify integration | Medium |
| **Commerce Layer** | Commerce Layer integration | Low |

---

## 9. Integration Guide

### Basic Usage

```javascript
import { 
  ProductRepository, 
  SellableMapper 
} from '@semantq/cartique/persistence';

import { Customer, Place } from '@semantq/cartique/commerce';

import { ResolutionEngine } from '@semantq/cartique/engine';
import { 
  VariantResolver, 
  PricingResolver, 
  PromotionResolver, 
  TaxResolver, 
  ShippingResolver 
} from '@semantq/cartique/engine/resolvers';

// 1. Load data
const loaded = ProductRepository.loadById(9);
const sellable = SellableMapper.fromLoadedProduct(loaded);
const customer = Customer.retail({ id: 'cust_001' });
const place = Place.southAfrica();

// 2. Create engine
const engine = new ResolutionEngine({
  resolvers: [
    new VariantResolver(),
    new PricingResolver(),
    new PromotionResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});

// 3. Resolve
const decision = engine.resolve({
  sellable,
  customer,
  place,
  configuration: { quantity: 1, selections: { weight: '1kg' } },
  contexts: []
});

// 4. Use result
console.log(decision.total);
console.log(decision.journal.format());
```

### Custom Resolver

```javascript
import { ResolutionPatch } from '@semantq/cartique/core';

class CustomResolver {
  resolve(state) {
    // Read from state
    const items = state.items || [];
    
    // Compute
    const result = items.map(item => {
      // Custom logic
    });
    
    // Return patch
    return ResolutionPatch.success({
      resolved: { custom: result },
      journalEntries: [{
        resolver: 'CustomResolver',
        capability: 'custom',
        decision: 'applied',
        reason: 'Custom logic applied'
      }]
    });
  }
}

// Register
const engine = new ResolutionEngine({
  resolvers: [
    new VariantResolver(),
    new CustomResolver(),
    new PricingResolver()
  ]
});
```

---

## 10. Performance Considerations

### Memory

- All objects are immutable → structural sharing
- ResolutionState is frozen → no accidental copies
- ResolutionItems are small → efficient

### Speed

- Resolvers are pure functions → cacheable
- No database calls in resolvers → no I/O
- Deterministic → predictable performance

### Scalability

- Stateless kernel → can run anywhere
- No side effects → easy to distribute
- Pure functions → easy to parallelize

---

## 11. Security Considerations

### Input Validation

- All inputs are validated at the engine boundary
- Sellable, Customer, Configuration are validated
- Invalid inputs produce a `CommercialDecision` with `valid: false`

### Data Integrity

- All objects are immutable → no tampering
- Audit journal records every decision → complete traceability
- CommercialDecision is a legal record → immutable

### Access Control

- Kernel has no access control logic
- Access control is handled by the application
- Customer object contains group/segment for pricing

---

## 12. Testing Strategy

### Unit Tests

Each resolver is tested in isolation:

```javascript
test('PricingResolver applies wholesale discount', () => {
  const state = createState({ customer: { group: 'wholesale' } });
  const patch = pricingResolver.resolve(state);
  expect(patch.resolved.pricing.unitPrice).toBe(120);
});
```

### Integration Tests

Full pipeline tests:

```javascript
test('Complete resolution for wholesale 12 × 1kg chia', () => {
  const decision = engine.resolve({ ... });
  expect(decision.total).toBe(1190);
  expect(decision.journal.entries.length).toBe(5);
});
```

### Acceptance Tests

End-to-end scenarios:

```javascript
test('Botaniq: Wholesale customer buys 12 × 1kg Chia during Black Friday', () => {
  // Setup
  // Execute
  // Assert
});
```

---

## 13. Glossary

| Term | Definition |
|------|------------|
| **Sellable** | Anything that can be sold (product, bundle, service) |
| **Variant** | Specific configuration of a sellable |
| **Resolution** | The process of computing commercial truth |
| **CommercialDecision** | Immutable output of the resolution engine |
| **Adjustment** | A modification to price (discount, surcharge) |
| **Journal** | Audit trail of all decisions |
| **Resolver** | A pure function that computes one aspect of the decision |
| **Patch** | Immutable change returned by a resolver |
| **Context** | Commercial conditions (promotion, season) |

---

## 14. Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2024-12 | Initial release |
| v1.1 | 2025-01 | Added PromotionResolver |
| v1.2 | 2025-02 | Added Audit Journal |

---

## 15. Conclusion

Cartique is a **commerce decision kernel**. It takes commercial intent and produces commercial truth. It is:

- ✅ **Deterministic** — Same inputs → same outputs
- ✅ **Immutable** — No mutation, complete audit trail
- ✅ **Extensible** — New resolvers without changing the kernel
- ✅ **Database-agnostic** — Works with any data source
- ✅ **Framework-agnostic** — Works with any application

The engine is complete. The architecture is frozen. The future is bright. 🚀