/**
 * Created by pandaking on 2017/5/24.
 */
+(function(){

    var profileTemplate = loadArtTemplate("profile");
    commonAjax({
        url: 'admin/user',
        dataType: 'json',
        success: function (result) {
            var render = template.compile(profileTemplate);
            var html = render({
                adminUser:result.data
            });
            $('a#profile').html(html);
        }
    });
    $('a.logout').click(function () {
        commonAjax({
            url: 'admin/logout',
            success: function (result) {
                window.location.href = "/rbac";
            }
        });
    });

    var targetConfig = {
        "version-license.html" : 'license.html',
        "group-rules.html" : 'groups.html',
        "chpasswd.html" : 'users.html',
        "user-detail.html" : 'users.html'
    };
    var showPage = function(pid, resultMap){
        var trList = [];
        var list = resultMap[pid];

        trList.push('<ul class="nav lt">');
        for(var k in list) {
            var item = list[k];
            trList.push("<li>")
            trList.push('<a href="' + item.mca + '">');
            trList.push('<i class="fa fa-angle-right"></i> ');
            trList.push('<span class="fa ' + item.ico + ' icon"> &nbsp;&nbsp;' + item.name + '</span>');
            trList.push('</a>');
            if(resultMap[item.id] !== undefined) {
                trList.push(showPage(item.id, resultMap));
            }
            trList.push('</li>');
        }
        trList.push("</ul>");
        return trList.join('');
    };

    commonAjax({
        url : "menu/show",
        data:{},
        dataType:'json',
        async:false,
        success:function(result) {
            var resultMap = {};
            for(var k in result.data) {
                var item = result.data[k];
                if(resultMap[item.pid] === undefined) {
                    resultMap[item.pid] = [];
                }
                resultMap[item.pid].push(item);
            }
            var liList = [];
            liList.push('<ul class="nav">');
            for(var key in resultMap[0]) {
                var item = resultMap[0][key];
                liList.push('<li>');
                liList.push('<a href="' + item.mca + '">');
                liList.push('<i class="fa ' + item.ico + ' icon"> <b class="bg-warning"></b></i>');
                liList.push('<span class="pull-right">');
                liList.push('<i class="fa fa-angle-down text"></i>');
                liList.push('<i class="fa fa-angle-up text-active"></i>');
                liList.push('</span>');
                liList.push('<span>' + item.name + '</span>');
                liList.push('</a>');
                liList.push(showPage(item.id, resultMap));
                liList.push('</li>');
            }
            liList.push('</ul>');
            $('#nav-container').html(liList.join(""));
        }
    });

    var url = window.location.pathname;

    var index = url.lastIndexOf("/");
    if(index > 0) {
        url = url.substr(index + 1, url.length);
    }
    var findResult = $('ul.nav').find('a[href$="' + url + '"]').length;
    if (findResult == 0) {
        for(var k in targetConfig) {
            var reg = new RegExp(k);
            if(reg.test(url)) {
                url = targetConfig[k];
                break;
            }
        }
    }
    $('ul.nav').find('a[href$="' + url + '"]')
        .parent().addClass('active')
        .parent().prev().addClass('active')
        .parent().addClass('active');
})();