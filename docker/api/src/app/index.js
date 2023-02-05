const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// MongoDB access
//const {MongoClient} = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const url = 'mongodb://root:example@localhost:27017/';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/api/search', async (req, res) => {
  try {
    //Database access
    let client = await MongoClient.connect(url);
    let db = client.db("parks");

    let body = req.body;

    let parkIdList = JSON.parse(req.body.parkIdList) //["centre-touristique-du-lac-simon"]
    let startDate = req.body.startDate // "2023-06-16"
    let endDate = req.body.endDate // "2023-06-20"
    let email = req.body.email // "john@doe.com"
    let schedule = req.body.schedule // "1H"

    console.log(`${parkIdList} ${startDate} ${endDate}`)


    let processId = crypto.randomUUID();

    //parkIdList
    for (const parkId of parkIdList) {
      let parkList = await new Promise(function (resolve, reject) {
        db.collection("park").find({"parkId": parkId}).toArray(function (err, docs) {
          if (err) {
            // Reject the Promise with an error
            return reject(err)
          }
          // Resolve (or fulfill) the promise with data
          return resolve(docs)
        })
      });

      console.log(`${JSON.stringify(parkList[0].sectors)}`)

      run(parkId, parkList[0].sectors, startDate, endDate, processId, email, schedule);

    }


    let search = `{"processId":"${processId}","schedule":"${schedule}","email":"${email}","creationTime":"${new Date().getTime()}"}`;

    // write to the db
    new Promise(function (resolve, reject) {
      db.collection("searches").insertOne(JSON.parse(search), function (err, res) {
        if (err) throw err;
        console.log("1 document (searches) inserted");
      });
    });

    res.statusCode = 201;
    res.setHeader('Content-type', 'text/json');
    res.write(`{"status":"ok", "processId":"${processId}"}`);
    res.end();
  }catch (error){
    res.statusCode = 500;
    res.end();
  }

});

app.get('/api/searches', async (req, res) => {

  //Database access
  let client = await MongoClient.connect(url);
  let db = client.db("parks");

  let searchesList = await new Promise(function(resolve, reject) {
    db.collection("searches").find().toArray( function(err, docs) {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }
      // Resolve (or fulfill) the promise with data
      return resolve(docs)
    })
  });

  res.statusCode = 200;
  res.setHeader('Content-type', 'application/json');
  res.write(`${JSON.stringify(searchesList)}`);
  res.end();
});

app.get('/api/availabilities', async (req, res) => {

  //Database access
  let client = await MongoClient.connect(url);
  let db = client.db("parks");

  let availabilityList = await new Promise(function(resolve, reject) {
    db.collection("availabilities").find().toArray( function(err, docs) {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }
      // Resolve (or fulfill) the promise with data
      return resolve(docs)
    })
  });

  res.statusCode = 200;
  res.setHeader('Content-type', 'application/json');
  res.write(`${JSON.stringify(availabilityList)}`);
  res.end();
});


app.get('/api/parks', async (req, res) => {

  let client = await MongoClient.connect(url);
  let db = client.db("parks");

  let parkList = await new Promise(function(resolve, reject) {
    db.collection("park").find().toArray( function(err, docs) {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }
      // Resolve (or fulfill) the promise with data
      return resolve(docs)
    })
  });

  res.statusCode = 200;
  res.setHeader('Content-type', 'application/json');
  res.write(`${JSON.stringify(parkList)}`);
  res.end();

});


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


async function run(parkId, sectors, startDate, endDate, processId, email, schedule) {
  // const browser = await puppeteer.launch({
  //   headless: false
  // });

  let client = await MongoClient.connect(url);
  let db = client.db("parks");

  let availabilityList = [];

  for (var i = 0; i < sectors.length; i++){
    sectorId = sectors[i]

  console.log(`park: ${parkId}, sector: ${sectorId}, startDate:${startDate}, endDate:${endDate}, processId:${processId}, email:${email}, schedule:${schedule}`);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width:1920,
      height:1080
    }
  });

  const page = await browser.newPage();

  await page.setViewport({width: 1920, height: 1080});

    await page.goto('https://www.sepaq.com/fr/reservation/camping/' + parkId + '/' + sectorId);

    //Types d'hébergement
    await page.click('[id="criteres-quoi-link"]');
    await page.waitForTimeout(1500);

    //Camping
    await page.click('#criteres-quoi > div.panel-middle > ul > li:nth-child(2) > label > input[type=radio]');
    await page.waitForTimeout(1500);

    //--> Rechercher
    await page.click('#criteres-quoi > div.panel-bottom > p > input.bouton.is-action.is-one-half.bouton-submit');
    await page.waitForTimeout(1500);

    //Equipement
    await page.click('[id="filtres-equipement-link"]');
    await page.waitForTimeout(1500);

    //Roulotte
    await page.click('#filtres-equipement > div.panel-middle > ul > li:nth-child(3) > span');
    await page.waitForTimeout(1500);

    //Moins de 25 pieds
    await page.click('#filtres-equipement > div.panel-middle > ul > li.form-list-collapsible.is-opened > ul > li:nth-child(3) > label > span');
    await page.waitForTimeout(1000);

    // --> Rechercher
    await page.click(' #filtres-equipement > div.panel-bottom > p > input.bouton.is-action.bouton-submit.is-one-half');
    await page.waitForTimeout(1500);

    // CALENDRIER
    const CALENDAR_SELECTOR = '[data-type="calendrier"]';
    await page.click(CALENDAR_SELECTOR);
    await page.waitForTimeout(1500);

    //Dates
    await page.click('[id="criteres-quand-link"]');
    await page.waitForTimeout(1500);

    //Enter dates
    //await page.$eval('#criteres-quand > div.panel-middle > div.form-col.w-100.form-date > input.form-date-from-hidden', (el, value)  => {console.log(value)}, startDate);

    await page.$eval('#criteres-quand > div.panel-middle > div.form-col.w-100.form-date > input.form-date-from-hidden', (el, startDate) => el.value = startDate, startDate);
    await page.$eval('#criteres-quand > div.panel-middle > div.form-col.w-100.form-date > input.form-date-to-hidden', (el, endDate) => el.value = endDate, endDate);

    // --> Rechercher
    await page.click('#criteres-quand > div.panel-bottom > p > input.bouton.is-action.is-one-half.bouton-submit');
    await page.waitForTimeout(1500);

    // click on List button
    const aList = await page.$x("/html/body/div[1]/section[3]/div/div[4]/div[2]/a[2]");
    await aList[0].click();
    await page.waitForTimeout(1500);

    // parse search results
    let elements = await page.$$('.liste-resultats > .resultat');

    for (let element of elements) {

      let location = await element.$eval(('div[class="resultat-contenu"] h4'), node => node.innerText.replace(/\n|\r/g, " "));
      let price = await element.$eval(('div[class="resultat-prix-dispo"] p[class="resultat-prix"]'), node => node.innerText.replace(/\n|\r/g, " "));
      let status = await element.$eval(('div[class="resultat-prix-dispo"] p[class="resultat-dispo"] a'), node => node.innerText.replace(/\n|\r/g, " "));
      let link = await element.$eval(('div[class="resultat-prix-dispo"] p[class="resultat-dispo"] a'), node => node.getAttribute('href'));
      let fullLink = "https://www.sepaq.com" + link;

      let availability

      if (status == "DISPONIBLE") {
          availability  = `{"processId":"${processId}","parkId":"${parkId}","sectorId":"${sectorId}","location":"${location}","price":"${price}","link":"${fullLink}","startDate":"${startDate}","endDate":"${endDate}","status":"${status}","email":"${email}","checkTime":"${new Date().getTime()}"}`

        // write to the db
        let parkList = await new Promise(function(resolve, reject) {
          db.collection("availabilities").insertOne(JSON.parse(availability), function(err, res) {
            if (err) throw err;
            console.log("1 document (availabilities) inserted");
          });
        });
      }
    }

    browser.close();
  }

}




