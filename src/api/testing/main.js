/*
 run the testing programmatically, and send the issue to telegram chat room if test failed
 */

const Mocha = require('mocha');
const fs = require('fs');
const util = require("./../utilities/main.js");
const axios = require("axios");

const mocha = new Mocha();

const folders = ["./"];

for (let i = 0;i < folders.length;i++) {
    fs.readdirSync(folders[i])
        .forEach(file => mocha.addFile(`${folders[i]}/${file}`));
}

let runner = mocha.run((failures, txt) => {
    /*
    process.on('exit', () => {
        process.exit(failures); // exit with non-zero status if there were failures
    });
    */
    // Explicitly kill application, something makes it hang.
    //process.exit(failures);
});

let failed_test = [];

runner.on('fail', (test, err) => {
    failed_test.push(test.title);
});

runner.on('end', async () => {
    console.log('All tests finished');
    const suc_msg = "All tests passed successfully";
    let failed_test_str = "Testing failed : %0A";

    if (failed_test.length > 0) {
	// check if errors only contain the ignored message
	let ignored_msg = true;

	for (let i = 0;i < failed_test.length;i++) {
	    if (failed_test[i] != "should be ignored") {
		ignored_msg = false;
	        failed_test_str += failed_test[i] + "%0A";
	    }
	}

	if (ignored_msg) {
	    // send the successful message each hour
	    const d = new Date();
	    if (d.getMinutes() == 0 || d.getMinutes() - 1 == 0) {
                await util.sendTelegramMsg(suc_msg);
	    }
	}
	else {
	    await util.sendTelegramMsg(failed_test_str);
	}
    }
    else {
	// send the successful message each hour
	const d = new Date();
	if (d.getMinutes() == 0 || d.getMinutes() - 1 == 0) {
            await util.sendTelegramMsg(suc_msg);
	}
    }
    // Explicitly kill application, something makes it hang.
    process.exit(0);
});
