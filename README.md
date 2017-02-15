# HTTP cache warmup tool
Baby steps:
- install dependencies through *npm install*
- provide a list of urls
- run through *node client.js*

Variables which can be passed:
- CONCURRENT_LIMIT -> concurrent limit (defaults to 30)
- CSV -> location of the file containing urls to be crawled

Overriding default values:
```
CSV=/tmp/warmup/list1.csv CONCURRENT_LIMIT=20 node client.js
```