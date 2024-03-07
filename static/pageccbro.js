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
		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "960",
				height: "1200",
			};
			params = {
				flashvars: {
					apiserver: "http://localhost/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					appCode: "go",
					page: "",
					siteId: "school",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 0,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
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
    <script>document.title='${title}',flashvars=${JSON.stringify(
	params.flashvars
	)}</script><link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
    <link rel="stylesheet" href="/html/css/cc.css.gz.css">
    <script href="/html/js/common_combined.js.gz.js"></script>
    </head>
    <body>
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
                        <li><a href="/student">Dashboard</a></li>
                        <li><a href="/dashboard/videos">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="/account">Account Settings</a></li>
                        <li><a href="/profile/you">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="/logoff">Logout</a></li>
                    </ul>
                </li><li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/students">Students</a></li>
                        <li><a href="/teachers">Teachers</a></li>
                        <li><a href="/videos">Videos</a></li>
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
    <div class="container container-cc">
      <ul class="breadcrumb">
                <li><a href="/c/create">Make a video</a></li>
                <li class="active">Your Characters</li>
            </ul>
    
            <p>Browse characters already available in your theme and use them as a starting point to create new custom characters.</p>
    
    <div id="ccbrowser-container" align="center">
    ${toObjectString(attrs, params)}
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
