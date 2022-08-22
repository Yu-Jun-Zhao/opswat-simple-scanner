# opswat-simple-scanner

A simple command-line program that utilized Opswat MetaDefender Cloud v4 API. Basic functionalities: hash look-up and file analysis. 

## Installation (Linux - Ubuntu 20)

1. Install Node.js 16.17 or above.
2. Clone Repo and `cd` into the project repo.
3. Install all the dependencies with `npm install`.
4. Open `./bin/index.js` and Replace the `XXXXX` with your Opswat api key on the top line `#!/usr/bin/env -S API_KEY=XXXXX API_FETCH_INTERVAL_IN_MS=100 node`
    * API_KEY - opswat api key (required)
    * API_FETCH_INTERVAL_IN_MS - defines the interval (in milliseconds) between each polling (for retrieving report). (optional) 
5. Install the Node application with `npm install -g .`


## Instruction

## Next Steps
