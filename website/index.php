<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="img/favicon.png">

    <title>HearthArcade</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/index.css" rel="stylesheet">
</head>

<body>

<!-- Navigation -->
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div>
            <a class="navbar-brand" href="#">Start Bootstrap</a>
            <ul class="nav navbar-nav">
                <li>
                    <a href="#">About</a>
                </li>
                <li>
                    <a href="#">Services</a>
                </li>
                <li>
                    <a href="#">Contact</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Page Content -->
<div class="container">

    <div class="row">
        <div class="col-lg-12">
            <h1>TwitchTV SDK Example App</h1>
            <div class="status">
                Status: <input readonly="readonly" size="60" val="Unknown"/>
            </div>
            <div class="authenticate hidden">
                <img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png" class="twitch-connect" href="#" />
            </div>

            <h2 class="authenticated hidden">Authenticated</h2>
            <div class="authenticated hidden">
                <div id="logout">
                    <button>Log Out</button>
                </div>

                <div id="get-name">
                    <button>Get TwitchTV Name</button>
                    <input readonly="readonly" size="50" value="Unknown"/>
                </div>

                <div id="get-stream-key">
                    <button>Get TwitchTV Stream Key</button>
                    <input readonly="readonly" size="50" value="Unknown"/>
                </div>

            </div>
        </div>
    </div>
    <!-- /.row -->

</div>
<!-- /.container -->


<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://ttv-api.s3.amazonaws.com/twitch.min.js"></script>

<script>
    window.CLIENT_ID = 'duqiagqwmt19xptq1by2khc31uanwf';
    $(function() {
        // Initialize. If we are already logged in, there is no
        // need for the connect button
        Twitch.init({clientId: CLIENT_ID}, function(error, status) {
            if (status.authenticated) {
                // we're logged in :)
                $('.status input').val('Logged in! Allowed scope: ' + status.scope);
                // Show the data for logged-in users
                $('.authenticated').removeClass('hidden');
            } else {
                $('.status input').val('Not Logged in! Better connect with Twitch!');
                // Show the twitch connect button
                $('.authenticate').removeClass('hidden');
            }
        });


        $('.twitch-connect').click(function() {
            Twitch.login({
                scope: ['user_read', 'channel_read']
            });
        })

        $('#logout button').click(function() {
            Twitch.logout();

            // Reload page and reset url hash. You shouldn't
            // need to do this.
            window.location = window.location.pathname
        })

        $('#get-name button').click(function() {
            Twitch.api({method: 'user'}, function(error, user) {
                $('#get-name input').val(JSON.stringify(user));

            });
        })

        $('#get-stream-key button').click(function() {
            Twitch.api({method: 'channel'}, function(error, channel) {
                $('#get-stream-key input').val(JSON.stringify(channel));
            });
        })

    });
</script>
</body>

</html>