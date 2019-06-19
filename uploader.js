var http = require('http')
var formidable = require('formidable')
var fs = require('fs')

function sleep(ms){
	return new Promise(func => setTimeout(func,ms));
}

function show_page(res){
	fs.readFile('form.html',function(err,data){
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
}

http.createServer(function(req,res){
	if (req.url == '/uploadfile'){
		var form = new formidable.IncomingForm();
		form.parse(req,function(err,fields,files){
			var oldpath = files.filetoupload.path;
			var newpath = './uploaded_files/' + files.filetoupload.name;
            try{
                fs.readFile(oldpath, function (err, data2) {
                    if (err) throw err;
                    fs.writeFile(newpath, data2, async function (err) {
                        if (err) throw err;
                        res.writeHead(200,{'Content-Type':'text/html'});
                        res.write('File successfully uploaded!');
                        await sleep(4000);
                        var myScript = `<script type = "text/javascript">
                                            function Redirect() {
                                            window.location = "http://`+req.headers.host+`";
                                            }            
                                            Redirect();
                                        </script>`;
                        res.write(myScript);
                        res.end();
                    });
                    fs.unlink(oldpath, function (err) {
                        if (err) throw err;
                    });
                });
            }catch (err) {
                console.log(err);
            }
		});
	} else {
		show_page(res);
	}
}).listen(8080);