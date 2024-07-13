# Payload API

The Payload API gives you the ability to execute the same operations that are available through REST.

## Installation
`yarn add @extropysk/payload`

`npm install @extropysk/payload`

## Get Started
```
import { Config } from './payload-types'
import { Payload } from '@extropysk/payload'

const payload = new Payload<Config['collections']>({ baseUrl: <PAYLOAD CMS URL> });
```
