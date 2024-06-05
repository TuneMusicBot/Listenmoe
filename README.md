# <img src="https://listen.moe/favicon.ico" alt="Logo" width="20"> Listen.moe Wrapper

Just a simple and easy to use wrapper for [Listen.moe](https://listen.moe) gateway.

## 🔩 Installation
Node.js LTS (or higher) is required.

```xl
(p)npm install @tunemusicorg/listenmoe
// or
yarn add @tunemusicorg/listenmoe
```

## 👉 Usage

JPop Gateway:
```js
const { JPopClient } = require("@tunemusicorg/listenmoe");

const client = new JPopClient();

client.on("trackUpdate", (update) => console.log(update));

client.connect();
```

KPop gateway:
```js
const { KPopClient } = require("@tunemusicorg/listenmoe");

const client = new KPopClient();

client.on("trackUpdate", (update) => console.log(update));

client.connect();
```

## 📚 Events

**This events are in both JPop and KPop clients.**


* `connected` **->** Emitted when a gateway connection is made (THIS DOESN'T MEAN THE CONNECTION IS READY).
* `ready` **->** Emitted when the gateway connection is ready.
* `disconnect` **->** Emitted when the gateway gets disconnected.
* `error` **->** Emitted when a error happens.
* `raw` **->** Emitted when a packet is received.
* `trackUpdate` **->** Emitted when a track start playing.

This events doesn't have in listen.moe documentation but can be received.

* `trackUpdateRequest`
* `queueEnd`
* `notification`

This project is licensed under the [AGPL-3.0](https://github.com/TuneMusicBot/Listenmoe/blob/master/LICENSE) license. Made with ❤️ by <img src="https://i.imgur.com/1mvCB1g_d.webp?maxwidth=760&fidelity=grand" alt="Tune" width="16"> TuneBot team.