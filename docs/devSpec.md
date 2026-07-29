# Cartique

## Architecture & Development Guide

### Version 1.0

---

# 1. Introduction

## What is Cartique?

**Cartique is a deterministic commerce decision engine.**

Its job is simple.

It accepts commerce information as input and produces a single immutable **CommercialDecision** as output.

Everything else exists to either provide the engine with data or consume the decision it produces.

Cartique is **not**:

* an ecommerce platform
* a CMS
* an inventory system
* a payment gateway
* a shipping system
* an ORM
* a database

It is the layer that sits in the middle of all of them.

---

# 2. The Problem

Most commerce platforms evolve into tightly coupled systems.

Pricing becomes embedded inside products.

Discount logic lives inside checkout.

Shipping rules live somewhere else.

Tax calculations appear in multiple places.

Inventory affects pricing.

The UI begins making business decisions.

Eventually every component depends on every other component.

Adding one business rule means modifying several different parts of the application.

Over time this becomes difficult to maintain.

---

# 3. Our Solution

Cartique separates commerce into three independent layers.

```
Data
↓

Commerce Decision

↓

Presentation
```

Each layer has one responsibility.

## Data

Stores facts.

Examples

* Products
* Variants
* Customers
* Categories
* Inventory
* Promotions
* Reviews

The data layer never computes prices.

---

## Engine

Computes commerce decisions.

Given the same input it will always produce the same output.

No database.

No HTTP.

No Prisma.

No network calls.

Pure computation.

---

## UI

Displays the CommercialDecision.

The UI never calculates:

* prices
* VAT
* discounts
* shipping
* totals

It only renders what the engine already decided.

---

# 4. The Complete Picture

```
                    DATABASE

          Products
          Customers
          Inventory
          Promotions
          Categories

                    │
                    ▼

            Repository Layer

                    │
                    ▼

              Commerce Model

                    │
                    ▼

           Resolution Engine

    Variant
        ↓
    Pricing
        ↓
    Promotion
        ↓
    Tax
        ↓
    Shipping

                    │
                    ▼

         CommercialDecision

                    │
                    ▼

          Website / POS / Mobile
```

This flow should never be reversed.

The UI never bypasses the engine.

The engine never bypasses repositories.

Repositories never know about the UI.

---

# 5. Project Structure

```
src/

catalog/
commerce/
core/
engine/
persistence/
query/
rules/
ui/
```

Every folder has one responsibility.

---

## commerce/

Contains immutable commerce objects.

Examples

Clothing

```
Nike Air Max
```

Cars

```
Toyota Hilux
```

Health Products

```
Organic Chia Seeds
```

Digital Products

```
JavaScript eBook
```

Online Course

```
Mastering Shopify
```

Every one of these becomes a **Sellable**.

Different industries.

Same model.

---

## core/

Contains reusable value objects.

Examples

```
Money
Quantity
Identifier
Adjustment
Diagnostics
CommercialDecision
```

These classes know nothing about ecommerce.

Money is simply Money.

---

## engine/

The heart of Cartique.

Every resolver has one responsibility.

```
VariantResolver

↓

PricingResolver

↓

PromotionResolver

↓

TaxResolver

↓

ShippingResolver
```

Each resolver reads state.

Computes a decision.

Returns a ResolutionPatch.

Nothing is mutated.

---

## persistence/

Temporary source of commerce data.

Today

```
Fixtures
```

Tomorrow

```
Prisma
```

Later

```
REST APIs

ERP

SAP

Supplier APIs
```

The engine never changes.

Only the repository changes.

---

## query/

Used for browsing.

Examples

* Search
* Categories
* Filters
* Facets
* Collections

Query answers

> What products exist?

The engine answers

> What should happen?

These are completely different responsibilities.

---

## ui/

Displays results.

Examples

React

Semantq

Vue

Mobile

POS

The UI simply renders the CommercialDecision.

---

# 6. Commerce Examples

## Clothing Store

Customer selects

```
Nike Air Max

Size 10

Black

Quantity 2
```

The engine determines

* correct variant
* selling price
* discount
* VAT
* shipping

The UI displays the result.

---

## Herbal Store

Customer buys

```
12 × 1kg Organic Chia Seeds
```

Customer belongs to

```
Wholesale
```

The engine applies

* wholesale pricing
* bulk pricing
* promotions
* VAT
* shipping

---

## Car Dealer

Customer configures

```
Toyota Hilux

Automatic

White

Tow Bar
```

The engine calculates

* selected configuration
* promotional pricing
* taxes
* delivery

Same engine.

Different data.

---

## Digital Store

Customer purchases

```
JavaScript Masterclass PDF
```

No warehouse.

No shipping.

No inventory reservation.

The ShippingResolver simply returns **No Change**.

The engine still produces a CommercialDecision.

---

# 7. Different Commerce Models

Cartique is designed to support multiple business models without changing the engine.

## Traditional Ecommerce

```
Warehouse

↓

Pack

↓

Ship
```

---

## Dropshipping

Supplier owns inventory.

Supplier ships directly to the customer.

Cartique still calculates

* selling price
* promotions
* taxes

Shipping is determined using supplier shipping rules instead of warehouse rules.

---

## Digital Commerce

Examples

* eBooks
* Software
* Music
* Online Courses

Characteristics

* no physical inventory
* no shipping
* immediate fulfillment

The engine simply skips unnecessary work.

---

## Marketplace

Multiple suppliers.

One cart.

One CommercialDecision.

---

## Services

Examples

* Consulting
* Coaching
* Installations
* Training

No warehouse.

No stock.

Still a Sellable.

---

# 8. Current Status

## Complete

* Core Value Objects
* Commerce Model
* Resolution Engine
* Variant Resolver
* Pricing Resolver
* Promotion Resolver
* Tax Resolver
* Shipping Resolver
* Commercial Decision
* Audit Journal
* Persistence Layer
* Repository Pattern
* Acceptance Tests

The commerce engine is operational.

---

## Outstanding

These are enhancements, not missing architecture.

* InventoryResolver
* EligibilityResolver
* CompositionResolver
* FulfillmentResolver

These should only be implemented when real business requirements require them.

---

## Future Adapters

The persistence layer can later connect to

* Prisma
* REST APIs
* Shopify
* WooCommerce
* Medusa
* Commerce Layer
* Custom ERP
* Supplier APIs

The engine will remain unchanged.

---

# 9. The Biggest Design Decision

Most commerce systems store business logic everywhere.

Products know pricing.

Orders know discounts.

Checkout knows shipping.

Payments know tax.

Eventually every module depends on every other module.

Cartique takes the opposite approach.

Everything becomes one decision.

```
CommercialDecision
```

Every resolver contributes to that decision.

Nothing bypasses it.

This keeps the architecture predictable, testable and extensible.

---

# 10. Development Roadmap

## Phase 1 — Core Engine

Completed.

The engine can now calculate a complete commercial decision for a standard ecommerce transaction.

---

## Phase 2 — Stabilization

Current focus.

* Improve documentation
* Increase acceptance test coverage
* Standardize resolver contracts
* Remove technical debt
* Improve diagnostics

---

## Phase 3 — Adapters

Replace fixtures with real data sources.

Examples

* Prisma
* REST APIs
* ERP Systems
* Supplier APIs

No engine changes required.

---

## Phase 4 — Storefront

Build user-facing applications.

Examples

* Semantq Storefront
* Mobile Commerce
* POS
* Admin Dashboard

These applications consume CommercialDecision objects.

---

## Phase 5 — Enterprise Commerce

Future enhancements.

* Marketplace
* Dropshipping
* Subscriptions
* Loyalty
* Multi-Warehouse
* Multi-Currency
* Multi-Tenant Commerce

Each capability becomes another resolver rather than changing the existing engine.

---

# Final Principle

Cartique exists to make commerce decisions—not to store commerce data or render user interfaces.

The database owns the facts.

The engine owns the business logic.

The UI owns the presentation.

As long as those three responsibilities remain separate, Cartique can evolve from a simple ecommerce engine into a commerce platform capable of powering retail stores, digital products, marketplaces, POS systems, dropshipping businesses and enterprise commerce without changing its core architecture.

That separation is the foundation of Cartique.



# Added

This version is significantly cleaner than the previous technical specification. It is now closer to a **handover document for a developer joining the project after a 3–6 month pause**.

I would make only a few final architectural refinements before declaring this **Cartique Architecture & Development Guide v1.0 frozen**.

The main changes are not about adding features; they are about making sure the written architecture perfectly matches the philosophy.

---

# Recommended Refinements

## 1. Clarify the Three-Layer Model

The current:

```
Data
↓

Commerce Decision

↓

Presentation
```

is conceptually correct, but "Commerce Decision" is not a layer. It is the **output of the engine**.

A clearer architecture:

```
                    DATA LAYER

        Products
        Customers
        Inventory
        Promotions
        Rules

                    │

                    ▼

             CARTIQUE KERNEL

        Commerce Model
        Resolution Engine
        Commercial Decision

                    │

                    ▼

             APPLICATION LAYER

        Storefront
        POS
        Mobile
        Admin
        Marketplace
```

This makes Cartique's position clearer.

It is not between "data and presentation".

It is the **decision infrastructure layer**.

---

# 2. Change "Engine Never Bypasses Repositories"

Current:

> The engine never bypasses repositories.

This slightly contradicts the philosophy:

> Kernel never talks to database.

The engine does not even know repositories exist.

Better:

> The engine never knows where data comes from. It receives normalized commerce objects only.

Meaning:

The engine does not know:

* Prisma
* SQL
* APIs
* files
* ERP systems

It only knows:

```
Sellable
Customer
Intent
Context
Place
```

---

# 3. Add Intent Object

This is the only major missing concept.

The document currently says:

> It accepts commerce information as input.

But commerce starts with **intent**.

Example:

Customer intent:

```
"I want 12 bags of 1kg Chia Seeds"
```

becomes:

```javascript
CommerceIntent {
 quantity:12,
 selections:{
   weight:"1kg"
 }
}
```

The complete flow becomes:

```
Customer Intent

+

Commerce Facts

+

Business Context

          ↓

Resolution Engine

          ↓

CommercialDecision
```

This aligns perfectly with the philosophy document.

---

# 4. Rename "Persistence Layer"

The section is correct, but the name creates confusion.

Because Cartique itself does not own persistence.

I would rename:

```
persistence/
```

to:

```
adapters/
```

Structure:

```
src/

core/
commerce/
engine/
adapters/
query/
ui/
```

Then:

```
adapters/

├── fixtures/
├── prisma/
├── shopify/
├── woocommerce/
├── erp/
└── supplier/
```

Reason:

Persistence is only one type of adapter.

An ERP API is not persistence.

A supplier API is not persistence.

---

# 5. Add Resolver Contract Section

This deserves a permanent place because it defines the entire extension model.

Add:

---

## Resolver Contract

Every resolver follows one rule:

```
Input:
CommercialState

↓

Processing:
Pure computation

↓

Output:
ResolutionPatch
```

A resolver:

* reads state
* calculates one decision
* returns a patch
* creates journal entries

A resolver never:

* modifies objects
* calls databases
* calls APIs
* knows about other resolvers

Example:

```
PricingResolver

Input:
Customer = Wholesale
Quantity = 100

Output:

Adjustment:
Wholesale Tier Discount

Journal:
"Applied wholesale pricing rule"
```

---

# 6. Strengthen CommercialDecision Definition

This is the heart of Cartique.

I would expand:

```
CommercialDecision

├── items
├── adjustments
├── totals
├── journal
├── diagnostics
└── metadata
```

Where metadata contains:

```
{
 engineVersion:"1.0",
 rulesVersion:"2026.01"
}
```

Why?

Commerce decisions may need to be replayed years later.

Example:

A customer disputes an invoice.

You need:

"What decision did Cartique make?"

Not:

"What would Cartique calculate today?"

---

# 7. Slightly Adjust Current Status

Currently:

> The commerce engine is operational.

I would change:

> The Cartique kernel architecture is operational.

Reason:

The engine is not the whole product.

The completed pieces are:

```
Core primitives
Commerce model
Resolution pipeline
Decision output
Audit system
Test framework
```

The ecosystem can still grow.

---

# Recommended Final Architecture Diagram

I would replace the current main diagram with:

```
                         CUSTOMER INTENT

                               │

                               ▼


                    COMMERCE CONTEXT

                               │

                               ▼


                    CARTIQUE KERNEL

        ┌─────────────────────────────────┐
        │                                 │
        │      Commerce Model             │
        │                                 │
        │      Sellable                   │
        │      Variant                    │
        │      Customer                   │
        │      Place                      │
        │      Context                    │
        │                                 │
        └─────────────────────────────────┘

                               │

                               ▼


                    Resolution Engine

                  Variant Resolver
                        ↓
                  Pricing Resolver
                        ↓
                  Promotion Resolver
                        ↓
                  Tax Resolver
                        ↓
                  Shipping Resolver


                               │

                               ▼


                  CommercialDecision

                               │

                               ▼


             Storefront | POS | Mobile | API
```

---

# Final Assessment

This document now communicates the most important idea:

Cartique is not competing with:

* Shopify
* WooCommerce
* Magento
* POS systems
* ERP systems

Those systems answer:

> "How do we run commerce?"

Cartique answers:

> "Given this situation, what is the correct commercial outcome?"

That is a much narrower and more defensible foundation.

The only additions I would make before freezing v1.0 are:

1. Add **CommerceIntent**
2. Rename persistence → adapters
3. Add resolver contract
4. Strengthen CommercialDecision metadata
5. Clarify kernel boundaries

After that, I would treat the architecture as frozen and move development attention toward adapters, tests, and real-world commerce scenarios.
