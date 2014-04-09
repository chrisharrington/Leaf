var fs = require("fs");

/*
 * Process for setting config variables:
 *
 * 1) Add config variable key to localConfig.json. The config variable value should be the environment variable key.
 *
 * 2) Add matching key/value pair in localConfig.json. This file is added to the .gitignore file so won't be checked in
 *    in plain text. This file is used to prepopulate the configuration environment variables to run the application locally.
 *    It's encrypted using the following command:
 *
 *      npm run encrypt
 *
 *    This command should only be run after the configuration file has been modified. This will encrypt the localConfig.json
 *    file into localConfig.json.cast5. To decrypt the configuration file, run:
 *
 *      npm run decrypt
 *
 *    This will restore the localConfig.json file for developers to use. In either case, you'll need to specify a password.
 *    Contact chrisharrington99@gmail.com to get the password to run either command.
 *
 * 3) Add encrypted environment variable key and value matching the environment variable key from step one to the .travis.yml
 *    file to allow travis to build/test/deploy the app to heroku. To do so, install the travis command line tool
 *    (gem install travis) and run the following command:
 *
 *      travis encrypt SOMEVAR=secretvalue
 *
 *    SOMEVAR should take the format leaf.<variable> or leaf.serverPort.
 *
 * 4) Add heroku config environment variable key and value matching the environment variable key from step one.
 */

var _initialized = false;

module.exports = function(key) {
	if (!_initialized) {
		try {
			var config = require("./localConfig.json");
			for (var name in config)
				process.env["leaf." + name] = config[name];
			_initialized = true;
		} catch (e) {}
	}

	return process.env["leaf." + key];
};