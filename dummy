router.post("/pagination", (req, res) => {
    var page = parseInt(req.query.page)||0 ; //for next page pass 1 here
    var limit = parseInt(req.query.limit) ||0;
    if(limit==0){
        return res.json({msg:"format error"})
    }
    var query = {};
    Students.find(query)
      .skip(page * limit) //Notice here
      .limit(limit)
      .exec((err, doc) => {
        if (err) {
          return res.json(err);
        }
        Students.countDocuments(query).exec((count_error, count) => {
          if (err) {
            return res.json(count_error);
          }
          if(count<limit*page){
              return res.json({msg:"invalid data"})
          }
          return res.json({
            total: count,
            page: page,  
            student: doc
          });
        });
      });
  });
    