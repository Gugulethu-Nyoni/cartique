/**
 * ============================================================
 * @semantq/cartique/compiler/resolvers
 * ============================================================
 *
 * Resolver: Context
 * Purpose: Resolve active contexts and inject capabilities
 * ============================================================
 */

export class ContextResolver {
  resolve(state) {
    const activeContexts = [];
    const injectedCapabilities = [];

    for (const context of state.contexts) {
      if (this._isActive(context, state)) {
        activeContexts.push(context);
        if (context.injects) {
          injectedCapabilities.push(...context.injects);
        }
      }
    }

    state.resolved.contexts = activeContexts;
    state.resolved.capabilities = injectedCapabilities;

    // Add active contexts to metadata for audit
    state.metadata.activeContexts = activeContexts.map(c => c.id);

    return state;
  }

  _isActive(context, state) {
    const activation = context.activation;

    if (!activation) return false;

    switch (activation.type) {
      case 'always':
        return true;

      case 'date-range':
        return this._isDateRangeActive(activation, state);

      case 'customer-group':
        return this._isCustomerGroupActive(activation, state);

      case 'recurring':
        return this._isRecurringActive(activation, state);

      default:
        return false;
    }
  }

  _isDateRangeActive(activation, state) {
    const now = state.metadata.now || new Date();
    const currentDate = new Date(now);
    const startDate = new Date(activation.startsAt);
    const endDate = new Date(activation.endsAt);

    return currentDate >= startDate && currentDate <= endDate;
  }

  _isCustomerGroupActive(activation, state) {
    const customerGroup = state.customer?.group || state.customer?.persona;
    return customerGroup === activation.group;
  }

  _isRecurringActive(activation, state) {
    const now = state.metadata.now || new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];

    return activation.weekday === currentDay;
  }
}
