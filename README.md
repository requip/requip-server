# rEQUIP - Remote (online) EQUIP-like GUI for QuarkNet Detectors

* Use websockets ~~- https://github.com/gorilla/websocket~~
* Use ~~golang~~ nodejs for remote side
* use something like this for status display on pi: https://www.adafruit.com/product/1115
* NOte: i2u2 can handle data files without carriage returns just fine.

Absolutely random notes:

remote sensor system:
all the hardware communicates over one serial channel with a small headless linux board (rpi or something)

server system:
communicates with headless linux board over the internet and creates a terminal

client side:
connects to server from web interface and does serial stuff

both the remote sensor system and the server system log the entirety of the serial thing BUT the server doesn't have to log the serial output in realtime always (only while client is connected/client needs to be able to download whole file)

## it's probably bad but im using node now
