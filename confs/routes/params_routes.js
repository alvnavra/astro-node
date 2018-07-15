module.exports = function(app, db){
    app.get('/params',(req, res)=>{
        if (req.query['tool_name'] == undefined)
        {
            console.log('estoy en el if')
            db.collection('parameters').find({}).toArray((err, docs)=>{
                res.send(docs)    
            })
        }
        else
        {
            console.log('estoy en el else')
            tool_name = req.query['tool_name']
            db.collection('parameters').find({'_id':tool_name}).toArray((err, docs)=>{
                res.send(docs)
            })
        }
    })

    app.post('/params',(req, res)=>{
        console.log(req.body)
        param = {_id:req.body.id,url:req.body.url,type:req.body.type}
        db.collection('parameters').insertOne(param,(err, data)=>{
            if(err) rex.send(err)
            res.send('Parameter has been inserted')
        })
    })

    app.delete('/params',(req, res)=>{
        console.log(req.body)
        id = req.body.id
        db.collection('parameters').deleteOne({_id:id},(err, data)=>{
            if(err) rex.send(err)
            res.send('Parameter has been deleted')
        })
    })    
}