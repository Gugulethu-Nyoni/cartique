/**
 * ============================================================
 * Examples: Botaniq Personas
 * ============================================================
 */

import { createPersona } from '../../../src/commerce/personas/Persona.js';

export const Wholesale = createPersona({
  id: 'wholesale',
  name: 'Wholesale Customer',
  group: 'wholesale',
  metadata: { requiresApproval: true }
});

export const Retail = createPersona({
  id: 'retail',
  name: 'Retail Customer',
  group: 'retail',
  metadata: { requiresLogin: true }
});
