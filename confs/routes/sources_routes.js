module.exports = function(app, db){
    // maxi -> fuente = source, tipo de fuente = src_type
    // swift --> fuente = name, tipo de fuente = src_type
    // fermi --> fuente = source, tipo de fuente = source_type
    //mongodump -h ds119060.mlab.com:19060 -d astronomy -u alvnavra -p temporal1 -o /tmp/dumps
    let collection = 'sources';
    app.get('/sources',(req, res)=>{
        if (req.query['tool_name'] != undefined)
        {
            console.log('estoy en el if')
            db.collection(collection).find({'tool_name':req.query['tool_name']}).toArray((err, docs)=>{
                res.send(docs)    
            })
        }
        else
        {
            if (req.query['name'] != undefined)
            {
                console.log('estoy en el else')
                tool_name = req.query['src_name']
                db.collection(collection).find({'src_name':req.query['name']}).toArray((err, docs)=>{
                    res.send(docs)
                })
            } 
            else
            {
                if(req.query['src_types'] != undefined)
                {
                    db.collection(collection).distinct('src_type').then(docs=>{
                        res.send(docs);
                    })
                }
                else
                {
                    if(req.query['src_type']!= undefined)
                    {
                        db.collection(collection).find({'src_type':req.query['src_type']}).toArray((err, docs)=>{
                            if (err) {res.send(err);return -1}
                            res.send(docs)
                        })
                    }
                }
            }  
        }
    })
    app.get('/tool_names',(req,res)=>{
        db.collection(collection).distinct('tool_name',(err,docs)=>{
            if (err) {res.send(err);return -1}
            res.send(docs)
        })
    })
    app.get('/count_src_types',(req, res)=>{
        db.collection(collection).aggregate([{$group:{_id:{src_type:"$src_type"},count:{$sum:1}}}]).toArray((err, docs)=>{
            if (err) {res.send(err);return -1}
            res.send(docs)

        })
    })
    app.get('/count_src_types_by_mission/',(req,res)=>{
        db.collection(collection).aggregate([{$match:{tool_name:'swift'}},{$group:{_id:{src_type:"$src_type"},count:{$sum:1}}}]).toArray((err,docs)=>{
            if (err) {res.send(err);return -1}
            res.send(docs)

        })
    })
    app.get('/count_src_types_grouped_by_mission/',(req,res)=>{ 
        db.collection(collection).aggregate(([{$group:{_id:{
            "tool_name":"$tool_name",
            "src_type":"$src_type"
            },"total":{$sum:1}
       }},{$group:{
           _id:"$_id.tool_name",
           src_types:{
               $push:{src_type:"$_id.src_type",total:"$total"}
               }
           }
        }
      ])).toArray((err,docums)=>{res.send(docums)})})


}