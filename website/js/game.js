window.CLIENT_ID = 'duqiagqwmt19xptq1by2khc31uanwf';
$(function() {
    // Initialize. If we are already logged in, there is no
    // need for the connect button
    Twitch.init({clientId: CLIENT_ID}, function(error, status) {
        if (error) {
            // error encountered while loading
            console.log(error);
        }
        if (status.authenticated) {
            $('#login').hide()
            var state = {
                "thisIsOnPopState": true
            };
            history.pushState(state, "HearthArcade", "/");
        }
        else{
            if(window.location.href.indexOf("access_denied")==-1){
                Twitch.login({
                    scope: ['user_read', 'channel_read']
                });
            }
        }
    });
});
$("#timer").TimeCircles({
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

var pusher = new Pusher('');
var channel = pusher.subscribe('test_channel');
channel.bind('my_event', function(data) {
    brd = atob(data.message)
    board=JSON.parse(brd);
    console.log(board);
    fOL=0;
    oOL=0;
    $("#timer").TimeCircles().restart();
    setBoard();
});


$.getJSON("../json/cards.json", function(json) {
    cards=json;
});
$( document ).on( "click", ".playable", function() {
    id=$(this).data("id");
    $.each(board['opts'], function( index, opt ) {
        if(opt['id']==id){
            console.log(opt);
            if(opt['tgts'].length>0){
                console.log("targets");
            }
        }
    });
});
function setBoard(){
    //FRIENDLY HAND
    if(board['type']=='play'){
        $('#choice').hide();
        $('#choice .hand').empty();
        $('#fHand').empty();
        $.each(board['fHand'], function( index, card ) {
            cardLi = $('<li class="card"></li>');
            cardLi.css('background-size','contain');
            cardLi.attr('data-id', card['id']);
            cardLi.attr('data-position', card['pos']);
            bg = 'url("../images/cards/'+card['card']+'.png")';
            if(checkOptions(card['id'])==true){
                cardLi.addClass('playable');
                glow = getGlow(card['card'],cards);
                bg=bg+', url("../images/gui/'+glow+'glow.png")'
                cardLi.addClass('playable');
            }
            cardLi.css('background-image',bg);
            $("#fHand").append(cardLi);
        });
        //OPPONENT HAND
        $('#oHand').empty();
        for (i = 0; i < board['oHand']; i++) {
            cardLi = $('<li class="hiddencard"></li>');
            $("#oHand").append(cardLi);
        }

    }
    else if(board['type']=='mulligan'){
        $('#fHand').empty();
        $('#oHand').empty();
        $('#choice #mulligan').empty();
        $('#choice').show();
        $.each(board['fHand'], function( index, card ) {
            cardLi = $('<li class="card"></li>');
            cardLi.css('background-size','contain');
            cardLi.attr('data-id', card['id']);
            cardLi.attr('data-position', card['pos']);
            bg = 'url("../images/cards/'+card['card']+'.png")';
            if(checkOptions(card['id'])==true){
                cardLi.addClass('playable');
                glow = getGlow(card['card'],cards);
                bg=bg+', url("../images/gui/'+glow+'glow.png")'
                cardLi.addClass('playable');
            }
            cardLi.css('background-image',bg);
            if(card['card']!='GAME_005'){
                $('#choice #mulligan').append(cardLi);
            }
            tinysort('ul#mulligan>li',{data:'position'});
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
    if($("#fHand li").length>0){
        tinysort('ul#fHand>li',{data:'position'});
    }
    if($("#oField li").length>0) {
        tinysort('ul#oField>li',{data:'position'});
    }
    if($("#fField li").length>0){
        tinysort('ul#fField>li',{data:'position'});
    }

}
function getArt(cardID,cards){
    art="";
    $.each(cards, function( index, cardset ) {
        $.each(cardset, function( ind, card ) {
            if (card['id']==cardID){
                art = card['asset'];
                return false;
            }
        });
        if(art!=""){
            return false;
        }
    });
    return art;
}
function getGlow(cardID,cards){
    glow="";
    $.each(cards, function( index, cardset ) {
        $.each(cardset, function( ind, card ) {
            if (card['id']==cardID){
                if (card['type']=="Spell"){
                    glow="spell";
                }
                else if(card['type']=="Weapon"){
                    glow='weapon';
                }
                else if(card['type']=="Minion"){
                    if(card['rarity']=="Legendary"){
                        glow='legendaryminion';
                    }
                    else {
                        glow = 'minion';
                    }
                }
                return false;
            }
        });
        if(glow!=""){
            return false;
        }
    });

    return glow;
}
function setupMinions(p){
    $('#'+p+'Field').empty();
    $.each(board[p+'Play'], function( index, card ) {
        minionLi=$('<li class="minion"><span class="atk"></span><span class="hp"></span><span class="popup"><img src="../images/cards/'+card['card']+'.png"></span></li>');
        minionLi.find('.hp').text(card['hp']-card['dmg']);
        minionLi.find('.atk').text(card['atk']);
        if(card['dmg']>0){
            minionLi.find('.hp').addClass('damaged');
        }
        else{
            minionLi.find('.hp').removeClass('damaged');
        }
        art=getArt(card['card'],cards);

        bg='url("../images/minions/art/'+art+'.png")';

        if (card['tags'].indexOf("STEALTH")!=-1){
            bg='url("../images/minions/parts/stealth.png"), '+bg;
        }
        if (card['tags'].indexOf("TAUNT")!=-1){
            bg='url("../images/minions/parts/taunt.png"), '+bg;
            if(checkOptions(card['id'])==true){
                minionLi.addClass('playable');
                bg=bg+', url("../images/minions/parts/tauntglow.png")'
            }
            if (card['tags'].indexOf("FROZEN")!=-1){
                bg='url("../images/minions/parts/frozentaunt.png"), '+bg;
            }
        }
        else{
            bg='url("../images/minions/parts/regular.png"), '+bg;
            if(checkOptions(card['id'])==true){
                minionLi.addClass('playable');
                bg=bg+', url("../images/minions/parts/regularglow.png")'
            }
            if (card['tags'].indexOf("FROZEN")!=-1){
                bg='url("../images/minions/parts/frozenregular.png"), '+bg;
            }
        }
        if (card['tags'].indexOf("TRIGGER")!=-1){
            bg='url("../images/minions/parts/trigger.png"), '+bg;
        }
        if (card['tags'].indexOf("DEATHRATTLE")!=-1){
            bg='url("../images/minions/parts/deathrattle.png"), '+bg;
        }
        if (card['tags'].indexOf("POISONOUS")!=-1){
            bg='url("../images/minions/parts/poisonous.png"), '+bg;
        }
        if (card['tags'].indexOf("DIVINE")!=-1){
            bg='url("../images/minions/parts/divine.png"), '+bg;
        }
        if (card['tags'].indexOf("WINDFURY")!=-1){
            bg='url("../images/minions/parts/windfury.png"), '+bg;
        }
        if (card['tags'].indexOf("SPELLPOWER")!=-1){
            bg='url("../images/minions/parts/spellpower.png"), '+bg;
        }
        if (card['tags'].indexOf("SILENCED")!=-1){
            bg='url("../images/minions/parts/silence.png"), '+bg;
        }

        minionLi.css('background-image',bg);
        minionLi.attr('data-id', card['id']);
        minionLi.attr('data-position', card['pos']);


        $("#"+p+"Field").append(minionLi);
    });
}
function setupMana(p){
    $('#'+p+'Mana .crystals').empty();
    max=board[p+'Mana']['max'];
    use=board[p+'Mana']['use'];
    $("#"+p+"Mana .count span").text((max-use)+"/"+max);
    for (i = 0; i < board[p+'Mana']['max']; i++) {
        crystal = $('<li></li>');
        if(i<max-use){
            crystal.addClass("full")
        }
        else{
            if(i<max-fOL){
                crystal.addClass("used")
            }
            else{
                crystal.addClass("locked")
            }

        }

        $("#"+p+"Mana .crystals").append(crystal);

    };
}
function setupHero(p){
    bg='url("../images/cards/'+board[p+'Hero']['card']+'.png")';
    if (board[p+'Hero']['tags'].indexOf("FROZEN")!=-1){
        bg='url("../images/heroes/frozen.png"), '+bg;
    }
    bg='url("../images/heroes/health.png"), '+bg;
    if(board[p+'Hero']['arm']!=0){
        bg = 'url("../images/heroes/armor.png"),'+bg;
        $("#"+p+"Hero .armor").text(board[p+'Hero']['arm']);
    }
    else{
        $("#"+p+"Hero .armor").text("");
    }
    if(board[p+'Hero']['atk']!=0){
        bg = 'url("../images/heroes/attack.png"),'+bg;
        $("#"+p+"Hero .atk").text(board[p+'Hero']['atk']);
    }
    else{
        $("#"+p+"Hero .atk").text("");
    }
    if(board[p+'Hero']['dmg']>0) {
        $("#"+p+"Hero .hp").text(board[p+'Hero']['hp']-board[p+'Hero']['dmg']);
        $("#"+p+"Hero .hp").addClass('damaged');
    }
    else{
        $("#"+p+"Hero .hp").text(board[p+'Hero']['hp']);
        $("#"+p+"Hero .hp").removeClass('damaged');
    }
    if(checkOptions(board[p+'Hero']['id'])==true){
        $("#"+p+"Hero").addClass('playable');
        bg=bg+', url("../images/gui/heroglow.png")'
    }
    else{
        $("#"+p+"Hero").removeClass('playable');
    }
    if(board[p+'Secrets'].length>0){
        bg = 'url("../images/heroes/secrets/mage/'+board[p+'Secrets'].length+'.png"),'+bg;
    }
    $("#"+p+"Hero").css('background-image',bg);
    $("#"+p+"Hero").attr('data-id', board[p+'Hero']['id']);
}
function setupPower(p){
    if(board[p+'Power']['exh']==0){
        bg='url("../images/gui/powerframe.png"),url("../images/powers/'+board[p+'Power']['card']+'.png")';
        $("#"+p+"Power span").text(board[p+'Power']['cost']);
        if(checkOptions(board[p+'Power']['id'])==true){
            $("#"+p+"Power").addClass('playable');
            bg=bg+', url("../images/gui/powerglow.png")'
        }
        else{
            $("#"+p+"Power").removeClass('playable');
        }
    }
    else{
        bg='url("../images/gui/powerclosed.png")';
        $("#"+p+"Power span").text("");
        $("#"+p+"Power").removeClass('playable');
    }
    $("#"+p+"Power").attr('data-id', board[p+'Power']['id']);
    $("#"+p+"Power").css('background-image',bg);

}
function setupWeapon(p){
    if(board[p+'Weapon']!=null){
        bg='url("../images/gui/weapon.png"),url("../images/weapons/'+board[p+'Weapon']['card']+'.png")';
        $("#"+p+"Weapon .atk").text(board[p+'Weapon']['atk']);
        if(board[p+'Weapon']['dmg']>0){
            $("#"+p+"Weapon .dur").text(board[p+'Weapon']['dur']-board[p+'Weapon']['dmg']);
            $("#"+p+"Weapon .dur").addClass('damaged');
        }
        else{
            $("#"+p+"Weapon .dur").text(board[p+'Weapon']['dur']);
            $("#"+p+"Weapon .dur").removeClass('damaged');
        }
        $("#"+p+"Weapon").css('background-image',bg);
    }
    else{
        $("#"+p+"Weapon .atk").text("");
        $("#"+p+"Weapon .dur").text("");
        $("#"+p+"Weapon").css('background-image',"none");
    }


}
function checkOptions(cid){
    found = false;
    $.each(board['opts'], function( index, opt ) {
        if(opt['id']==cid){
            found = true;
        }
        if(found!=false){
            return false;
        }
    });
    return found;
}
function getCardData(cardID){
    $.each(cards, function( index, cardset ) {
        cardData="";
        $.each(cardset, function( ind, card ) {
            if (card['id']==cardID){
                cardData = card;
                return false;
            }
        });
        if(cardData!=""){
            return false;
        }
    });
    return cardData;
}
