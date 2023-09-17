on('ready', async function () {

    on('chat:message', async function (msg) {
        if ((msg.type === 'api') && (typeof msg.playerid != 'undefined') && (msg.content.match(/^(!create macros|!delete macros)/i))) {

            // Get speakingAs character ID
            const playerObj = await getObj('player', msg.playerid);
            const speakingAs = await playerObj.get('speakingas');
            const playerName = await playerObj.get('_displayname');
            const regex = /^character\|(.*)$/i;
            const characterMatches = speakingAs.match(regex);

            if (characterMatches) {
                // Player is speaking as a character

                // Get character name
                const characterId = characterMatches[1];
                const characterObj = await getObj('character', characterId);
                const characterName = await characterObj.get('name');
                
                if (typeof characterName != 'undefined') {
                    if (msg.content.match(/^!create macros/i)) {

                        // Find the player's 'Macros' Handout
                        var macroHandout = await findObjs({
                            _type: "handout",
                            name: "Macros",
                            inplayerjournals: msg.playerid
                        });

                        if ((typeof macroHandout != 'undefined') && (macroHandout.length === 1)) {
                            var notes = await macroHandout[0].get("notes", async function (text) {

                                // Separate macros by '#' delimiter and push into array
                                const macrosArray = await text.split('#').filter(str => str.trim().length > 0);

                                if ((typeof macrosArray != 'undefined') && (macrosArray.length > 0)) {
                                    for (var i = 0; i < macrosArray.length; i++) {

                                        // Save the macro body, adding in newlines
                                        var macroBody = (macrosArray[i].replace(/\$newline/g, '\n'));

                                        var tokenaction = false;

                                        // Initiative gets special treatment
                                        if (macroBody.match(/\{\{\s*name\s*\=\s*Initiative\s*\}\}/i)) {
                                            // Insert character name: {<characterName>|tracker}
                                            macroBody = await macroBody.replaceAll("\%\{\|tracker\}", `\%\{${characterName}\|tracker\}`);

                                            // Set tokenaction to true
                                            tokenaction = true;

                                            // Remove all existing abilities called "tracker" from the character
                                            var trackerAbilities = await findObjs({
                                                _type: "ability",
                                                _characterid: characterId,
                                                name: "tracker"
                                            });
                                            if ((typeof trackerAbilities != 'undefined') && (trackerAbilities.length > 0)) {
                                                for (var i = 0; i < trackerAbilities.length; i++) {
                                                    trackerAbilities[i].remove();
                                                }
                                            }

                                            // Make a new one
                                            createObj("ability", {
                                                name: "tracker",
                                                _characterid: characterId,
                                                action: "&#38;&#123;tracker:+&#125;",
                                                istokenaction: false
                                            });

                                            sendChat("macros.js", `/w ${playerName} Since one of your macros is for Initiative, I created a 'tracker' ability for ${characterName}.`);

                                        }

                                        // Get the macro name
                                        const regexp = /{{name=\s*([^}]*)/i;
                                        const match = regexp.exec(macroBody);
                                        if (match) {
                                            var macroName = match[1];

                                            // Remove spaces from the macro name
                                            macroName = macroName.replace(/ /g, "-");

                                            // Remove image links from macro name
                                            // Ex: Giant Centipede Venom[Giant Centipede Venom](https://2e.aonprd.com/Images/Monsters/Centipede_GiantCentipede.png)
                                            macroName = macroName.replace(/\s*\[.*?\]\s*\(.*?\)/g, "");

                                            if ((typeof macroName != 'undefined') && (typeof macroBody != 'undefined')) {
                                                // Log
                                                sendChat("macros.js", "Creating Macro: " + macroName);

                                                // Create the macro
                                                createObj("macro", {
                                                    name: macroName,
                                                    _playerid: msg.playerid,
                                                    visibleto: msg.playerid,
                                                    action: macroBody,
                                                    istokenaction: tokenaction
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
                } else {
                    sendChat("macros.js", `/w ${playerName} I could not find a character named ${characterName} to create macros for.`);
                }
            } else {
                sendChat("macros.js", `/w ${playerName} To use the Macros script, you must set your "As:" value (below this window) to your character.`);
            }
        }
    });
});
