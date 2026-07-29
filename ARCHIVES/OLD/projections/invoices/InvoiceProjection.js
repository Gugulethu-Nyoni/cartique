/**
 * ============================================================
 * @semantq/cartique/projections/invoices
 * ============================================================
 *
 * Projection: Invoice
 * Purpose: Transform checkout result for invoicing
 * ============================================================
 */

import { Money } from '../../core/index.js';

export class InvoiceProjection {
  /**
   * Project checkout result for invoice
   */
  static project(checkoutResult) {
    if (!checkoutResult) return null;

    const resolution = checkoutResult.resolution || {};
    const items = resolution.items || [];

    return {
      invoiceNumber: `INV-${checkoutResult.id}`,
      orderId: checkoutResult.id,
      date: checkoutResult.timestamp || new Date().toISOString(),
      customerId: resolution.customer?.id || 'unknown',
      customerName: resolution.customer?.name || 'Customer',
      lines: items.map((item, index) => ({
        id: `line-${index + 1}`,
        description: item.product?.title || item.product?.id || 'Product',
        quantity: item.quantity?.value || 1,
        unitPrice: item.pricing?.unitPrice?.amount || 0,
        total: item.pricing?.totalPrice?.amount || 0,
        variant: item.variant?.id || null,
        attributes: item.variant?.attributes || {}
      })),
      subtotal: checkoutResult.subtotal?.amount || 0,
      tax: checkoutResult.taxAmount?.amount || 0,
      taxRate: resolution.tax?.rate || 0,
      shipping: checkoutResult.shippingAmount?.amount || 0,
      total: checkoutResult.total?.amount || 0,
      currency: checkoutResult.totals?.subtotal?.currency || 'ZAR',
      paid: checkoutResult.status === 'completed',
      paymentTerms: '30 days',
      metadata: {
        resolution: resolution,
        resolvedAt: checkoutResult.timestamp
      }
    };
  }

  /**
   * Format invoice for PDF generation
   */
  static formatForPDF(invoice) {
    if (!invoice) return null;

    return {
      ...invoice,
      lines: invoice.lines.map(line => ({
        ...line,
        formattedTotal: `${invoice.currency} ${line.total.toFixed(2)}`,
        formattedUnitPrice: `${invoice.currency} ${line.unitPrice.toFixed(2)}`
      })),
      formattedSubtotal: `${invoice.currency} ${invoice.subtotal.toFixed(2)}`,
      formattedTax: `${invoice.currency} ${invoice.tax.toFixed(2)}`,
      formattedShipping: `${invoice.currency} ${invoice.shipping.toFixed(2)}`,
      formattedTotal: `${invoice.currency} ${invoice.total.toFixed(2)}`
    };
  }
}
