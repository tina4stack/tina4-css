/**
 * Frond v2 — Tina4 client-side DOM helper for server-rendered apps.
 *
 * Native-only AJAX, form handling, HTML injection, WebSocket, SSE,
 * and cookie management. Ships with tina4-css. Zero dependencies.
 *
 * Global: window.frond
 *
 * @module frond
 * @version 2.0.0
 */

// =====================================================================
// Types
// =====================================================================

/** HTTP method strings. */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Connection status for WebSocket and SSE. */
type ConnectionStatus = "connecting" | "open" | "closed" | "reconnecting";

/** Options for frond.request(). */
interface RequestOptions {
  /** HTTP method (default: "GET"). */
  method?: HttpMethod | string;
  /** Request body — objects auto-JSON.stringify, FormData sent as-is. */
  body?: unknown;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Success callback. */
  onSuccess?: (data: unknown, status: number, xhr: XMLHttpRequest) => void;
  /** Error callback. */
  onError?: (status: number, xhr: XMLHttpRequest) => void;
}

/** Callback shorthand for frond.request(). */
type RequestCallback = (data: unknown, status: number, xhr: XMLHttpRequest) => void;

/** Options for frond.ws(). */
interface WsOptions {
  /** Auto-reconnect on disconnect (default: true). */
  reconnect?: boolean;
  /** Initial reconnect delay in ms (default: 1000). */
  reconnectDelay?: number;
  /** Max reconnect delay in ms (default: 30000). */
  maxReconnectDelay?: number;
  /** Max reconnect attempts (default: Infinity). */
  maxReconnectAttempts?: number;
  /** WebSocket sub-protocols. */
  protocols?: string | string[];
  /** Called when connection opens. */
  onOpen?: () => void;
  /** Called when connection closes. */
  onClose?: (code: number, reason: string) => void;
  /** Called on error. */
  onError?: (event: Event) => void;
}

/** Managed WebSocket connection returned by frond.ws(). */
interface ManagedWebSocket {
  /** Current connection status. */
  status: ConnectionStatus;
  /** Send data (objects auto-JSON.stringify). */
  send: (data: unknown) => void;
  /** Listen for messages. Returns unsubscribe function. */
  on: (event: string, handler: (...args: unknown[]) => void) => () => void;
  /** Close connection (stops reconnect). */
  close: (code?: number, reason?: string) => void;
}

/** Options for frond.sse(). */
interface SseOptions {
  /** Auto-reconnect (default: true). */
  reconnect?: boolean;
  /** Initial reconnect delay in ms (default: 1000). */
  reconnectDelay?: number;
  /** Max reconnect delay in ms (default: 30000). */
  maxReconnectDelay?: number;
  /** Max reconnect attempts (default: Infinity). */
  maxReconnectAttempts?: number;
  /** Named SSE events to listen for. */
  events?: string[];
  /** Parse messages as JSON (default: true). */
  json?: boolean;
  /** Called when connection opens. */
  onOpen?: () => void;
  /** Called when connection closes. */
  onClose?: () => void;
  /** Called on error. */
  onError?: (event: Event) => void;
}

/** Managed SSE stream returned by frond.sse(). */
interface ManagedStream {
  /** Current connection status. */
  status: ConnectionStatus;
  /** Listen for messages. Returns unsubscribe function. */
  on: (event: string, handler: (data: unknown, eventName?: string) => void) => () => void;
  /** Close connection (stops reconnect). */
  close: () => void;
}

// =====================================================================
// Internal State
// =====================================================================

/** Bearer token managed across requests via the FreshToken header. */
let _token: string | null = null;

// =====================================================================
// frond.request() — Core HTTP
// =====================================================================

/**
 * Perform an XHR request.
 *
 * Automatically attaches the current Bearer token (if any) and refreshes
 * it from the `FreshToken` response header.
 *
 * @param url      - Request URL.
 * @param options  - RequestOptions object, or a simple callback function.
 */
function request(
  url: string,
  options?: RequestOptions | RequestCallback,
): void {
  let opts: RequestOptions;

  // Allow shorthand: frond.request("/api/foo", (data, status) => {})
  if (typeof options === "function") {
    opts = { onSuccess: options as RequestCallback };
  } else {
    opts = options || {};
  }

  const method = (opts.method || "GET").toUpperCase();
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  // Bearer token
  if (_token !== null) {
    xhr.setRequestHeader("Authorization", "Bearer " + _token);
  }

  // Extra headers
  if (opts.headers) {
    for (const key in opts.headers) {
      if (Object.prototype.hasOwnProperty.call(opts.headers, key)) {
        xhr.setRequestHeader(key, opts.headers[key]);
      }
    }
  }

  // Body handling
  let body: XMLHttpRequestBodyInit | null = null;
  if (opts.body !== undefined && opts.body !== null) {
    if (opts.body instanceof FormData) {
      body = opts.body;
    } else if (typeof opts.body === "object") {
      body = JSON.stringify(opts.body);
      xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    } else if (typeof opts.body === "string") {
      body = opts.body;
      xhr.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
    }
  }

  xhr.onload = function () {
    // Rotate token
    const freshToken = xhr.getResponseHeader("FreshToken");
    if (freshToken && freshToken !== "") {
      _token = freshToken;
    }

    // Parse response
    let content: unknown = xhr.response;
    try {
      content = JSON.parse(content as string);
    } catch {
      // Not JSON — keep raw
    }

    if (xhr.status >= 200 && xhr.status < 400) {
      if (opts.onSuccess) opts.onSuccess(content, xhr.status, xhr);
    } else {
      if (opts.onError) opts.onError(xhr.status, xhr);
    }
  };

  xhr.onerror = function () {
    if (opts.onError) opts.onError(xhr.status, xhr);
  };

  xhr.send(body);
}

// =====================================================================
// frond.inject() — HTML injection with script execution
// =====================================================================

/**
 * Parse an HTML string, inject it into a target element, and execute
 * any embedded <script> tags.
 *
 * @param html   - Raw HTML string.
 * @param target - DOM id to inject into, or null to return innerHTML.
 * @returns Processed innerHTML (empty string when injected into target).
 */
function inject(html: string, target: string | null): string {
  if (!html) return "";

  const parser = new DOMParser();
  const wrapped = html.includes("<html>")
    ? html
    : "<body>" + html + "</body></html>";
  const doc = parser.parseFromString(wrapped, "text/html");
  const body = doc.querySelector("body")!;

  // Extract scripts (they need to be re-created to execute)
  const scripts = body.querySelectorAll("script");
  scripts.forEach(function (s) {
    s.remove();
  });

  if (target !== null) {
    const el = document.getElementById(target);
    if (!el) return "";

    // Replace content
    if (body.children.length > 0) {
      el.replaceChildren.apply(el, Array.from(body.children) as any);
    } else {
      el.innerHTML = body.innerHTML;
    }

    // Execute scripts in context
    scripts.forEach(function (script) {
      const ns = document.createElement("script");
      ns.type = "text/javascript";
      ns.async = true;
      if (script.src) {
        ns.src = script.src;
      } else {
        ns.textContent = script.textContent;
      }
      el.appendChild(ns);
    });

    return "";
  }

  // No target — append scripts to body and return innerHTML
  scripts.forEach(function (script) {
    const ns = document.createElement("script");
    ns.type = "text/javascript";
    ns.async = true;
    ns.textContent = script.textContent;
    document.body.appendChild(ns);
  });

  return body.innerHTML;
}

// =====================================================================
// frond.load() — GET + inject
// =====================================================================

/**
 * Load a page or fragment via GET and inject into a target element.
 *
 * @param url      - URL to fetch.
 * @param target   - DOM id to inject into (default: "content").
 * @param callback - Optional callback with (processedHTML, rawData).
 */
function load(
  url: string,
  target?: string,
  callback?: (html: string, raw?: unknown) => void,
): void {
  const targetId = target || "content";

  request(url, {
    method: "GET",
    onSuccess: function (data, _status) {
      if (document.getElementById(targetId)) {
        const html = inject(data as string, targetId);
        if (callback) callback(html, data);
      } else {
        if (callback) callback(data as string);
      }
    },
  });
}

// =====================================================================
// frond.post() — POST + inject
// =====================================================================

/**
 * POST data to a URL and inject the response into a target element.
 *
 * @param url      - URL to POST to.
 * @param data     - Request body.
 * @param target   - DOM id to inject into.
 * @param callback - Optional callback with (processedHTML, rawData).
 */
function post(
  url: string,
  data: unknown,
  target?: string,
  callback?: (html: string, raw?: unknown) => void,
): void {
  const targetId = target || "content";

  request(url, {
    method: "POST",
    body: data,
    onSuccess: function (responseData: any) {
      let html = "";

      if (responseData && responseData.message !== undefined) {
        html = inject(responseData.message, targetId);
      } else if (document.getElementById(targetId)) {
        html = inject(responseData as string, targetId);
      } else {
        if (callback) callback(responseData as string);
        return;
      }

      if (callback) callback(html, responseData);
    },
  });
}

// =====================================================================
// frond.form — Form helpers
// =====================================================================

const form = {
  /**
   * Collect all form field values into a FormData object.
   *
   * Handles inputs, selects, textareas, file uploads (including
   * multi-file), checkboxes, and radio buttons. Updates formToken
   * hidden fields automatically.
   *
   * @param formId - DOM id of the form (without '#').
   * @returns Populated FormData instance.
   */
  collect: function (formId: string): FormData {
    const fd = new FormData();
    const elements = document.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("#" + formId + " select, #" + formId + " input, #" + formId + " textarea");

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLInputElement;

      // Inject current token into hidden formToken field
      if (el.name === "formToken" && _token !== null) {
        el.value = _token;
      }

      if (!el.name) continue;

      if (el.type === "file") {
        const files = el.files;
        if (files) {
          for (let f = 0; f < files.length; f++) {
            const file = files[f];
            if (file !== undefined) {
              let name = el.name;
              if (files.length > 1 && !name.includes("[")) {
                name = name + "[]";
              }
              fd.append(name, file, file.name);
            }
          }
        }
      } else if (el.type === "checkbox" || el.type === "radio") {
        if (el.checked) {
          fd.append(el.name, el.value);
        } else if (el.type !== "radio") {
          fd.append(el.name, "0");
        }
      } else {
        fd.append(el.name, el.value === "" ? "" : el.value);
      }
    }

    return fd;
  },

  /**
   * Collect form data and POST it to a URL. Inject response into target.
   *
   * @param formId   - DOM id of the form.
   * @param url      - URL to POST to.
   * @param target   - DOM id to inject response into (default: "message").
   * @param callback - Optional callback.
   */
  submit: function (
    formId: string,
    url: string,
    target?: string,
    callback?: (html: string, raw?: unknown) => void,
  ): void {
    const data = form.collect(formId);
    post(url, data, target || "message", callback);
  },

  /**
   * Load a form via the given action and inject response HTML.
   *
   * Accepts friendly names: "create", "edit" map to GET; "delete" maps
   * to DELETE.
   *
   * @param action  - HTTP method or friendly name.
   * @param url     - URL to fetch.
   * @param target  - DOM id to inject into (default: "form").
   * @param callback - Optional callback.
   */
  show: function (
    action: string,
    url: string,
    target?: string,
    callback?: (data: unknown) => void,
  ): void {
    let method = action.toUpperCase();
    if (action === "create" || action === "edit") method = "GET";
    if (action === "delete") method = "DELETE";

    const targetId = target || "form";

    request(url, {
      method: method,
      onSuccess: function (data: any) {
        let html = "";

        if (data && data.message !== undefined) {
          html = inject(data.message, targetId);
        } else if (document.getElementById(targetId)) {
          html = inject(data as string, targetId);
        } else {
          if (callback) callback(data);
          return;
        }

        if (callback) callback(html);
      },
    });
  },
};

// =====================================================================
// frond.ws() — WebSocket with auto-reconnect
// =====================================================================

/**
 * Create a managed WebSocket connection with auto-reconnect.
 *
 * @param url     - WebSocket URL (ws:// or wss://).
 * @param options - Connection options.
 * @returns Managed WebSocket interface.
 */
function wsConnect(url: string, options?: WsOptions): ManagedWebSocket {
  const opts: Required<WsOptions> = {
    reconnect: true,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    maxReconnectAttempts: Infinity,
    protocols: [],
    onOpen: function () {},
    onClose: function () {},
    onError: function () {},
    ...(options || {}),
  };

  let socket: WebSocket | null = null;
  let intentionalClose = false;
  let currentDelay = opts.reconnectDelay;
  let attempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  // Event listeners
  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {
    message: [],
    open: [],
    close: [],
    error: [],
  };

  const managed: ManagedWebSocket = {
    status: "connecting" as ConnectionStatus,

    send: function (data: unknown): void {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("[frond] WebSocket is not connected");
      }
      socket.send(typeof data === "string" ? data : JSON.stringify(data));
    },

    on: function (event: string, handler: (...args: unknown[]) => void): () => void {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return function () {
        const arr = listeners[event];
        const idx = arr.indexOf(handler);
        if (idx >= 0) arr.splice(idx, 1);
      };
    },

    close: function (code?: number, reason?: string): void {
      intentionalClose = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (socket) {
        socket.close(code || 1000, reason || "");
      }
      managed.status = "closed";
    },
  };

  function parseMessage(data: unknown): unknown {
    if (typeof data !== "string") return data;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  function scheduleReconnect(): void {
    if (!opts.reconnect || attempts >= opts.maxReconnectAttempts) return;
    attempts++;
    managed.status = "reconnecting";

    reconnectTimer = setTimeout(function () {
      reconnectTimer = null;
      connect();
    }, currentDelay);

    currentDelay = Math.min(currentDelay * 2, opts.maxReconnectDelay);
  }

  function connect(): void {
    managed.status = attempts > 0 ? "reconnecting" : "connecting";

    try {
      socket = new WebSocket(url, opts.protocols);
    } catch {
      managed.status = "closed";
      return;
    }

    socket.onopen = function () {
      managed.status = "open";
      attempts = 0;
      currentDelay = opts.reconnectDelay;
      opts.onOpen();
      for (const fn of listeners.open) fn();
    };

    socket.onmessage = function (event: MessageEvent) {
      const parsed = parseMessage(event.data);
      for (const fn of listeners.message) fn(parsed);
    };

    socket.onclose = function (event: CloseEvent) {
      managed.status = "closed";
      opts.onClose(event.code, event.reason);
      for (const fn of listeners.close) fn(event.code, event.reason);

      if (!intentionalClose) {
        scheduleReconnect();
      }
    };

    socket.onerror = function (event: Event) {
      opts.onError(event);
      for (const fn of listeners.error) fn(event);
    };
  }

  connect();
  return managed;
}

// =====================================================================
// frond.sse() — Server-Sent Events with auto-reconnect
// =====================================================================

/**
 * Create a managed SSE (EventSource) connection with auto-reconnect.
 *
 * @param url     - SSE endpoint URL.
 * @param options - Connection options.
 * @returns Managed stream interface.
 */
function sseConnect(url: string, options?: SseOptions): ManagedStream {
  const opts: Required<SseOptions> = {
    reconnect: true,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    maxReconnectAttempts: Infinity,
    events: [],
    json: true,
    onOpen: function () {},
    onClose: function () {},
    onError: function () {},
    ...(options || {}),
  };

  let source: EventSource | null = null;
  let intentionalClose = false;
  let currentDelay = opts.reconnectDelay;
  let attempts = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  // Event listeners
  const listeners: Record<string, Array<(data: unknown, eventName?: string) => void>> = {
    message: [],
    open: [],
    close: [],
    error: [],
  };

  const managed: ManagedStream = {
    status: "connecting" as ConnectionStatus,

    on: function (event: string, handler: (data: unknown, eventName?: string) => void): () => void {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return function () {
        const arr = listeners[event];
        const idx = arr.indexOf(handler);
        if (idx >= 0) arr.splice(idx, 1);
      };
    },

    close: function (): void {
      intentionalClose = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (source) {
        source.close();
        source = null;
      }
      managed.status = "closed";
    },
  };

  function parseData(raw: string): unknown {
    if (!opts.json) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  function dispatch(data: unknown, eventName: string | null): void {
    for (const fn of listeners.message) fn(data, eventName || undefined);
  }

  function scheduleReconnect(): void {
    if (!opts.reconnect || attempts >= opts.maxReconnectAttempts) return;
    attempts++;
    managed.status = "reconnecting";

    reconnectTimer = setTimeout(function () {
      reconnectTimer = null;
      connect();
    }, currentDelay);

    currentDelay = Math.min(currentDelay * 2, opts.maxReconnectDelay);
  }

  function connect(): void {
    managed.status = attempts > 0 ? "reconnecting" : "connecting";

    try {
      source = new EventSource(url);
    } catch {
      managed.status = "closed";
      return;
    }

    source.onopen = function () {
      managed.status = "open";
      attempts = 0;
      currentDelay = opts.reconnectDelay;
      opts.onOpen();
      for (const fn of listeners.open) fn(null);
    };

    source.onmessage = function (event: MessageEvent) {
      dispatch(parseData(event.data), null);
    };

    // Named events
    for (const name of opts.events) {
      source.addEventListener(name, function (e: Event) {
        dispatch(parseData((e as MessageEvent).data), name);
      });
    }

    source.onerror = function (event: Event) {
      opts.onError(event);
      for (const fn of listeners.error) fn(event);

      // EventSource.CLOSED = 2
      if (source && source.readyState === 2) {
        source = null;
        managed.status = "closed";
        opts.onClose();
        for (const fn of listeners.close) fn(null);

        if (!intentionalClose) {
          scheduleReconnect();
        }
      }
    };
  }

  connect();
  return managed;
}

// =====================================================================
// frond.cookie — Cookie helpers
// =====================================================================

const cookie = {
  /**
   * Set a browser cookie.
   *
   * @param name  - Cookie name.
   * @param value - Cookie value.
   * @param days  - Optional lifetime in days.
   */
  set: function (name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  },

  /**
   * Retrieve a cookie value by name.
   *
   * @param name - Cookie name.
   * @returns Cookie value, or null if not found.
   */
  get: function (name: string): string | null {
    const nameEQ = name + "=";
    const parts = document.cookie.split(";");
    for (let i = 0; i < parts.length; i++) {
      let c = parts[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  },

  /**
   * Delete a cookie by name.
   *
   * @param name - Cookie name.
   */
  remove: function (name: string): void {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  },
};

// =====================================================================
// frond.message() — Alert display
// =====================================================================

/**
 * Display a tina4-css dismissible alert in the #message element.
 *
 * @param text - Message text or HTML.
 * @param type - Alert type: "info" | "success" | "warning" | "danger" (default: "info").
 */
function message(text: string, type?: string): void {
  const el = document.getElementById("message");
  if (!el) return;
  const alertType = type || "info";
  el.innerHTML =
    '<div class="alert alert-' + alertType + ' alert-dismissible">' +
    text +
    '<button type="button" class="btn-close" data-t4-dismiss="alert">&times;</button>' +
    "</div>";
}

// =====================================================================
// frond.popup() — Centred popup window
// =====================================================================

/**
 * Open a centred popup window.
 *
 * @param url    - URL to open.
 * @param title  - Window title/name.
 * @param w      - Width in pixels.
 * @param h      - Height in pixels.
 * @returns Window reference, or null.
 */
function popup(url: string, title: string, w: number, h: number): Window | null {
  const dualLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const height = window.innerHeight || document.documentElement.clientHeight || screen.height;

  const zoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / zoom + dualLeft;
  const top = (height - h) / 2 / zoom + dualTop;

  const win = window.open(
    url,
    title,
    "directories=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes," +
      "width=" + (w / zoom) + ",height=" + (h / zoom) + ",top=" + top + ",left=" + left,
  );

  if (window.focus && win) win.focus();
  return win;
}

// =====================================================================
// frond.report() — Open PDF in new window
// =====================================================================

/**
 * Open a PDF report in a new window.
 *
 * @param url - URL or path to the PDF.
 */
function report(url: string): void {
  if (url.indexOf("No data available") >= 0) {
    window.alert("No data available for this report.");
    return;
  }
  window.open(
    url,
    "_blank",
    "toolbar=no,scrollbars=yes,resizable=yes,width=800,height=600,top=0,left=0",
  );
}

// =====================================================================
// Namespace object
// =====================================================================

const frond = {
  /** Core HTTP request. */
  request: request,
  /** GET + inject HTML into target element. */
  load: load,
  /** POST + inject HTML into target element. */
  post: post,
  /** Parse HTML string, inject into element, execute scripts. */
  inject: inject,
  /** Form helpers: collect, submit, show. */
  form: form,
  /** WebSocket with auto-reconnect. */
  ws: wsConnect,
  /** Server-Sent Events with auto-reconnect. */
  sse: sseConnect,
  /** Cookie helpers: get, set, remove. */
  cookie: cookie,
  /** Display alert message in #message element. */
  message: message,
  /** Open centred popup window. */
  popup: popup,
  /** Open PDF report in new window. */
  report: report,

  /** Current bearer token (read/write). */
  get token(): string | null {
    return _token;
  },
  set token(value: string | null) {
    _token = value;
  },
};

// =====================================================================
// Register on window
// =====================================================================

declare global {
  interface Window {
    frond: typeof frond;
  }
}

if (typeof window !== "undefined") {
  window.frond = frond;
}

export { frond };
export type {
  RequestOptions,
  RequestCallback,
  WsOptions,
  SseOptions,
  ManagedWebSocket,
  ManagedStream,
  ConnectionStatus,
  HttpMethod,
};
