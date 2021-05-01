var Spider = require('node-spider');
var express = require('express');
const { URL } = require("url");
var app = express();
var fs = require('fs');

let sites = []
 
var spider = new Spider({
    // How many requests can be run in parallel
    concurrent: 5,
    // How long to wait after each request
    delay: 0,
    // A stream to where internal logs are sent, optional
    logs: process.stderr,
    // Re-visit visited URLs, false by default
    allowDuplicates: false,
    // If `true` all queued handlers will be try-catch'd, errors go to `error` callback
    catchErrors: true,
    // If `true` the spider will set the Referer header automatically on subsequent requests
    addReferrer: false,
    // If `true` adds the X-Requested-With:XMLHttpRequest header
    xhr: false,
    // If `true` adds the Connection:keep-alive header and forever option on request module
    keepAlive: false,
    // Called when there's an error, throw will be used if none is provided
    error: function(err, url) {
    },
    // Called when there are no more requests
    done: function() {
    },
 
    //- All options are passed to `request` module, for example:
    headers: { 'user-agent': 'node-spider' },
    encoding: 'utf8'
});
 
var handleRequest = function(doc) {
    // new page crawled
    //console.log(doc.res); // response object
    console.log(doc.url);
    sites.push(doc.url) // page url
    // uses cheerio, check its docs for more info
    doc.$('a').each(function(i, elem) {
        // do stuff with element
        var href = doc.$(elem).attr('href').split('#')[0];
        var url = doc.resolve(href);
        // crawl more
        spider.queue(url, handleRequest);
    });
};
 
// start crawling
spider.queue('https://google.com/', handleRequest);
spider.queue('https://bing.com/', handleRequest);
spider.queue('https://microsoft.com/', handleRequest);
spider.queue('https://yahoo.com/', handleRequest);
spider.queue('https://npmjs.com/', handleRequest);
spider.queue('https://js.org/', handleRequest);
spider.queue('https://discord.com/', handleRequest);
spider.queue('https://twitter.com/', handleRequest);
spider.queue('https://duckduckgo.com/', handleRequest);
spider.queue('https://www.wikipedia.org/', handleRequest);
spider.queue('https://amazon.com/', handleRequest);

setInterval(function(){
    

    fs.readFile('./sites.json', 'utf8', function(err, data){
        let sites1 = JSON.stringify(sites.concat(JSON.parse(data)));

        fs.writeFile("./sites.json", sites1, (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully");
                sites = []
            }
        });
    });
}, 60000)

app.get('/', async function(req, res){
    res.send('<center><h1>ItzWiresDev#6193</h1><hr />This server is part of the <a href="https://wiresdev.ga">wiresdev</a> network</center>')
})

app.get('/api', async function(req, res){
    fs.readFile('./sites.json', 'utf8', function(err, data){
        let sites1 = sites.concat(JSON.parse(data));

        res.json(sites1)
    });
})

app.get('/api/addSite', async function(req, res){
    let url = new URL("https://api.wiresdev.ga" + req.url);
    let s = url.searchParams.get("s");

    spider.queue(s, handleRequest);

    res.json({yay: "it worked! (i think)"})
})

app.listen(80)
