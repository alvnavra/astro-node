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

    app.post('/',(req, res)=>{
        console.log(req.body)
        param = {_id:req.body.id,url:req.body.url,type:req.body.type}
        db = client.db('astronomy')
        db.collection('parameters').insertOne(param,(err, data)=>{
            if(err) rex.send(err)
            res.send('Parameter has been inserted')
        })
    })

    app.delete('/',(req, res)=>{
        console.log(req.body)
        id = req.body.id
        db = client.db('astronomy')
        db.collection('parameters').deleteOne({_id:id},(err, data)=>{
            if(err) rex.send(err)
            res.send('Parameter has been deleted')
        })
    })



    app.get('/',(req, res)=>{
        db = client.db('astronomy')
        tool_name = req.query['tool_name']
        db.collection('parameters').find({'_id':tool_name}).toArray((err, docs)=>{
            res.send(docs)
        })
    })

    if (process.argv[2] != null)
    {
        port = process.argv[2]
    }

    server = app.listen(port, hst,function(){
        console.log('Estoy leyendo en puerto: '+port)
    })
})