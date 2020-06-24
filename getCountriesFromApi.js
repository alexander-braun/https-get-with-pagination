const https = require("https");
const url = "https://jsonmock.hackerrank.com/api/countries?page=";

let callBack = function (data) {
  console.log(data);
};
const getData = function (pageNo = 1, someCallBack, countryCode) {
  let actualUrl = url + pageNo;
  let mydata = [];
  https
    .get(actualUrl, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", async () => {
        if (JSON.parse(data).total_pages >= pageNo) {
          pageNo += 1;
          let countries = JSON.parse(data).data;
          let found = false;
          for (let country of countries) {
            if (country.alpha2Code === countryCode) {
              found = true;
              return callBack(country.name);
            }
          }
          if (!found) {
            await getData(pageNo, callBack, countryCode);
          }
        }
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
};

getData((pageNo = 1), callBack, "DE");
