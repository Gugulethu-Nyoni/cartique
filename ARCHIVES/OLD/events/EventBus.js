/**
 * ============================================================
 * @semantq/cartique/events
 * ============================================================
 *
 * Module: EventBus
 * Purpose: Simple event bus for domain events
 * ============================================================
 */

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventType, handler) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(handler);
    return () => {
      const handlers = this.listeners.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index !== -1) handlers.splice(index, 1);
      }
    };
  }

  on(eventType, handler) {
    return this.subscribe(eventType, handler);
  }

  publish(event) {
    const eventType = event.type || event.constructor?.name;
    if (!eventType) throw new Error('Event must have a type');

    const handlers = this.listeners.get(eventType) || [];
    const wildcardHandlers = this.listeners.get('*') || [];

    [...handlers, ...wildcardHandlers].forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });

    return this;
  }

  clear() {
    this.listeners.clear();
    return this;
  }
}
