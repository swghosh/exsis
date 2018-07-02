const userType = 'student'

var fs = require('fs')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype.dyn')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

exports.servePage = (req, res, options) => {
    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "Student's Home"

        res.writeHead(200, {
            'Content-Type': options.type
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(options.filepath, options.encoding, (err, viewHtml) => {
                values.content = viewHtml

                res.end(
                    htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)
                )
            })
        })

    })
}