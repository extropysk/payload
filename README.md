# Payload API

The Payload API gives you the ability to execute the same operations that are available through REST.

## Installation
`yarn add @extropysk/payload`

`npm install @extropysk/payload`

## Get Started
```
import { Config } from './payload-types'
import { Payload } from '@extropysk/payload'

const payload = new Payload<Config['collections']>({ baseUrl: PAYLOAD_CMS_URL });
```

## BaseParams

### depth
Depth gives you control over how many levels down related documents should be automatically populated when retrieved.

## FindParams
The `find` method supports the following additional query parameters.

### limit
Limits the number of documents returned.

### page
Get a specific page number. 

### sort
Pass the name of a top-level field to sort by that field in ascending order. Prefix the name of the field with a minus symbol ("-") to sort in descending order. Because sorting is handled by the database, the field you wish to sort on must be stored in the database to work; not a virtual field. It is recommended to enable indexing for the fields where sorting is used.

### where
Pass a where query to constrain returned documents. Supported operators:
- `equals` - The value must be exactly equal.
- `not_equals` - The query will return all documents where the value is not equal.
- `greater_than` -	For numeric or date-based fields.
- `greater_than_equal` - For numeric or date-based fields.
- `less_than` - For numeric or date-based fields.
- `less_than_equal`	- For numeric or date-based fields.
- `like` -	Case-insensitive string must be present. If string of words, all words must be present, in any order.
- `contains` - Must contain the value entered, case-insensitive.
- `in`	- The value must be found within the provided comma-delimited list of values.
- `not_in`	- The value must NOT be within the provided comma-delimited list of values.
- `all`	- The value must contain all values provided in the comma-delimited list.
- `exists`	- Only return documents where the value either exists (true) or does not exist (false).
