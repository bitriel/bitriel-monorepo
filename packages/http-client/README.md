# @bitriel/http-client

Shared HTTP helpers built on top of [axios](https://axios-http.com/).

## Usage

```ts
import { httpClient, attachAuthToken } from '@bitriel/http-client'

attachAuthToken(httpClient, () => localStorage.getItem('token') ?? undefined)

const { data } = await httpClient.get('/health')
```

Use `createHttpClient` to build scoped instances when you need different base URLs or headers.
