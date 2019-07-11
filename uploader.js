var http = require('http')
var formidable = require('formidable')
var fs = require('fs')

function sleep(ms){
	return new Promise(func => setTimeout(func,ms));
}

function show_page(res, req){
    var res_name = req.url.slice(1);
    if(res_name == '')
    {
        res_name = "index.html";
    }
    fs.readFile(res_name,function(err404,data){
        try{
            if (err404) throw err404;
        
            res.writeHead(200,{'Content-Type':'text/html'});
            res.write(data);
            res.end();
            console.log(res_name + ' served!');
        } catch (err404) {
            res.writeHead(404,{'Content-Type':'text/html'});
            res.write('<center><h1> Error 404 !!! <br/> Resource Not Found </h1></center>');
            res.end();
            console.log(res_name + ' not found in the server!');
        }
    });
}

function redir(res,url){
    var myScript = `<script type = "text/javascript">
                        function Redirect() {
                        window.location = "`+url+`";
                        };            
                        Redirect();
                    </script>`;
    res.write(myScript);
    res.end();
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
                        console.log("File uploaded to the server! Now redirecting...")
                        await sleep(4000);
                        redir(res, "http://"+req.headers.host+"/form.html");
                    });
                    fs.unlink(oldpath, function (err) {
                        if (err) throw err;
                    });
                });
            }catch (err) {
                console.log(err);
            }
		});
    } 
    //else if (req.url == "/redir"){
    //    res.writeHead(200,{'Content-Type':'text/html'});
    //    redir(res,"http://google.com");
    //}
    else {
		show_page(res, req);
	}
}).listen(8080);