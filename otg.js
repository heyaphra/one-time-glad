const { randomInt } = require("crypto");
const QRCode = require("qrcode");
const fs = require("fs");
const { decode } = require("punycode");

function otp(message) {
  const text_pad = message
    .split("")
    .map((char) => {
      const rand = randomInt(256);
      return String.fromCharCode(rand);
    })
    .join("");

  return text_pad;
}

function otp_encrypt(message) {
  const pad = otp(message);
  const ciphertext = message
    .split("")
    .map((c, i) => String.fromCharCode(c.charCodeAt() ^ pad[i].charCodeAt()))
    .join("");
  return { pad: encodeURI(pad), ciphertext: encodeURI(ciphertext) };
}

function otp_decrypt({ pad, ciphertext }) {
  return ciphertext
    .split("")
    .map((c, i) => String.fromCharCode(c.charCodeAt() ^ pad[i].charCodeAt()))
    .join("");
}

const generateQR = async (text, out) => {
  try {
    const qr = await QRCode.toDataURL(text);
    fs.writeFileSync(out, qr.replace(/^data:image\/png;base64,/, ""), "base64");
  } catch (err) {
    console.error(err);
  }
};

// Example: Encrypt
// const hello = otp_encrypt("hello");

// console.log(hello);

// Example: Decrypt
// console.log(otp_decrypt({ pad: "ìe\x95)³", ciphertext: "\x84\x00ùEÜ" }));

(async () => {
  const enc = otp_encrypt(`Hey birthday girl,

   You've successfully decrypted this SuPeR sEcReT message meant for your eyes only!
   
   In addition to what's in the bag, I thought you might appreciate this too ;) 
   I know you'll stay beautiful in this new year of life, and all of the ones to come.

    Love,
    Aphra`);


  const decodeAtUrl = `localhost:5000/index.html?pad=${enc.pad}&ciphertext=${enc.ciphertext}`;

  console.log(decodeAtUrl)
})();

// musically cool
// { pad: 'q \x1CÞ\n', ciphertext: '\x19Ep²e' }

// { pad: 'Å.it\x10', ciphertext: '­K\x05\x18\x7F' }
// [ 5, 10, 9, 8, 4 ]
