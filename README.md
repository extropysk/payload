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

const payload = new Payload<Config['collections']>({ baseUrl: 'http://localhost:3000' });
```

## Config
- `baseUrl` - Payload CMS base url

## Params
- [Base Params](docs/BASE_PARAMS.md)
- [Find Params](docs/FIND_PARAMS.md)

## Methods
### find
```
const categories = await payload.find('categories',
  {
    sort: 'name'
  }
)
```

### findByID
```
const category = await payload.findByID('categories', '507f191e810c19729de860ea',
  {
    depth: 0
  }
)
```

### create
```
const category = await payload.create('categories',
  {
    name: 'shirts'
  }
)
```

### update 
```
const category = await payload.update('categories', '507f191e810c19729de860ea',
  {
    name: 'skirts'
  }
)
```
