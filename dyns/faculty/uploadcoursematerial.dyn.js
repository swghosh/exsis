const userType = 'faculty'

var fs = require('fs')
var querystring = require('querystring')
var url = require('url')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

exports.filePath = ''

exports.servePage = (req, res) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        var getParams = querystring.parse(url.parse(req.url).query);

        if(getParams['success'] !== undefined) {
            values.notification = '✅ course material uploaded';
        }
        else if(getParams['failed'] !== undefined) {
            values.notification = '❌ upload failed';
        }
        else {
            values.notification = '';
        }

        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "Upload Course Material"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                res.end(
                    htmldynmodule.getHtmlStringWithIdValues(contentHtml, values)
                )
            })
        })

    })
}