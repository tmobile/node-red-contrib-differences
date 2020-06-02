# node-red-contrib-differences

[![Travis (.com) branch](https://img.shields.io/travis/com/tmobile/node-red-contrib-differences/master?style=flat-square)](https://travis-ci.com/tmobile/node-red-contrib-differences) ![GitHub package.json version](https://img.shields.io/github/package-json/v/tmobile/node-red-contrib-differences?style=flat-square) [![npm (scoped)](https://img.shields.io/npm/v/@tmus/node-red-contrib-differences?style=flat-square)](https://www.npmjs.com/package/@tmus/node-red-contrib-differences)


This Node-RED node will compare two input arrays, then output the differences.

## Examples

Simple array:

```javascript
// msg.currentInventory
[ "widgets", "gadgets" ]

// msg.newInventory
[ "gadgets", "gizmos", "thingamabobs" ]

// Output:
{
  added: [ "gizmos", "thingamabobs" ]
  removed: [ "widgets" ]
}
```

Object:

```javascript
// msg.currentInventory
{ widgets: 1, gadgets: 2, whatchamacallits: 2 }

// msg.newInventory
{ gadgets: 2, gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }

// Output:
{
  added: { gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }
  removed: { widgets: 1, whatchamacallits: 2 }
}
```

Array of objects:

```javascript
// msg.currentInventory
[ 
    { name: "widgets", quantity: 1 }, 
    { name: "gadgets", quantity: 7 } 
]

// msg.newInventory
[ 
    { name: "gadgets", quantity: 6 },
    { name: "gizmos", quantity: 5 },
    { name: "thingamabobs", quantity: 5 },
]

// Output:
{
  added: {
    { name: "gizmos", quantity: 5 },
    { name: "thingamabobs", quantity: 5 }
    { name: "gadgets", quantity: 6 },
  },
  removed: {
    { name: "widgets", quantity: 1 },
    { name: "gadgets", quantity: 7 },
  }
}
```

## Contribute Quick Start

```
git clone git@github.com:tmobile/node-red-contrib-msg-diff.git
cd node-red-contrib-msg-diff
npm run buld
cd ~/.node-red
npm install <path to cloned repository> --save
node-red
```
