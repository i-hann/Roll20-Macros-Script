on('ready', async function () {

    on('chat:message', async function (msg) {
        if ((msg.type === 'api') && (typeof msg.playerid != 'undefined')) {

            if (msg.content.match(/^!create macros/i)) {

                // Find the player's 'Macros' Handout
                var macroHandout = await findObjs({
                    _type: "handout",
                    inplayerjournals: msg.playerid
                });

                if ((typeof macroHandout != 'undefined') && (macroHandout.length === 1)) {
                    var notes = await macroHandout[0].get("notes", async function (text) {

                        // Separate macros by '#' delimiter and push into array
                        const macrosArray = await text.split('#').filter(str => str.trim().length > 0);

                        if ((typeof macrosArray != 'undefined') && (macrosArray.length > 0)) {
                            for (var i = 0; i < macrosArray.length; i++) {

                                // Save the macro body
                                var macroBody = macrosArray[i];

                                // Get the macro name
                                const regexp = /{{name=\s*([^}]*)/i;
                                const match = regexp.exec(macroBody);
                                if (match) {
                                    var macroName = match[1];

                                    // Remove spaces from the macro name
                                    macroName = macroName.replace(" ", "-");

                                    if ((typeof macroName != 'undefined') && (typeof macroBody != 'undefined')) {
                                        // Log
                                        sendChat("macros.js", "Creating Macro: " + macroName);

                                        // Create the macro
                                        createObj("macro", {
                                            name: macroName,
                                            _playerid: msg.playerid,
                                            visibleto: msg.playerid,
                                            action: macroBody,
                                            istokenaction: false
                                        });
                                    }
                                }
                            }
                        }
                    });
                };

            } else if (msg.content.match(/^!delete macros/i)) {

                // Get player's macros
                var currentMacros = await findObjs({
                    _type: "macro",
                    _playerid: msg.playerid
                });

                // Delete them
                if ((typeof currentMacros != 'undefined') && (currentMacros.length > 0)) {
                    for (var i = 0; i < currentMacros.length; i++) {
                        // Get macro name
                        var macroName = await currentMacros[i].get("name", async function (name) {
                            return name;
                        });
                        sendChat("macros.js", "Deleting macro: " + macroName);
                        currentMacros[i].remove();
                    }
                } else {
                    sendChat("macros.js", "I didn't find any macros to delete.");
                }

            };
        }
    });
});
