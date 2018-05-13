const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');
const prefix = '&';
var plugBotOnline = false;
var checkSongs = true;
var lastSong;

bot.on('ready', () => {
    //bot.user.setActivity('être un bot (&help bientôt ?)');
    bot.user.setActivity('son code', { type: 'WATCHING' });
    console.log(`Logged in as ${bot.user.tag}!`);
});

//TODO : re-write conditions for commands like fav (json)

bot.on('message', msg => {
    if (msg.author.id != bot.user.id) {
        if (msg.guild.id == '192276398348435456' && msg.channel.name == 'plug-log' && msg.content.charAt(0) != prefix) {
            if (plugBotOnline) {
                msg.delete(500);
                mp.chat(`${msg.author.username} (discord) : ${msg.content}`);
            } else
                msg.channel.send('Le bot plug.dj n\'est pas encore en ligne, veuillez patienter un peu...');
        } else if (msg.content.startsWith(prefix)) {
            var cmd = msg.content.split(" ")[0].substring(prefix.length); // 1 -> prefix length
            var args = msg.content.substring(cmd.length + prefix.length + 1) // +1 for " "
            // PING
            if (cmd === 'ping')
                msg.channel.send(`${msg.author} pong !`);
            // FORTNITE
            else if (cmd === "fortnite") {
                msg.delete();
                msg.channel.send(`@everyone : ${msg.author} a lancé le Fortnite signal !`, {
                    files: [
                        "./fortnite_signal.jpg"
                    ]
                });
            }
            // CLEAR
            else if (cmd === "clear") {
                if (msg.member.hasPermission(0x00002000, false, true, true)) {
                    if (!isNaN(args)) {
                        args = parseInt(args, 10);
                        if (args > 0 && args <= 100) {
                            msg.react('✅');

                            msg.channel.send('Chargement des messages à supprimer en cours...').then(message => {
                                msg.channel.fetchMessages({limit: args, before: msg.id}).then(list => {
                                    msg.channel.bulkDelete(list, true);
                                    msg.delete(5000);
                                    msg.channel.fetchMessage(message.id).then(message => message.edit(`**${list.size} messages supprimés !** *(suppression de ce message dans 5 secondes)*`)).then(editedMsg => editedMsg.delete(5000));
                                });
                            });                            
                        } else {
                            msg.react('❌');
                            msg.channel.send(`**${msg.author} : Le nombre de messages à supprimer doit être compris entre 1 et 100 inclus.**`);
                        }
                    } else {
                        msg.react('❌');
                        msg.channel.send(`**${msg.author} - Syntaxe : \`&clear <1-100>\`**`);
                    }
                } else {
                    msg.react('❌');
                    msg.channel.send(`**${msg.author} : permissions insuffisantes.**`);
                }
            }
            // ITA
            else if (cmd === "ita") {
                if (args == "") {
                    msg.react('✅');

                    var images = new Array();

                    var url = 'http://www.imposetonanonymat.com/page/' + Math.floor((Math.random() * 1033) + 1);
                    request(url, function(err, resp, body) {
                        $ = cheerio.load(body);
                        links = $('img'); //jquery get all hyperlinks
                        $(links).each(function(i, link){
                            if ($(link).attr('src').startsWith('http://78.media.tumblr.com/')|| $(link).attr('src').startsWith('https://78.media.tumblr.com/')) {
                                images.push($(link).attr('src'));
                            }
                        });

                        msg.channel.send(images[Math.floor(Math.random() * images.length)]);
                    });
                } else if (!isNaN(args)) {
                    args = parseInt(args, 10);
                    if (args > 0 && args <= 10) {
                        msg.react('✅');

                        var images = new Array();

                        var url = 'http://www.imposetonanonymat.com/page/' + Math.floor((Math.random() * 1032) + 1);
                        request(url, function(err, resp, body) {
                            $ = cheerio.load(body);
                            links = $('img'); //jquery get all hyperlinks
                            $(links).each(function(i, link){
                                if ($(link).attr('src').startsWith('http://78.media.tumblr.com/') || $(link).attr('src').startsWith('https://78.media.tumblr.com/')) {
                                    images.push($(link).attr('src'));
                                }
                            });

                            var str = "";
                            for (var i = 0; i < args; i++) {
                                var random = Math.floor(Math.random() * images.length);
                                str += images[random] + '\n';
                                //console.log("Index n°" + random + " : " + images[random]);
                                images.splice(random, 1);
                            }
                            msg.channel.send(str);
                            //msg.channel.send(images[Math.floor(Math.random() * images.length)]);
                        });
                    } else {
                        msg.react('❌');
                        msg.channel.send(`**${msg.author} : Le nombre de photos à envoyer doit être compris entre 1 et 10 inclus.**`);
                    }
                } else {
                    msg.react('❌');
                    msg.channel.send(`**${msg.author} - Syntaxe : \`&ita [1-10] ([] = facultatif)\`**`);
                }                

                /*msg.channel.send('', {
                    files: [
                        images[Math.floor(Math.random() * images.length)]
                    ]
                });*/

            }
        }
    }
});

bot.login('XXX');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const miniplug = require('miniplug');
const { MUTE_DURATION } = require('miniplug');
const { MUTE_REASON } = require('miniplug');
const { ROLE } = require('miniplug');

const mp = miniplug({
    email: 'XXX',
    password: 'XXX'
});


var crystalbot = async function () { // Function regrouping all

    mp.join('crystal-music').then(() => {
        mp.chat('CrystalBot en ligne. Développé par BlueskyFR :)');
        main();
        plugBotOnline = true;
    })

    const getHistory = async () => {
        const hist = async () => {
            return await mp.getRoomHistory();
        }
        let result = await hist();
        return result;
    };
    var history;
    history = await getHistory();

    function main() {
        registerEvents(true);
        if (mp.dj() !== null)
            mp.woot();
    }

    var skipped = false;

    async function eventAdvance(next, previous) {
        history = await getHistory();
        //TODO: AUTO-DELETE SELF MESSAGES
        // Display stats if not skipped before

        //if (previous) console.log(previous.score.positive);
        //    console.log("previous : " + previous.media.title);
        //    console.log("next : " + next.media.title);
        //    if (next) console.log(next.score.positive);

        if (previous) {
            if (previous.media.duration <= 420 && history[1].score != null) {
                mp.chat(`${previous.user.username} vient de passer ${previous.media.author} ${previous.media.title} : ${history[0].score.positive} :white_check_mark:, ${history[0].score.grabs} :star: et ${history[0].score.negative} :x:`);
            }
        }

        skipped = false;

        if (next) {
            mp.woot();
            // Check history
            lastSong = next;
            if (checkSongs)
                checkSong(next);
        }
    }

    async function checkSong(song) {
        mp.getRoomHistory().then((history) => {
            const isSameEntry = (entry) => entry.media.cid === song.media.cid
            if (history.some(isSameEntry)) {
                song.skip();
                skipped = true;
                mp.moveDJ(song.user.id, 2);
                mp.chat(`[@${song.user.username}] : Cette musique est déjà passée récemment...`);
            }
        });

        // Check duration
        if (!skipped && song.media.duration > 420) {
            song.skip();
            skipped = true;
            mp.moveDJ(song.user.id, 2);
            mp.chat(`[@${song.user.username}] : Musique trop longue (+ de 7 min).`);
        }
    }

    function eventChat(msg) {

        console.log(msg.un + " : " + msg.message);
        //console.log(bot.guilds);
        const channel = bot.guilds.find('id', '192276398348435456').channels.find('name', 'plug-log');
        if (channel) {
            const embed = new Discord.RichEmbed()
            .setTitle(msg.un)
            .setURL('https://plug.dj/crystal-music')
            .setColor([16, 136, 234])
            .setAuthor('Plug.dj chat')
            .setDescription(msg.message)
            .setFooter('via Plug.dj');

            channel.send(embed);
        }

        //Expiration timeout for self messages
        if (msg.uid == mp.me().id) {
            setTimeout(() => {
                mp.deleteChat(msg.cid);
            }, 120000); // 120 sec cooldown before deleting
        }

        if (/^!skip/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!skip')) {
                mp.historyEntry().skip();
                mp.chat(`[@${msg.un}] : Votre musique ne correspond pas au style du salon.`);
            }
        } else if (/^!lock/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!lock')) {
                mp.lockWaitlist();
            }
        } else if (/^!unlock/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!unlock')) {
                mp.unlockWaitlist();
            }
        } else if (/^!clear/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!clear')) {
                mp.lockWaitlist();
                mp.waitlist().forEach((user, position) => {
                    mp.removeDJ(user.id);
                })
            }
        } else if (/^!start/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!start')) {
                if (!plugBotOnline) {
                    registerEvents();
                    plugBotOnline = true;
                    mp.chat(`CrystalBot redémarré par @${msg.un}.`);
                    console.log(`CrystalBot redémarré par @${msg.un}.`);
                    if (lastSong)
                        checkSong(lastSong);
                } else
                    mp.chat(`[@${msg.un} - !start] Erreur : le bot est déjà en ligne.`);
            }
        } else if (/^!stop/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!stop')) {
                if (plugBotOnline) {
                    unregisterEvents();
                    plugBotOnline = false;
                    mp.chat(`CrystalBot arrêté par @${msg.un}.`);
                    console.log(`CrystalBot arrêté par @${msg.un}.`);
                } else
                    mp.chat(`[@${msg.un} - !stop] Erreur : le bot n'est pas en ligne.`);
            }
        } else if (/^!whoami/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            mp.chat(`[@${msg.un} - !whoami] User id : ${msg.uid}.`);
        } else if (/^!fav/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!unlock')) {
                mp.chat("N'oubliez pas d'ajouter la salle à vos favoris (coin supérieur gauche) !");
            }
        } else if (/^!ping/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            msg.reply("pong !");
        } else if (/^!fav/i.test(msg.message)) {
            mp.deleteChat(msg.cid);
            if (isManagerOrMore(msg, '!unlock')) {
                mp.chat("N'oubliez pas d'ajouter la salle à vos favoris (coin supérieur gauche) !");
            }
        } else if (/\bbo[ou]m\b/i.test(msg.message) && mp.me().username != msg.un) {
            msg.reply("biche");
        } else if (/connard/i.test(msg.message) && mp.me().username != msg.un) {
            msg.reply("Connard : Insulte désignant quelqu’un qui se comporte de façon déplaisante ou déplacée, par manque d’intelligence, de savoir-vivre ou de scrupules. Utilisé par les jeunes français décadents.");
        } else if (/\bsalop?e?\b/i.test(msg.message) && mp.me().username != msg.un) {
            msg.reply("va te faire fouttttttre ! (Mute pendant 15 min)");
            msg.user.mute(MUTE_DURATION.SHORT, MUTE_REASON.LANGUAGE);
        } else if (/\bpute\b/i.test(msg.message) && mp.me().username != msg.un) {
            msg.reply("c'est celui qui le dit qui l'est ! (Mute pendant 15 min)");
            msg.user.mute(MUTE_DURATION.SHORT, MUTE_REASON.LANGUAGE);
        } else if (/\syop\b/i.test(msg.message) && mp.me().username != msg.un) {
            msg.reply("c'est MON Yop !");
        } else if (/"@CrystalBot\b/.test(msg.message)) {
            mp.chat(`Je ne suis qu'un bot @${msg.un}... Je ne peux pas te répondre !`);
        }
    }

    function eventLogin(user) {
        mp.chat(`Bienvenue @${user.username} !`);
        const channel = bot.guilds.find('id', '192276398348435456').channels.find('name', 'plug');
        if (channel)
            channel.send(`${channel.guild.roles.find('name', 'Plug')} : ${user.username} est en ligne sur Plug.dj !`).then(message => {
                message.delete(600000);
            });
    }


    function isManagerOrMore(data, action) {

        if (mp.user(data.uid).hasPermission(ROLE.MANAGER)) {
            console.log(data.un + " : " + action + " - Autorisé");
            return true;
        } else {
            mp.chat(`[@${data.un} - ${action}] Vous n'avez pas la permission d'effectuer cette action.`);
            console.log(data.un + " : " + action + " - Refusé");
            return false;
        }
    }

    function registerEvents(startup = false) {
        checkSongs = true;
        if (startup) {
            mp.on('advance', eventAdvance);
            mp.on('chat', eventChat);
            mp.on('userJoin', eventLogin);
        }
    }

    function unregisterEvents() {
        checkSongs = false;
        //mp.removeListener('userJoin', eventLogin);
    }

    var stdin = process.openStdin();

    // Listens for input in node.js console
    stdin.addListener("data", (data) => {
        // Deletes the linefeed at the end of the command
        var command = data.toString().trim();
        if (/^start/i.test(command)) {
            if (!plugBotOnline) {
                registerEvents();
                plugBotOnline = true;
                mp.chat("CrystalBot redémarré par le serveur.");
                console.log("CrystalBot redémarré par le serveur.");
            } else
                console.log("Erreur : le bot est déjà en ligne.");
        } else if (/^stop/i.test(command)) {
            if (plugBotOnline) {
                unregisterEvents();
                plugBotOnline = false;
                mp.chat("CrystalBot arrêté par le serveur.");
                console.log("CrystalBot arrêté par le serveur.");
            } else
                console.log("Erreur : le bot n'est pas en ligne.")
        } else if(/^exit/i.test(command)) {
            process.exit();
        }
    });
}

crystalbot();