# Payload SDK

The Payload SDK gives you the ability to execute the same operations that are available through REST.

## Installation
`npm install @extropysk/payload`

## Get Started
```
import { Config } from './payload-types'
import { Payload } from '@extropysk/payload'

const payload = new Payload<Config['collections']>({ baseUrl: 'http://localhost:3000' });
```

## Config
- `baseUrl` - Payload CMS base url

## Methods
All methods support parameters:
- `depth` - automatically populates relationships and uploads
- `locale` - retrieves document(s) in a specific locale

The find method supports the following additional parameters:
- `sort` - sort by field
- `where` - pass a where query to constrain returned documents
- `limit` - limit the returned documents to a certain number
- `page` - get a specific page of documents

See [Querying your Documents](https://payloadcms.com/docs/queries/overview)

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
