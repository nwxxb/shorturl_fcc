const request = require('supertest')
const app = require('../index.js')
const server = app.listen(process.env.port)

describe('Timestamp endpoint', () => {
  it('greets correctly', async () => {
    const res = await request(app)
		  .get('/api/hello')
    expect(res.status).toEqual(200)
    expect(res.body.greeting).toEqual('hello API')
  });

  it('correctly save url and alternative short url', async () => {
    const firstRes = await request(app)
		  .post('/api/shorturl')
		  .type('form')
		  .send({ url : "https://forum.freecodecamp.org/" })
    expect(firstRes.status).toEqual(201)
    expect(firstRes.body.original_url).toEqual("https://forum.freecodecamp.org/")
    expect(firstRes.body.short_url).toEqual(expect.any(Number))

    const secondRes = await request(app)
		  .get(`/api/shorturl/${firstRes.body.short_url}`)
    expect(secondRes.status).toEqual(303)
    expect(secondRes.headers["location"]).toMatch(/forum\.freecodecamp/)
  });

  it('not accepting invalid url', async () => {
    const res = await request(app)
		  .post('/api/shorturl')
		  .type('form')
		  .send({ url : "blinglbong" })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual("invalid url")
  });
});

server.close()
