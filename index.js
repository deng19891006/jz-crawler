var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv = require('iconv-lite');

var url = 'http://sh.1010jz.com/job/index1.html';

request({
    encoding: null,
    url: url
}, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        var $ = cheerio.load(iconv.decode(body, 'gb2312'));
            joblist = $(".joblist").find("li.hover");
        console.log("当前页面：" + joblist.length + "条");   
        joblist.each(function (index, ele) {
          /*console.log("   link：" + $(this).find("a").attr('href') );
            console.log("  title：" + $(this).find("a").text().trim().replace(/\n|\s/gi,'') );
            console.log("company：" + $(this).find(".listcompany").text().trim().replace(/\n|\s/gi,'') );
            console.log("   date：" + $(this).find(".listzptime").text().trim().replace(/\n|\s/gi,'') );*/
          getDetail( $(this).find("a").attr('href') )
        });
         
    }else{
        console.log( error )
    }
})

function getDetail( link ){
    var title,
        date,
        region,
        company,
        industry,
        companyType,
        scale,
        jobDetail,
        contact,
        address,
        phone;

    request({
        encoding: null,
        url: link
    }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(iconv.decode(body, 'gb2312')),
                detailWraper = $(".d_left"); 
            title = detailWraper.find('h2').text().trim();
            // date = detailWraper
            console.log(title )
        }else{
            console.log( error )
        }
    })
}