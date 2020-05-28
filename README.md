# node-red-contrib-array-differ

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
  changed: []
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
