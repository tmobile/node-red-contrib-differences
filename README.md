# node-red-contrib-differences

[![Travis (.com) branch](https://img.shields.io/travis/com/tmobile/node-red-contrib-differences/master?style=flat-square)](https://travis-ci.com/tmobile/node-red-contrib-differences) ![GitHub package.json version](https://img.shields.io/github/package-json/v/tmobile/node-red-contrib-differences?style=flat-square) [![npm (scoped)](https://img.shields.io/npm/v/@tmus/node-red-contrib-differences?style=flat-square)](https://www.npmjs.com/package/@tmus/node-red-contrib-differences)

This Node-RED node will compare two inputs, then create output based on how the inputs differ.

Output functions include:

* **Complement**: What's in one input, but not the other
* **Intersection**: What's common in both inputs
* **Union**: Everything from both inputs

## Usage

Drag and Drop the "Differences" node onto the canvas. Set the `Left` and `Right` input values to the source sets, set the `Function` value baed on how you want differences between the left and right sets treated, and the `Output` value to the destination property.

## Examples

See also [example-flow.json](example-flow.json).

### Complement

Input as an array:

```javascript
// "Left" (desired)
[ "gadget", "gizmo", "thingamabob" ]

// "Right" (owned)
[ "widget", "gadget" ]

// Output:
[ "gizmo", "thingamabob" ]
```

Input as an object: 

```javascript
// "Left" (desired)
{ gadgets: 2, gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }

// "Right (owned)
{ widgets: 1, gadgets: 2, whatchamacallits: 2 }

// Output:
{ gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }
```

### Intersection

Input as an array:

```javascript
// "Left"
[ "widget", "gadget" ]

// "Right"
[ "gadget", "gizmo", "thingamabob" ]

// Output:
[ "gadget" ]
```

Input as an object: 

```javascript
// "Left"
{ widgets: 1, gadgets: 2, whatchamacallits: 2 }

// "Right"
{ gadgets: 2, gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }

// Output:
{ gadgets: 2 }
```

### Union

Input as an array:

```javascript
// "Left"
[ "widget", "gadget" ]

// "Right"
[ "gadget", "gizmo", "thingamabob" ]

// Output:
[ "gadget", "widget", "gizmo", "thingamabob" ]
```

Input as an object: 

```javascript
// "Left"
{ widgets: 1, gadgets: 2, whatchamacallits: 2 }

// "Right"
{ gadgets: 2, gizmos: 3, thingamabobs: 4, whatchamacallits: 3 }

// Output:
{ widgets: 1, gadgets: 2, gizmos: 3, thingamabobs: 4, whatchamacallits: [2, 3] }
```

## Contribute Quick Start

Fork this repository, then:

```
git clone https://github.com/tmobile/node-red-contrib-differences.git
cd node-red-contrib-differences
npm run build
cd ~/.node-red
npm install <path to cloned repository> --save
node-red
```

When you're finished with your changes, merge requests are welcome!
