import '@testing-library/jest-dom'

// Полифилл для Next.js Request в тестах
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      this._url = input;
      this.method = init?.method || 'GET';
      this.headers = new Map(Object.entries(init?.headers || {}));
      this._body = init?.body;
    }
    
    get url() {
      return this._url;
    }
    
    async json() {
      return JSON.parse(this._body);
    }
    
    async text() {
      return this._body;
    }
  };
}

// Полифилл для Next.js Response в тестах
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
    }
    
    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body);
      }
      return this.body;
    }
    
    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    }
    
    static json(data, init) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
    }
  };
}
