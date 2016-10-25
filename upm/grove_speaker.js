//Load Grove Speaker module
var groveSpeaker = require('jsupm_grovespeaker');
var mySpeaker = new groveSpeaker.GroveSpeaker(7);

// Play all 7 of the lowest notes
mySpeaker.playAll();

// Play a medium C-sharp
mySpeaker.playSound('c', true, "med");

// Print message when exiting
process.on('SIGINT', function()
{
    console.log("Exiting...");
    process.exit(0);
});
