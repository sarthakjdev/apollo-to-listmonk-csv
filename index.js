const fs = require("node:fs/promises");
const path = require("node:path");
const csvtojsonConverter = require("csvtojson");
const jsonToCsvConverter = require("json-2-csv");

async function csvToJson() {
  const filePath = process.argv[2];
  const jsonArray = await csvtojsonConverter({ delimiter: "," }).fromFile(
    path.resolve(filePath)
  );
  return jsonArray;
}

async function jsonToCsv(json) {
  const resultantCsv = jsonToCsvConverter.json2csv(json, {
    delimiter: ",",
    expandNestedObjects: false,
  });
  console.log({ resultantCsv });
  return resultantCsv;
}

function parseApolloJsonToListmonkCom(data) {
  const result = data.map((item) => {
    const objectToReturn = {
      name: item["First Name"] + " " + item["Last Name"],
      email: item["Email"],
      attributes: {},
    };

    Object.keys(item).forEach((key) => {
      switch (key) {
        case "Company": {
          objectToReturn.attributes["company"] = item[key];
          return;
        }
        case "Seniority": {
          objectToReturn.attributes["designation"] = item[key];
          return;
        }
        case "Title": {
          objectToReturn.attributes["title"] = item[key];
          return;
        }
        case "Company Linkedin Url": {
          objectToReturn.attributes["company-linkedin"] = item[key];
          return;
        }
        case "Personal Linkedin Url": {
          objectToReturn.attributes["linkedin"] = item[key];
          return;
        }
        case "Website": {
          objectToReturn.attributes["website"] = item[key];
          return;
        }
        case "Twitter Url": {
          objectToReturn.attributes["twitter"] = item[key];
          return;
        }
        case "Facebook Url": {
          objectToReturn.attributes["facebook"] = item[key];
          return;
        }

        case "Contact Owner": {
          return;
        }

        default: {
          if (!item[key] && typeof item[key] !== "boolean" && item[key] !== 0) {
            return;
          }
          const newKey = key.toLowerCase().trim().split(" ").join("-");
          objectToReturn.attributes[newKey] = item[key];
        }
      }
    });

    return objectToReturn;
  });

  return result;
}

function parseInstantScraperJsonToListmonkCompatibleJson(data) {
  const result = data.map((item) => {
    const objectToReturn = {
      name: item["Name"] || item["name"],
      email: item["Email"] || item["email"],
      attributes: {},
    };

    Object.keys(item).forEach((key) => {
      switch (key) {
        case "Company": {
          objectToReturn.attributes["company"] = item[key];
          return;
        }
        case "Seniority": {
          objectToReturn.attributes["designation"] = item[key];
          return;
        }
        case "Title": {
          objectToReturn.attributes["title"] = item[key];
          return;
        }
        case "Company Linkedin Url": {
          objectToReturn.attributes["company-linkedin"] = item[key];
          return;
        }
        case "Personal Linkedin Url": {
          objectToReturn.attributes["linkedin"] = item[key];
          return;
        }
        case "Website": {
          objectToReturn.attributes["website"] = item[key];
          return;
        }
        case "Twitter Url": {
          objectToReturn.attributes["twitter"] = item[key];
          return;
        }
        case "Facebook Url": {
          objectToReturn.attributes["facebook"] = item[key];
          return;
        }

        case "Contact Owner": {
          return;
        }

        default: {
          if (!item[key] && typeof item[key] !== "boolean" && item[key] !== 0) {
            return;
          }
          const newKey = key.toLowerCase().trim().split(" ").join("-");
          objectToReturn.attributes[newKey] = item[key];
        }
      }
    });

    return objectToReturn;
  });

  return result;
}

async function convert() {
  const data = await csvToJson();

  if (process.argv[3] === "--scrapped") {
    const parsedData = parseInstantScraperJsonToListmonkCompatibleJson(data);
    const csv = await jsonToCsv(parsedData);
    await fs.writeFile("./listmonk.csv", csv);
  } else {
    const parsedData = parseApolloJsonToListmonkCom(data);
    const csv = await jsonToCsv(parsedData);
    await fs.writeFile("./listmonk.csv", csv);
  }
}

convert().catch((error) => console.error(error));
