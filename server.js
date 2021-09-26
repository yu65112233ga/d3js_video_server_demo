const express = require('express')
const app = express()
const port = 3000

app.get('/*', (req, res) => {
    console.log(res.req.url)
    if (res.req.url == "/") {
        res.sendFile(__dirname + "/index.html")
    } else {
        res.sendFile(__dirname + res.req.url)
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function generateVideo() {
    const d3 = require("d3")
    const jsdom = require("jsdom")
    const fs = require("fs")
    const { JSDOM } = jsdom;


    const puppeteer = require('puppeteer');

    (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var contentHtml = fs.readFileSync('./test.html', 'utf8');
    console.log("t1")

    await page.setContent(contentHtml);
    console.log("t2")
    // step through each frame:
    // - increment currentTime on the page
    // - save a screenshot
    for (let frame of d3.range(120)){
        console.log("one frame")
        await page.evaluate((frame) => currentTime = frame*1000/60, frame)

        // await sleep(50)

        let path = __dirname + '/png/' + d3.format('05')(frame) + '.png'

        await page.setViewport({width: 500, height: 1080, deviceScaleFactor: 1})

        const chartEl = await page.$('#my_dataviz')

        await chartEl.screenshot({path})

    }

    browser.close()

    // generate video
    const { exec } = require("child_process");

    exec("ls -la", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    })()


    function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
    }

}