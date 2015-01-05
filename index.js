var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv = require('iconv-lite');

var TEST_URL = 'http://sh.1010jz.com/job/index1.html';

/*
  http://www.1010jz.com/
  抓取公共函数
*/
function crawler( link, params, fn ){
    request({
        encoding: null,
        url: link
    }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(iconv.decode(body, params.encoding || "gb2312" ));
            fn && fn( $ );
        }else{
            console.log( error )
        }
    })
}

/*
  http://www.1010jz.com/
  抓取列表页
*/
function getList( link ){
    crawler( link , {} , function($){
            var joblist = $(".joblist").find("li.hover");
            console.log("url: " +link+" ---- "+joblist.length + "条");   
            joblist.each(function (index, ele) {
              getDetail( $(this).find("a").attr('href') )
              /*console.log("   link：" + $(this).find("a").attr('href') );
                console.log("  title：" + $(this).find("a").text().trim().replace(/\n|\s/gi,'') );
                console.log("company：" + $(this).find(".listcompany").text().trim().replace(/\n|\s/gi,'') );
                console.log("   date：" + $(this).find(".listzptime").text().trim().replace(/\n|\s/gi,'') );*/
            });
    })
}

/*
  http://www.1010jz.com/
  抓取详情页
    title 职位标题
    jobType 职位类型
    date 更新时间
    region 区域
    company 公司名称
    industry 公司所属行业
    companyType 公司类型
    scale 公司规模
    jobDetail 职位详情
    contact 联系人
    address 联系地址
    phone 联系电话
*/
function getDetail( link ){
    var title, 
        jobType,
        date,
        region,
        companyName,
        industry,
        companyType,
        scale,
        jobDetail,
        contact,
        address,
        phone;
    var regExp_date = /(\<span\>更新时间\：)(\w{2}-\w{2}\s{1}\w{2}:\w{2})(\<\/span\>)/ig,
        regExp_region = /(\<span\>工作地点\：)(.*)(\<\/span\>)/ig,
        regExp_companyName = /(\<span\>公司名称\：)(.|\n)*(\<\/span\>)/ig,
        regExp_industry = /(\<span\>所属行业\：)(\W)*(\<\/span\>)/ig,
        regExp_companyType = /(\<span\>公司类型\：)(\W)*(\<\/span\>)/ig,
        regExp_scale = /(\<span\>公司规模：)(\W|\d)*(\<\/span\>)/ig;
    crawler( link , {} , function($){
        var detailWraper = $(".d_left"); 
            detailWraperHtml = unescape( detailWraper.html().replace(/&#x/g,'%u').replace(/;/g,'') );
        title = detailWraper.find('h2').text().trim();
        jobType = "";
        date = detailWraperHtml.match(regExp_date)[0].match(/(\w{2}-\w{2}\s{1}\w{2}:\w{2})/ig)[0];
        region = cheerio.load( detailWraperHtml.match(regExp_region)[0] )('span').eq(0).find('a').text();
        companyName = "";
        industry = detailWraperHtml.match(regExp_industry)[0].match(/(\<span\>)(所属行业：)(\W*?)(\<\/span\>)/i)[3];
        companyType = detailWraperHtml.match(regExp_companyType)[0].match(/(\<span\>)(公司类型：)(\W*?)(\<\/span\>)/i)[3];
        // scale = detailWraperHtml.match(regExp_scale)[0].match(/(\<span\>)(公司规模：)(\W|\d*?)(\<\/span\>)/i)[3];

        console.log( detailWraperHtml.match(regExp_scale)[0].match(/(\<span\>)(公司规模：)(\W|\d|)*?(\<\/span\>)/i)[3] );
    })
}

getList( TEST_URL );