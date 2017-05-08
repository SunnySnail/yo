requirejs.config({
    urlArgs: "v=2017042807",
    baseUrl: "http://tx.cdn.icampus.us/rp/js/mod/",
    // baseUrl: '../mod/',
    paths: {
    },
    shim: {
    }
});

requirejs(
    [
        'game-info'

    ],
    function(gameInfo) {
        // fastClick
        FastClick.attach(document.body);
        gameInfo.init();

        // 配置微信签名
        util.getWxSign();

    }
)
