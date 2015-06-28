var justopened = true;
$(".side").children().hide();
timer = $("#timer");
timer.hide();
waiting = $('#waiting');
waiting.hide();
window.CLIENT_ID = 'duqiagqwmt19xptq1by2khc31uanwf';
$(function() {
    // Initialize. If we are already logged in, there is no
    // need for the connect button
    Twitch.init({
        clientId: CLIENT_ID
    }, function(error, status) {
        if (error) {
            // error encountered while loading
            console.log(error);
        }
        if (status.authenticated) {
            $('#login').hide();
            var state = {
                "thisIsOnPopState": true
            };
            history.pushState(state, "HearthArcade", "/");

            var pusher = new Pusher('86740476b2bb82dbe0df');
            var channel = pusher.subscribe('test_channel');
            channel.bind('my_event', function(data) {
                if (justopened == true) {
                    $(".side").children().show();
                    $("#timer").hide();
                    justopened = false;
                }
                waiting.hide();
                brd = atob(data.message)
                board = JSON.parse(brd);
                fOL = 0;
                oOL = 0;
                timer.data('timer',board['time']);
                timer.TimeCircles({"total_duration": board['time']}).restart();
                timer.show();
                setBoard();
            });
        }
    });
});
timer.TimeCircles({
    "animation": "smooth",
    "total_duration": 15,
    "count_past_zero": false,
    "bg_width": 1.2,
    "fg_width": 0.1,
    "circle_bg_color": "#60686F",
    "time": {
        "Days": {
            "text": "Days",
            "color": "#40484F",
            "show": false
        },
        "Hours": {
            "text": "Hours",
            "color": "#40484F",
            "show": false
        },
        "Minutes": {
            "text": "Minutes",
            "color": "#40484F",
            "show": false
        },
        "Seconds": {
            "text": "Seconds",
            "color": "#99CCFF",
            "show": true
        }
    }
});
$('.twitch-connect').click(function() {
    Twitch.login({
        scope: ['user_read', 'channel_read']
    });
});

$.getJSON("../json/cards.json", function(json) {
    cards = json;
});
$(document).on("click", "#mulligan .card", function() {
    $(this).find(".icon").toggle();
});
$('#endButton button').click(function(){
    vote(board['optid'], "end", -1, -1, -1);
});
$('#timeButton button').click(function(){
    vote(board['optid'], "pause", -1, -1, -1);
});
$('#mulliganVote').click(function(){
    mull=[];
    $('#mulligan .card').each(function() {
            if ($(this).find('.icon').is(":hidden")) {
                mull.push($(this).data('id'));
            }
    });
    x=mull.length;
    for (i = 0; i < 4-x; i++) {
        mull.push(-1);
    }
    vote("mulligan", mull[0], mull[1], mull[2], mull[3]);
});

$(document).on("click", ".suboption", function() {
    source = $('.source').data('id');
    position = $('.source').data('playposition');
    id = $(this).data('id');
    $.each(board['opts'], function(index, opt) {
        if (opt['id'] == source) {
            $.each(opt['subs'], function(index, subopt) {
                if (subopt['id'] == id) {
                    option = subopt;
                    return false;
                }
            });
            return false;
        }
    });
    if (option['tgts'].length > 0) {
        $('.source').data('sub', id);
        $('#subopts').empty().hide();
        $(".minion, .hero, .card, .weapon, .power").each(function(index) {
            if (option['tgts'].indexOf($(this).data('id')) != -1) {
                $(this).addClass("targetable");
                $(this).find(".glow").show();
            }
        });
    } else {
        vote(board['optid'], source, id, -1,position);
    };

});
$(document).on("click", ".playable", function() {
    playedcard=$(this);
    if ($(this).data('type') == "minion" && $('#fField li').length>0) {
        $('#fField').append('<li class="minion"><img class="placeholder" src="../images/gui/placeholder.png"></li>')
        $('#fField').sortable({
            handle: ".placeholder",
            disabled: false,
            axis: 'x',
            containment: "parent",
            stop: function(event, ui) {
                var Newpos = ui.item.index();
                playCard(Newpos+1,playedcard)

            }
        }).disableSelection()
    } else {
        playCard(-1,playedcard);
    }

});
$(document).on("click", ".targetable", function() {
    vote(board['optid'], $('.source').data('id'), $('.source').data('sub'), $(this).data('id'), $('.source').data('playposition'));
});

function setBoard() {
    //FRIENDLY HAND
    $('#mulligan').empty();
    $('#subopts').empty().hide();
    if (board['type'] == 'play') {
        $('#choice').hide();
        $('#fHand').empty();
        $.each(board['fHand'], function(index, card) {
            cardLi = $('<li class="card"></li>');
            cardLi.attr('data-id', card['id']);
            cardLi.attr('data-position', card['pos']);
            glow = getGlow(card['card'], cards);
            cardLi.append('<img class="part glow" src="../images/gui/' + glow + 'glow.png">');
            cardLi.append('<img class="part art" src="../images/cards/' + card['card'] + '.png">');
            cardLi.append('<img class="part icon" src="../images/gui/cardmana.png">');
            cardLi.append('<span class="cost">' + card['cost'] + '</span>');
            cardLi.data('type', getType(card['card'], cards));
            $("#fHand").append(cardLi);
        });
        //OPPONENT HAND
        $('#oHand').empty();
        for (i = 0; i < board['oHand']; i++) {
            cardLi = $('<li class="hiddencard"></li>');
            $("#oHand").append(cardLi);
        }

    } else if (board['type'] == 'mulligan') {
        $('#fHand').empty();
        $('#oHand').empty();
        $('#choice').show();
        $.each(board['fHand'], function(index, card) {
            cardLi = $('<li class="card"></li>');
            cardLi.css('background-size', 'contain');
            cardLi.attr('data-id', card['id']);
            cardLi.attr('data-position', card['pos']);
            glow = getGlow(card['card'], cards);
            cardLi.append('<img class="part glow" src="../images/gui/' + glow + 'glow.png">');
            cardLi.append('<img class="part art" src="../images/cards/' + card['card'] + '.png">');
            cardLi.append('<img class="part icon" src="../images/gui/mulligan_X.png">');
            if (card['card'] != 'GAME_005') {
                $('#mulligan').append(cardLi);
            }
            tinysort('ul#mulligan>li', {
                data: 'position'
            });
        });

    }
    //DECKS
    $("#fDeck span").text(board['fDeck']);
    $("#oDeck span").text(board['oDeck']);

    setupHero("f");
    setupHero("o");
    setupMana("f");
    setupMana("o");
    setupMinions("f");
    setupMinions("o");
    setupPower("f");
    setupPower("o");
    setupWeapon("f");
    setupWeapon("o");
    if ($("#fHand li").length > 0) {
        tinysort('ul#fHand>li', {
            data: 'position'
        });
    }
    if ($("#oField li").length > 0) {
        tinysort('ul#oField>li', {
            data: 'position'
        });
    }
    if ($("#fField li").length > 0) {
        tinysort('ul#fField>li', {
            data: 'position'
        });
    }
    $(".minion, .hero, .card, .weapon, .power").each(function(index) {
        if (checkOptions($(this).data('id')) == true) {
            $(this).find(".glow").show();
            $(this).addClass("playable");
        }
    });

}

function getArt(cardID, cards) {
    art = "";
    $.each(cards, function(index, cardset) {
        $.each(cardset, function(ind, card) {
            if (card['id'] == cardID) {
                art = card['asset'];
                return false;
            }
        });
        if (art != "") {
            return false;
        }
    });
    return art;
}

function getGlow(cardID, cards) {
    glow = "";
    $.each(cards, function(index, cardset) {
        $.each(cardset, function(ind, card) {
            if (card['id'] == cardID) {
                if (card['type'] == "Spell") {
                    glow = "spell";
                } else if (card['type'] == "Weapon") {
                    glow = 'weapon';
                } else if (card['type'] == "Minion") {
                    if (card['rarity'] == "Legendary") {
                        glow = 'legendaryminion';
                    } else {
                        glow = 'minion';
                    }
                }
                return false;
            }
        });
        if (glow != "") {
            return false;
        }
    });

    return glow;
}

function getType(cardID, cards) {
    type = "";
    $.each(cards, function(index, cardset) {
        $.each(cardset, function(ind, card) {
            if (card['id'] == cardID) {
                if (card['type'] == "Spell") {
                    type = "spell";
                } else if (card['type'] == "Weapon") {
                    type = 'weapon';
                } else if (card['type'] == "Minion") {
                    type = 'minion';
                }
                return false;
            }
        });
        if (type != "") {
            return false;
        }
    });

    return type;
}

function setupMinions(p) {
    $('#' + p + 'Field').empty();
    $.each(board[p + 'Play'], function(index, card) {
        minionLi = $('<li class="minion"><span class="popup"><img src="../images/cards/' + card['card'] + '.png"></span></li>');
        if (card['dmg'] > 0) {
            minionLi.find('.hp').addClass('damaged');
        } else {
            minionLi.find('.hp').removeClass('damaged');
        }
        art = getArt(card['card'], cards);
        minionLi.append('<img class="part art" src="../images/minions/art/' + art + '.png">');
        if (card['tags'].indexOf("STEALTH") != -1) {
            minionLi.append('<img class="part effect" src="../images/minions/parts/stealth.png">');
        }
        if (card['tags'].indexOf("TAUNT") != -1) {
            minionLi.append('<img class="part glow" src="../images/minions/parts/tauntglow.png">');
            minionLi.append('<img class="part frame" src="../images/minions/parts/taunt.png">');
            if (card['tags'].indexOf("FROZEN") != -1) {
                minionLi.append('<img class="part effect" src="../images/minions/parts/frozentaunt.png">');
            }
        } else {
            minionLi.append('<img class="part glow" src="../images/minions/parts/regularglow.png">');
            minionLi.append('<img class="part frame" src="../images/minions/parts/regular.png">');
            if (card['tags'].indexOf("FROZEN") != -1) {
                minionLi.append('<img class="part effect" src="../images/minions/parts/frozenregular.png">');
            }
        }
        if (card['tags'].indexOf("TRIGGER") != -1) {
            minionLi.append('<img class="part icon" src="../images/minions/parts/trigger.png">');
        }
        if (card['tags'].indexOf("DEATHRATTLE") != -1) {
            minionLi.append('<img class="part icon" src="../images/minions/parts/deathrattle.png">');
        }
        if (card['tags'].indexOf("POISONOUS") != -1) {
            minionLi.append('<img class="part icon" src="../images/minions/parts/poisonous.png">');
        }
        if (card['tags'].indexOf("DIVINE") != -1) {
            minionLi.append('<img class="part effect" src="../images/minions/parts/divine.png">');
        }
        if (card['tags'].indexOf("WINDFURY") != -1) {
            minionLi.append('<img class="part effect" src="../images/minions/parts/windfury.png">');
        }
        if (card['tags'].indexOf("SPELLPOWER") != -1) {
            minionLi.append('<img class="part effect" src="../images/minions/parts/spellpower.png">');
        }
        if (card['tags'].indexOf("SILENCED") != -1) {
            minionLi.append('<img class="part effect" src="../images/minions/parts/silence.png">');
        }

        minionLi.append('<span class="atk"></span><span class="hp"></span>');
        minionLi.find('.hp').text(card['hp'] - card['dmg']);
        minionLi.find('.atk').text(card['atk']);
        minionLi.attr('data-id', card['id']);
        minionLi.attr('data-position', card['pos']);


        $("#" + p + "Field").append(minionLi);
    });
}

function setupMana(p) {
    $('#' + p + 'Mana .crystals').empty();
    max = board[p + 'Mana']['max'];
    use = board[p + 'Mana']['use'];
    $("#" + p + "Mana .count span").text((max - use) + "/" + max);
    for (i = 0; i < board[p + 'Mana']['max']; i++) {
        crystal = $('<li></li>');
        if (i < max - use) {
            crystal.addClass("full")
        } else {
            if (i < max - fOL) {
                crystal.addClass("used")
            } else {
                crystal.addClass("locked")
            }

        }

        $("#" + p + "Mana .crystals").append(crystal);

    };
}

function setupHero(p) {
    hero = $("#" + p + "Hero");
    hero.empty();
    hero.attr('class', 'hero');
    hero.append('<img class="part glow" src="../images/gui/heroglow.png">');
    hero.append('<img class="part art" src="../images/cards/' + board[p + 'Hero']['card'] + '.png">');
    if (board[p + 'Hero']['tags'].indexOf("FROZEN") != -1) {
        hero.append('<img class="part effect" src="../images/heroes/frozen.png">');
    }
    hero.append('<img class="part icon" src="../images/heroes/health.png">');
    hero.append('<span class="hp"></span><span class="atk"></span><span class="armor"></span>');
    if (board[p + 'Hero']['arm'] != 0) {
        hero.append('<img class="part icon" src="../images/heroes/armor.png">');
        hero.find('.armor').text(board[p + 'Hero']['arm']);
    } else {
        hero.find('.armor').text("");
    }
    if (board[p + 'Hero']['atk'] != 0) {
        hero.append('<img class="part icon" src="../images/heroes/attack.png">');
        hero.find('.atk').text(board[p + 'Hero']['atk']);
    } else {
        hero.find('.atk').text("");
    }
    if (board[p + 'Hero']['dmg'] > 0) {
        hero.find('.hp').text(board[p + 'Hero']['hp'] - board[p + 'Hero']['dmg']);
        hero.find('.hp').addClass('damaged');
    } else {
        hero.find('.hp').text(board[p + 'Hero']['hp']);
        hero.find('.hp').removeClass('damaged');
    }
    if (board[p + 'Secrets'].length > 0) {
        hero.append('<img class="part icon" src="../images/heroes/secrets/mage/' + board[p + 'Secrets'].length + '.png">');
    }
    hero.attr('data-id', board[p + 'Hero']['id']);
}

function setupPower(p) {
    power = $("#" + p + "Power");
    power.empty();
    if (board[p + 'Power']['exh'] == 0) {
        power.append('<img class="part glow" src="../images/gui/powerglow.png">');
        power.append('<img class="part art" src="../images/powers/' + board[p + 'Power']['card'] + '.png">');
        power.append('<img class="part frame" src="../images/gui/powerframe.png">');
        power.append('<span class="cost">' + board[p + 'Power']['cost'] + '</span>');
    } else {
        power.append('<img class="part frame" src="../images/gui/powerclosed.png">');
    }
    power.attr('data-id', board[p + 'Power']['id']);

}

function setupWeapon(p) {
    weapon = $("#" + p + "Weapon");
    weapon.empty()
    if (board[p + 'Weapon'] != null) {
        weapon.append('<img class="part art" src="../images/weapons/' + board[p + 'Weapon']['card'] + '.png">');
        weapon.append('<img class="part frame" src="../images/gui/weapon.png">');
        weapon.append('<span class="dur"></span><span class="atk">' + board[p + 'Weapon']['atk'] + '</span>');
        if (board[p + 'Weapon']['dmg'] > 0) {
            weapon.find('.dur').text(board[p + 'Weapon']['dur'] - board[p + 'Weapon']['dmg']);
            weapon.find('.dur').addClass('damaged');
        } else {
            weapon.find('.dur').text(board[p + 'Weapon']['dur']);
        }
        weapon.attr('data-id', board[p + 'Weapon']['id']);
    }

}

function checkOptions(cid) {
    found = false;
    $.each(board['opts'], function(index, opt) {
        if (opt['id'] == cid) {
            found = true;
        }
        if (found != false) {
            return false;
        }
    });
    return found;
}

function getCardData(cardID) {
    $.each(cards, function(index, cardset) {
        cardData = "";
        $.each(cardset, function(ind, card) {
            if (card['id'] == cardID) {
                cardData = card;
                return false;
            }
        });
        if (cardData != "") {
            return false;
        }
    });
    return cardData;
}

function vote(id, option, suboption, target, position) {
    waiting.show()
    var votedata = {
        id: id,
        opt: option,
        sub: suboption,
        tgt: target,
        pos: position
    };
    votedata=window.btoa(JSON.stringify(votedata));
    Twitch.api({method: 'user'}, function(error, user) {
        twitchID=user._id;
        $.ajax({
            type: "POST",
            url: "vote",
            data: { vote: votedata, user: twitchID }
        })
    });

}
function playCard(position, playedcard){
    id = playedcard.data('id');
    $.each(board['opts'], function(index, opt) {
        if (opt['id'] == id) {
            option = opt;
            return false;
        }
    });
    if (option['subs'].length > 0) {
        playedcard.addClass('source');
        playedcard.data('playposition',position);
        $(".minion, .hero, .card, .weapon, .power").each(function(index) {
            $(this).removeClass("playable");
            $(this).find(".glow").hide();
        });
        $.each(option['subs'], function(index, sub) {
            cardLi = $('<li class="card suboption"></li>');
            cardLi.attr('data-id', sub['id']);
            glow = getGlow(sub['card'], cards);
            cardLi.append('<img class="part glow" src="../images/gui/' + glow + 'glow.png">');
            cardLi.append('<img class="part art" src="../images/cards/' + sub['card'] + '.png">');
            $('#subopts').append(cardLi);
        });
        $('#subopts').show();
    } else if (option['tgts'].length > 0) {
        playedcard.addClass('source');
        playedcard.data('playposition',position);
        playedcard.data('sub', -1);
        $(".minion, .hero, .card, .weapon, .power").each(function(index) {
            $(this).removeClass("playable");
            if (option['tgts'].indexOf($(this).data('id')) != -1) {
                $(this).addClass("targetable");
                $(this).find(".glow").show();
            } else {
                $(this).find(".glow").hide();
            }
        });
    } else {
        vote(board['optid'], id, -1, -1, position);
    }
}