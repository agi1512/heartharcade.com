<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="img/favicon.png">

    <title>HearthArcade</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/game.css" rel="stylesheet">
    <link href="css/TimeCircles.css" rel="stylesheet">
</head>

<body>

<!-- Navigation -->
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div>
            <a class="navbar-brand" href="#">HearthArcade</a>
            <ul class="nav navbar-nav">
                <li>
                    <a href="#">Goals</a>
                </li>
                <li>
                    <a href="#">Report a Bug</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Page Content -->
<div class="container">
    <div class="row gamewrapper">
        <div id="login" class="overlay">
            <span>
                <img src="images/gui/logoglow.png">
                <br>Please connect with Twitch.
                <br><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" class="twitch-connect" href="#" />
        </div>
        <div class="col-lg-9 board">
            <div id="timer" data-timer="15"></div>
            <div id="choice" class="overlay" style="display: none">
                <span>Choose:</span><br>
                <ul id="mulligan">
                </ul>
            </div>
            <ul id="oHand" class="hand">
            </ul>
            <ul id="oField" class="field">
            </ul>
            <ul id="fField" class="field">
            </ul>
            <ul id="fHand" class="hand">
            </ul>
            <div id="fMana" class="manabar">
                <div class="count">
                <span></span>
                </div>
            <ul class="crystals">
            </ul>
            </div>
            <div id="oMana" class="manabar">
                <div class="count">
                    <span></span>
                </div>
                <ul class="crystals">
                </ul>
            </div>
        </div>
        <div class="col-lg-3 side">
            <div id="oDeck" class="deck"><span></span></div>
            <div id="oHero" class="hero"><span class="atk"></span><span class="armor"></span><span class="hp"></span></div>
            <div id="fHero" class="hero"><span class="atk"></span><span class="armor"></span><span class="hp"></span></div>
            <div id="fDeck" class="deck"><span></span></div>
            <div id="endButton" class="sidebutton"></div>
            <div id="timeButton" class="sidebutton"></div>
            <div id="fWeapon" class="weapon"><span class="atk"></span><span class="dur"></span></div>
            <div id="oWeapon" class="weapon"><span class="atk"></span><span class="dur"></span></div>
            <div id="fPower" class="power"><span></span></div>
            <div id="oPower" class="power"><span></span></div>
        </div>
    </div>
    <span class="copyright">Copyright © HearthArcade, 2015. All copyrighted images and content are property of Blizzard Entertainment, Inc. <a href="http://playhearthstone.com">Click here</a> to play Hearthstone!</span>

    <!-- /.row -->

</div>
<!-- /.container -->


<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://ttv-api.s3.amazonaws.com/twitch.min.js"></script>
<script src="//js.pusher.com/2.2/pusher.min.js" type="text/javascript"></script>
<script src="/js/tinysort.min.js"></script>
<script src="/js/TimeCircles.js"></script>
<script src="/js/game.js"></script>
</body>

</html>