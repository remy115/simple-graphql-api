const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keyfile = path.join(__dirname, "../keys/test_system.key");
const decryptData = (data) => {
  try {
    if (!Buffer.isBuffer(data)) {
      data = data.replace("Bearer ", "");
      data = Buffer.from(data, "base64");
    }
  } catch (e) {
    return Promise.reject("Invalid data!");
  }
  return new Promise((res, rej) => {
    fs.readFile(keyfile, (err, key) => {
      if (err) {
        return rej(err.message);
      }
      try {
        const decryptedData = crypto.publicDecrypt(
          {
            key: key,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          data
        );

        return res(decryptedData);
      } catch (e) {
        return rej(e.message);
      }
    });
  });
};

const encryptData = (data) => {
  return new Promise((res, rej) => {
    return fs.readFile(keyfile, (err, key) => {
      if (err) {
        return rej(err.message);
      }
      try {
        let encrypted = JSON.stringify(data);
        encrypted = Buffer.from(encrypted);

        encrypted = crypto.privateEncrypt(
          {
            key: key,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          encrypted
        );

        return res(encrypted);
      } catch (e) {
        return rej(e.message);
      }
    });
  });
};

// detect if the device is: ("Web | Mobile-IOS | Mobile-Android")
/*
Firefox Android
Mozilla/5.0 (Android 7.0; Mobile; rv:65.0) Gecko/65.0 Firefox/65.0

Chrome Android
Mozilla/5.0 (Linux; Android 7.0; LG-M400) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Mobile Safari/537.36

Safari IOS (iPhone | iPad)
Mozilla/5.0 (iPhone  ; CPU iPhone OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1
*/
const userAgentParser = (userAgent) => {
  let ret = "";
  if (/android/gi.test(userAgent)) {
    ret = "Mobile-Android";
  } else if (/iphone|ipad/gi.test(userAgent)) {
    ret = "Mobile-IOS";
  } else {
    ret = "Web";
  }
  return ret;
};

const authedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const decryptedAuth = await decryptData(authHeader);

    return next();
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ status: "error", msg: "You are not allowed to access this page" });
  }
};

// converts expiry string "02/2026" to Date
const convertExpiry2Date = (expiryStr) => {
  try {
    let ret = { ret: "", error: "" };
    if (!/[\d]{2}\/[\d]{4}/.test(expiryStr)) {
      throw "";
    }
    const array = expiryStr.split("/");
    const month = +array[0] - 1;
    const year = +array[1];
    const date = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    return date;
  } catch (e) {
    if (!e) e = "Invalid format";
    return { error: e };
  }
};

const encryptPass = (pass) => {
  return new Promise((res, rej) => {
    if (pass) {
      // ^[*a/-5q8tF4af=9uXB=-an8*
      return crypto.pbkdf2(pass, "^[*a/-5q8tF4af=9uXB=-an8*", 10000, 64, "sha512", (err, key) => {
        if (err) {
          return rej(err);
        }
        return res(key.toString("hex"));
      });
    }
    return res("");
  });
};

// validating pass acording to the rules
// type: driver | customer
const passValidation = (pass = "", type = "driver") => {
  let ok = true,
    errors = [];
  if (pass.length < 3) {
    ok = false;
    errors.push("At least 3 chars required for password");
  }
  return {
    ok,
    errors,
  };
};

const usersPasswords = [{ user: "admin", pass: "admin", label: "Adminstrator" }];

const getContentTypeExt = (mimetype = "") => {
  // let ret='application/octet-stream';
  let ret = "txt";
  if (mimetype === "application/pdf") {
    ret = "pdf";
  } else if (mimetype === "image/png") {
    ret = "png";
  } else if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
    ret = "jpg";
  } else if (mimetype === "image/gif") {
    ret = "gif";
  } else if (mimetype === "image/bmp") {
    ret = "bmp";
  }

  return ret;
};

// dt: may be timestamp or ISOString()
const convertDate2DB = (dt = "") => {
  let dtObj,
    ret = false;
  if (!isNaN(new Date(+dt).getTime())) {
    dtObj = new Date(+dt);
  } else if (!isNaN(new Date(dt).getTime())) {
    dtObj = new Date(dt);
  }
  if (dtObj) {
    ret = dtObj.toISOString();
  }
  return ret;
};

const getDateInterval = (arrInterval) => {
  const ret = [0, 0];
  if (arrInterval && arrInterval.length) {
    if (arrInterval[0]) {
      const from = arrInterval[0].substring(0, 10) + "T00:00:00.000Z";
      ret[0] = new Date(from);
    }
    if (arrInterval[1]) {
      const to = arrInterval[1].substring(0, 10) + "T23:59:59.999Z";
      ret[1] = new Date(to);
    }
  }
  return ret;
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

module.exports = {
  decryptData,
  encryptData,
  userAgentParser,
  authedRoute,
  convertExpiry2Date,
  encryptPass,
  passValidation,
  usersPasswords,
  getContentTypeExt,
  convertDate2DB,
  getDateInterval,
  escapeRegExp,
};
