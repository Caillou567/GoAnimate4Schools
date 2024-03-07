const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/player": {
			title = "Your Animation";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "http://localhost/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 60,
					thumbnailURL: "http://localhost/movie_thumbs/${mId}.png",
					isEmbed: 1,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
	<link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
	<link rel="stylesheet" href="/html/css/movie.css.gz.css">
	<script href="/html/js/common_combined.js.gz.js"></script>
	<script>document.title='${title}',flashvars=${JSON.stringify(
		params.flashvars
	)}</script>
	</head>
	<body style="margin:0px">
		<nav class="navbar site-nav" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				<a class="navbar-brand" href="/m/movies" title="GoAnimate For Schools">
					<img src="/html/img/logo.png" alt="GoAnimate For Schools">
				</a>
			</div>
	
			<ul class="nav site-nav-alert-nav hidden-xs">
				<li>
					<a href="/messages" title="Messages"><span class="glyphicon glyphicon-envelope"></span><span class="count"></span></a>
				</li>
				<li>
					<a href="/notifications" title="Notifications"><span class="glyphicon glyphicon-bell"></span><span class="count"></span></a>
				</li>
			</ul>
			<div class="collapse navbar-collapse navbar-ex1-collapse">
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown">
						<a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/you">Dashboard</a></li>
							<li><a href="/dashboard/videos">Your Videos</a></li>
							<li class="divider"></li>
							<li><a href="/account">Account Settings</a></li>
							<li><a href="/profile">Your Profile</a></li>
							<li class="divider"></li>
							<li><a class="logout-link" href="/logoff">Logout</a></li>
						</ul>
					</li><li class="dropdown">
						<a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/students">Students</a></li>
							<li><a href="/teachers">Teachers</a></li>
							<li><a href="/dashboard/videos">Videos</a></li>
							<li class="divider"></li>
							<li><a href="https://discord.gg/bb8xXaWPv3">Educator Experiences</a></li>
							<li><a href="/public_faq">FAQ</a></li>
						</ul>
					</li>
					<li>
						<a class="hidden-sm hidden-md hidden-lg" href="/c/create">Make a Video</a>
						<span class="site-nav-btn hidden-xs"><a class="btn btn-green" href="/c/create">Make a Video</a></span>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div id="video-page">
	<div class="video-top">
		<div class="container">
			<div class="row">
				<div class="col-sm-6 video-left">
					<div class="status-container">
						<div class="vthumb-container">
							<div class="vthumb">
								<div class="vthumb-clip"><div class="vthumb-clip-inner"><span class="valign"></span><img src="https://flashthemes.net/movie_thumbs/thumb-0KwcYC3zy0.png" alt="Test"></div></div>
							</div>
						</div>
					</div>
					<div class="video-top-content clearfix">
						<div class="pull-left video-info">
							<h1>Test</h1>
							By <a title="You">You</a>                     </div>
						<div class="video-top-status">
								</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	<div class="video-main">
	<div class="container">
			<div class="video-main-content">
				<div class="video-header clearfix noshow">
				</div>
	
				<div class="video-content">
					<div class="player-container">
	<meta name="medium" content="video">
	<div style="position:relative">
		<div id="playerdiv" align="center" style="width:620px;height:349px;">
	${toObjectString(attrs, params)}
	</div>
		</div>
	
					</div>
				</div>
				
	<script>
	$('.video-actions').toggle($('.video-actions').find('.btn').length > 0);
	</script>
	
	
				
			</div>
			<div class="video-main-aside" id="player-aside"></div>
	
	</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="col-md-8">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#video-info" data-toggle="tab">More Info</a></li>
				</ul>
	
				<div class="tab-content">
					<div class="tab-pane active" id="video-info">
						<p class="inside">Published on: 17 Nov 2024</p>
						<p></p>
					</div>
				</div>
			</div>
			<div class="col-md-4 aside video-aside">
	
				<div></div><br>
	
			</div>
		</div>
	</div>
	</div>
	<footer class="site-footer hidden-print">
    <div class="container">
        <div class="row site-footer-nav">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>About GoAnimate</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://discord.gg/bb8xXaWPv3">Who We Are</a></li>
                        <li><a href="https://discord.gg/bb8xXaWPv3">Contact Us</a></li>
                        <li><a href="https://discord.gg/bb8xXaWPv3">Blog</a></li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>GoAnimate Solutions</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://itsredacted.000webhostapp.com/" target="_blank">GoAnimate for Schools</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>Getting Help</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://discord.gg/bb8xXaWPv3">Help Center</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>
        </div>
        <hr>

        <div class="row site-footer-copyright">
            <div class="col-sm-6">
                <div class="site-footer-socials-container">
                    Follow us on:
                    <ul class="site-footer-socials clearfix">
                        <li><a class="youtube" href="https://www.youtube.com/channel/UCiEYUXgWlGQqYfxyMhYGWRQ">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="pull-right">
                    <img src="/html/img/logo_amazon.png" alt="AWS Partner Network">
                    &nbsp;&nbsp;&nbsp;
                    GoAnimate © 2024
                </div>
            </div>
        </div>

    </div>
</footer>
	</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
