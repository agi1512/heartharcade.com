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