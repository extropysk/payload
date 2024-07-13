# FindParams
The `find` method supports the following additional query parameters.

## limit
Limits the number of documents returned.

## page
Get a specific page number. 

## sort
Pass the name of a top-level field to sort by that field in ascending order. Prefix the name of the field with a minus symbol ("-") to sort in descending order. Because sorting is handled by the database, the field you wish to sort on must be stored in the database to work; not a virtual field. It is recommended to enable indexing for the fields where sorting is used.

## where
Pass a where query to constrain returned documents. Example:
```
{
  color: {
    // property name to filter on
    equals: 'mint', // operator to use and value to compare against
  }
}
```

### Operators
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

### AND / OR Logic
In addition to defining simple queries, you can join multiple queries together using simple AND / OR logic. Example:
```
{
  or: [
    // array of OR conditions
    {
      color: {
        equals: 'mint',
      },
    },
    {
      and: [
        // nested array of AND conditions
        {
          color: {
            equals: 'white',
          },
        },
        {
          featured: {
            equals: false,
          },
        },
      ],
    },
  ],
}
```

### Nested Properties
When working with nested properties, which can happen when using relational fields, it is possible to use the dot notation to access the nested property. Example: 
```
{
  'artists.featured': {
    // nested property name to filter on
    exists: true, // operator to use and boolean value that needs to be true
  },
}
```