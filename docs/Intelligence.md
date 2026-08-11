# Cartique Commerce Intelligence Engine™

## Behaviour Analytics, Customer Intent Intelligence & Automated Commerce Intervention Platform

**Status:** Architecture Blueprint
**Implementation Status:** Planned
**Future Revision:** Implementation-driven refinement


# 1. Executive Summary

Cartique Commerce Intelligence Engine™ is the behavioural intelligence layer of the Cartique Commerce Platform.

While traditional commerce platforms focus primarily on transactional reporting:

* orders
* revenue
* products sold
* conversion rates

Cartique captures and interprets the complete customer commerce journey:

```
Discovery
    ↓
Search
    ↓
Navigation
    ↓
Product Evaluation
    ↓
Cart Formation
    ↓
Checkout Intent
    ↓
Purchase Decision
    ↓
Post-Purchase Behaviour
```

The system transforms raw storefront interactions into actionable commercial intelligence.

Core principle:

```
Customer Interaction + Context
            ↓
Behaviour Signal
            ↓
Intent Intelligence
            ↓
Commerce Action
```



# 2. Strategic Positioning

Cartique Commerce Intelligence Engine™ is not an analytics dashboard.

It is an operational intelligence system.

Traditional analytics answers:

> "What happened?"

Cartique answers:

> "Why did it happen, what does it mean, and what should the merchant do next?"



Example:

Traditional:

```
Product Views:
10,000

Add To Cart:
900

Sales:
120
```

Cartique:

```
Product:
Premium Linen Summer Dress


Behaviour:

10,000 views

2,400 searches containing:
"linen"
"summer"
"natural fabric"


1,100 customers added to cart


740 abandoned before checkout


Predicted reasons:

55%
Price sensitivity

25%
Shipping hesitation

20%
Browsing behaviour


Recommended actions:

✓ Create shipping promotion
✓ Trigger remarketing campaign
✓ Adjust product positioning
```



# 3. Architecture Overview

The Commerce Intelligence Engine consists of three layers.



# Layer 1 — Commerce Behaviour Event Engine

## Purpose

Capture all storefront interactions as immutable behavioural events.

The system records:

* customer actions
* anonymous visitor actions
* navigation patterns
* product engagement
* cart behaviour
* checkout behaviour



## Core Event Model

Concept:

```
Every customer interaction becomes an event.
```

Example:

```
PRODUCT_VIEW

SEARCH_EXECUTED

CATEGORY_VIEW

FILTER_APPLIED

PRODUCT_COMPARE

ADD_TO_CART

REMOVE_FROM_CART

CHECKOUT_STARTED

PAYMENT_STARTED

ORDER_COMPLETED

CART_ABANDONED
```



# 4. Behaviour Event Architecture

Future model:

```prisma
model StorefrontEvent {

 id Int @id @default(autoincrement())

 storeId Int?

 customerId Int?

 sessionId String


 eventType StorefrontEventType


 entityType String?

 entityId Int?


 route String?

 referrer String?


 metadata Json?


 createdAt DateTime @default(now())


 @@index([sessionId])

 @@index([customerId])

 @@index([eventType])

 @@index([createdAt])

}
```



# Event Types

```prisma
enum StorefrontEventType {

 PRODUCT_VIEW

 CATEGORY_VIEW

 SEARCH

 FILTER_APPLIED

 SORT_CHANGED


 PRODUCT_ADDED_TO_CART

 PRODUCT_REMOVED_FROM_CART


 CART_CREATED

 CHECKOUT_STARTED

 PAYMENT_STARTED

 ORDER_COMPLETED


 CUSTOMER_LOGIN

 CUSTOMER_LOGOUT


 CART_ABANDONED

}
```



# 5. Customer Journey Reconstruction

The engine reconstructs customer journeys.

Example:

```
Session #88392


09:01

Viewed Women's Category


09:03

Search:
"linen dress"


09:05

Viewed:

Summer Linen Dress


09:07

Viewed:

Blue Linen Dress


09:10

Added Variant:

Blue Linen Dress
Size M


09:12

Checkout Started


09:18

Exited


Status:

Checkout Abandoned
```



# 6. Commerce Intent Intelligence

The engine calculates customer intent.

Intent is derived from:

## Behaviour Signals

* search activity
* product views
* repeat visits
* cart actions
* checkout progression
* time spent
* product comparisons
* return behaviour



## Intent Classification

Customers are classified:

### Low Intent

Example:

```
Viewed one product

Left immediately
```



### Medium Intent

Example:

```
Multiple products viewed

Category browsing

No cart action
```



### High Intent

Example:

```
Added product

Started checkout

Returned later
```



### Purchase Intent

Example:

```
Payment initiated

Order not completed
```



# 7. Cart Intelligence System

## Cart Definition

A cart represents a temporary commercial intention.

A cart is not simply a collection of products.

It represents:

```
Customer Intent + Product Selection + Commercial Context
```



# Cart Lifecycle

```
PRODUCT DISCOVERY

        ↓

CART CREATED

        ↓

CART ACTIVE

        ↓

CHECKOUT STARTED

        ↓

PAYMENT INITIATED

        ↓

ORDER COMPLETED
```



# 8. Abandoned Cart Intelligence

## Definition

A cart becomes abandoned when:

```
Active Cart

+

No customer activity

+

Defined inactivity threshold exceeded
```



However, Cartique classifies abandonment.



# Abandonment Types

## Browsing Abandonment

Customer:

```
Added product

Never started checkout
```

Meaning:

Low commercial commitment.



## Checkout Abandonment

Customer:

```
Entered checkout

Did not complete payment
```

Meaning:

High purchase intent.



## Payment Abandonment

Customer:

```
Reached payment gateway

Payment failed or stopped
```

Meaning:

Critical recovery opportunity.



## Inventory Abandonment

Customer:

```
Wanted product

Variant unavailable
```

Meaning:

Operational issue.



## Pricing Abandonment

Customer:

```
Viewed shipping/payment information

Exited
```

Meaning:

Potential pricing friction.



# 9. Cart Recovery Engine

The system provides merchant interventions.



## Recovery Automation

Example rule:

```
IF

Cart abandoned

AND

Customer email exists

AND

Cart value > R1000


WAIT 2 hours


Send recovery message
```



# Supported Recovery Channels

Future integrations:

* Email
* WhatsApp
* SMS
* Push Notifications
* Retargeting audiences



# 10. Intelligent Merchant Actions

Cartique does not simply report problems.

It recommends actions.



Example:

```
Problem:

72 customers abandoned checkout


Analysis:

65% abandoned after shipping calculation


Recommendation:

Create free shipping threshold campaign
```



# 11. Merchant Intelligence Dashboard

Future dashboard:

```
Commerce Intelligence


Today's Behaviour


Visitors:
12,500


High Intent Customers:
842


Abandoned Carts:
220


Recoverable Revenue:
R85,400


Top Intent Products:


1. Linen Summer Dress

2. Premium Hoodie

3. Leather Handbag
```



# 12. AI Commerce Intelligence Layer

Future capability:

Predict:

* likely buyer
* likely abandonment
* discount sensitivity
* product demand
* customer lifetime value

Example:

```
Customer:

Sarah


Prediction:

82% purchase probability


Recommended action:

Do not discount

Offer free shipping instead
```



# 13. Integration With Cartique Architecture

Cartique will consist of two intelligence engines.



## Commerce Decision Kernel

Purpose:

Determine commercial truth.

```
Intent + Context

        ↓

Commercial Decision
```

Examples:

* pricing
* promotions
* tax
* shipping
* availability



## Commerce Intelligence Engine

Purpose:

Understand behaviour truth.

```
Interaction + Context

        ↓

Behaviour Intelligence
```

Examples:

* customer intent
* abandonment
* demand prediction
* recovery actions



Together:

```
Behaviour Intelligence

        +

Commerce Decision Kernel

        ↓

Adaptive Commerce Platform
```



# 14. Future Implementation Roadmap

## Phase 1

Behaviour event collection

* Event model
* Session tracking
* Product views
* Search tracking
* Cart events

## Phase 2

Commerce intelligence

* Intent scoring
* Customer journeys
* Abandonment detection

## Phase 3

Merchant interventions

* Recovery campaigns
* Automated messaging
* Recommendations

## Phase 4

AI commerce intelligence

* Predictive purchasing
* Dynamic merchandising
* Autonomous optimisation



# Final Architectural Position

Cartique Commerce Intelligence Engine™ transforms the storefront from a passive catalogue into an intelligent commerce system.

The storefront no longer only answers:

> "What products exist?"

It understands:

> "What customers want, why they hesitate, and how commerce decisions can be improved."



I would save this as:

```
docs/
 └── architecture/
      └── commerce-intelligence-engine.md
```

and treat it alongside:

```
commerce-decision-kernel.md
storefront-routing.md
commerce-domain-model.md
```

This is now a blueprint, not a feature request. Later implementation should update this document rather than replace it.
