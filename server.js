const MongoClient = require('mongodb'),
      express     = require('express'),
      conn        = require('./confs/db'),
      host        = require('./confs/host'),
      morgan      = require('morgan'),
      bodyParser  = require('body-parser');


MongoClient.connect(conn.connection,function(err, client){
    if (err){
        console.log(err.message);
        return -1;
    }
    
    app = express();
    app.use(morgan('dev'));
    
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    data = host.dataHost;
    var port = data.port,
        hst  = data.host;

 
    db = client.db('astronomy');
    if (process.argv[2] != null)
    {
        port = process.argv[2]
    }

    require('./confs/routes/params_routes')(app,db);
    require('./confs/routes/sources_routes')(app,db);
    server = app.listen(port, hst,function(){
        console.log('Estoy leyendo en puerto: '+port)
    })
})