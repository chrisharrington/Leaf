var crypto = require("crypto"), fs = require("fs"), path = require("path");

(function() {
	var isEncrypt = process.argv[2] == "encrypt";
	var fn = isEncrypt ? crypto.createCipher : crypto.createDecipher;
	var from = path.join(process.cwd(), isEncrypt ? "secureConfig.json" : "secureConfig.json.cast5");
	var to = path.join(process.cwd(), isEncrypt ? "secureConfig.json.cast5" : "secureConfig.json");
	var password = process.argv[3];
	if (!password)
		throw new Error("No password specified.");

    from = fs.createReadStream(from);
    to = fs.createWriteStream(to);
    fn = fn("cast5-cbc", password);

    from.pipe(fn).pipe(to);
})();