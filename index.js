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

  await browser.close()

  // generate video
  const { exec } = require("child_process");

  exec("ffmpeg -framerate 60 -pattern_type glob -i 'png/*.png' video.mp4", (error, stdout, stderr) => {
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


//   fs.readFile('data/data.csv', 'utf8' , (err, in_data) => {
//     var data = d3.csvParse(in_data);
//     console.log(data)

//     const window = (new JSDOM(``, { pretendToBeVisual: true })).window;
//     global.document = window.document;

//     // set the dimensions and margins of the graph
//     var margin = {top: 10, right: 30, bottom: 90, left: 40},
//         width = 460 - margin.left - margin.right,
//         height = 450 - margin.top - margin.bottom;

//     var body = d3.select("body");

//     // append the svg object to the body of the page
//     var svg = body
//     .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");

//     //do something with csvData
//     // X axis
//     var x = d3.scaleBand()
//     .range([ 0, width ])
//     .domain(data.map(function(d) { return d.Country; }))
//     .padding(0.2);
//     svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-45)")
//         .style("text-anchor", "end");

//     // Add Y axis
//     var y = d3.scaleLinear()
//     .domain([0, 13000])
//     .range([ height, 0]);
//     svg.append("g")
//     .call(d3.axisLeft(y));

//     // Bars
//     svg.selectAll("body")
//       .data(data)
//       .enter()
//       .append("rect")
//         .attr("x", function(d) { return x(d.Country); })
//         .attr("width", x.bandwidth())
//         .attr("fill", "#69b3a2")
//         // no bar at the beginning thus:
//         .attr("height", function(d) { return height - y(0); })
//         .attr("y", function(d) { return y(0)  ; })

//     // Animation
//     svg.selectAll("rect")
//     .transition()
//     .duration(800)
//     .attr("y", function(d) { return y(d.Value); })
//     .attr("height", function(d) { return height - y(d.Value); })
//     .delay(function(d,i){
//     });

//     window.requestAnimationFrame(timestamp => {
//         console.log(timestamp > 0);
//       });


// });