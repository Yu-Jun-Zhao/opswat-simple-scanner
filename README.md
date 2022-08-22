# opswat-simple-scanner

A simple command-line program that utilized Opswat MetaDefender Cloud v4 API. Basic functionalities: hash look-up and file scanning. <br>
API endpoints used by the program: `GET /hash/{hash}`, `POST /file`, `GET /file/{dataId}`

## Installation (Linux - Ubuntu 20)

1. Install Node.js 16.17 or above.
2. Clone Repo and `cd` into the project repo.
3. Install all the dependencies with `npm install`.
4. Open `./bin/index.js` and Replace the `XXXXX` with your Opswat api key on the top line `#!/usr/bin/env -S API_KEY=XXXXX API_FETCH_INTERVAL_IN_MS=100 node`
    * API_KEY - opswat api key (required)
    * API_FETCH_INTERVAL_IN_MS - defines the interval (in milliseconds) between each polling (for retrieving report). (optional) 
5. Install the Node application with `npm install -g .`


## Instructions

The command for this program: `opswat-scan`. <br>
Arguments to be passed in: `filepath`. (relative or absolute) <br>

Additional flags: <br>
    * `-d`: sets the default headers. Content-type will default to `multipart/form-data`. If this flag is left out, the program will allow users to choose the Content-type (`multipart/form-data` or `application/octet-stream`) and prompt users for other custom headers. These headers will be POST to the file scanning endpoint `/file`.  
    
To test out the program: in the current repo, simply enter `opswat-scan ./test-files/samplefile.txt -d`. If everything is working as expected, you should see: 
1. The hash (SHA256) of the file. (only supporting SHA256 at the moment)
2. A scan report for the samplefile.txt.

How to change Content-type or set optional headers for the file scan: <br>
1. Leave the flag `-d` off and simply enter `opswat-scan <file_path>`. 
2. Before it scans with the API (`/file`), it will allow you to choose the content-type and set the optional headers. (Note: currently, the only **optional** header supported is **rescan_count**. For full list of headers: [click here](https://docs.opswat.com/mdcloud/metadefender-cloud-api-v4/ref#file-upload)) 
![prompt_headers](https://user-images.githubusercontent.com/36460791/185956313-47f4e2c9-bfa6-4c91-8f14-3734ac223988.png)

Once the file is submitted for scanning, the program will continuously call the `GET /file/{dataId}` for the report. You may see something like this. <br>
![progress](https://user-images.githubusercontent.com/36460791/185957571-2007ea10-042c-4dda-bbf0-485b13c018d2.png)

Report will be displayed once the progress_percentage reaches 100.

## Next Steps
Time is a limiting factor. If time permits I will add the following.
1. Unit tests.
2. Support additional optional headers for file scanning (`/file`)
3. Implement a better logging tool. 
4. Prompt users for the apikey dynamically.
