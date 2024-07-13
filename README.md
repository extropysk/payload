# Payload API

The Payload API gives you the ability to execute the same operations that are available through REST.

## Installation
`yarn add @extropysk/payload`
`npm install @extropysk/payload`
`pnpm install @extropysk/payload`

## Get Started
```
import { Config } from './payload-types'
import { Payload } from '@extropysk/payload'

const payload = new Payload<Config['collections']>({ baseUrl: PAYLOAD_CMS_URL });
```

## Params
- [Base Params](docs/BASE_PARAMS.md)
- [Find Params](docs/FIND_PARAMS.md)
