const html = `
  <h1>这是一个新标签页。</h1>
`;

const NEWTAB_RESPONSE = `
HTTP/1.1 200 OK
X-Powered-By: Zanj-Dosyago-Corporation
X-Blocked-Internally: Custom ad blocking
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Content-Type: text/html; charset=UTF-8
Content-Length: ${html.length}

${html}
`;

export default NEWTAB_RESPONSE;
