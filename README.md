## aframe-environment-map-component

[![Version](http://img.shields.io/npm/v/aframe-environment-map-component.svg?style=flat-square)](https://npmjs.org/package/aframe-environment-map-component)
[![License](http://img.shields.io/npm/l/aframe-environment-map-component.svg?style=flat-square)](https://npmjs.org/package/aframe-environment-map-component)

Generate environment maps from aframe-environment-component for proper PBR lighting

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-environment-map-component/dist/aframe-environment-map-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity environment-map="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-environment-map-component
```

Then require and use.

```js
require('aframe');
require('aframe-environment-map-component');
```
