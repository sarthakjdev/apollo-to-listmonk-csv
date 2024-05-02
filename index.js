const fs = require("node:fs/promises");
const path = require("node:path");
const csvtojsonConverter = require("csvtojson");
const jsonToCsvConverter = require("json-2-csv");

const jsonObject = {
  "First Name": "Samantha",
  "Last Name": "Kimsey",
  Title: "Owner & Founder",
  Company: "Computational Thinkers",
  "Company Name for Emails": "Computational Thinkers",
  Email: "samantha@computationalthinkers.com",
  "Email Status": "Likely to engage",
  "Email Confidence": "",
  Seniority: "Owner",
  Departments: "C-Suite",
  "Contact Owner": "contact.softlancerhq@gmail.com",
  "First Phone": "'+1 808-664-0310",
  "Work Direct Phone": "",
  "Home Phone": "",
  "Mobile Phone": "",
  "Corporate Phone": "'+1 808-664-0310",
  "Other Phone": "",
  Stage: "Cold",
  Lists: "",
  "Last Contacted": "",
  "Account Owner": "contact.softlancerhq@gmail.com",
  NumberOfEmployeed: 3,
  Industry: "primary/secondary education",
  Keywords:
    "computational thinking, after school education, science, programming, coding game & game design, game design, 3d animation, artificial intelligence, blender, computer science education, drone, k12, computer science, coding, education, stem",
  "Person Linkedin Url": "http://www.linkedin.com/in/samanthakimsey",
  Website: "http://www.computationalthinkers.com",
  "Company Linkedin Url":
    "http://www.linkedin.com/company/computationalthinkers",
  "Facebook Url": "https://www.facebook.com/computationalthinkers",
  "Twitter Url": "https://twitter.com/computhinkers",
  City: "Hermosa Beach",
  State: "California",
  Country: "United States",
  "Company Address":
    "5286 Kalanianaole Hwy, Honolulu, Hawaii, United States, 96821",
  "Company City": "Honolulu",
  "Company State": "Hawaii",
  "Company Country": "United States",
  "Company Phone": "'+1 808-664-0310",
  "SEO Description":
    "Computer Science education where you can learn big ideas, really fast in small memorable gamified lessons.",
  Technologies:
    "Google Font API, Mobile Friendly, Shopify, Facebook Widget, Facebook Custom Audiences, Facebook Login (Connect), Android, SharePoint, Flutter, Python, AI, Circle",
  "Annual Revenue": 9843000,
  "Total Funding": "",
  "Latest Funding": "",
  "Latest Funding Amount": "",
  "Last Raised At": "",
  "Email Sent": "",
  "Email Open": false,
  "Email Bounced": false,
  Replied: false,
  Demoed: false,
  "Number of Retail Locations": "",
  "Apollo Contact Id": "663232d80c8fc0000776f5dd",
  "Apollo Account Id": "663232d80c8fc0000776f602",
  "User Managed": false,
};

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

async function convert() {
  const data = await csvToJson();
  const parsedData = parseApolloJsonToListmonkCom(data);
  const csv = await jsonToCsv(parsedData);
  await fs.writeFile("./listmonk.csv", csv);
}

convert().catch((error) => console.error(error));
