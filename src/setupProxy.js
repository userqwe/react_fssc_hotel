const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
	app.use(
		"/fssc-api",
		createProxyMiddleware({
			target: "http://fsscuat.tclking.com",
			changeOrigin: true,
			pathRewrite: {
				// "/fssc-api": "",
			},
		})
    );
    // 更多代理配置...
};
