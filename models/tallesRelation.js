const mysql = require('mysql');


var config = {  
        host: 'localhost',
        user: 'root',
        password: 'e5TBlg5FBOTbfWEP',
        database: 'default',
        multipleStatements: true
};

let equivalenciatalles = {};

equivalenciatalles.getEquivalencia = (data, callback) => {

config.database = data.database;
var equivalencias = [];

connection = mysql.createConnection(config);

  if (connection) {
        
    data.talles.forEach((tallesin,i)=>{
        
      //console.log('SELECT talle_arg FROM talles_equivalencia where talle_flx_1 = "'+tallesin+'" and rubroFlx= "'+data.rubroFlx+'" AND marca = "'+data.manufacturer+'"');  
      connection.query('SELECT talle_arg FROM talles_equivalencia where talle_flx_1 = "'+tallesin+'" and rubroFlx= "'+data.rubroFlx+'" AND marca = "'+data.manufacturer+'"',
        (err, talle) => {
          if (err) {
            throw err
          }
          else {
            
            if(JSON.parse(JSON.stringify(talle))==''){
              
              var nombre = tallesin;
                          
              equivalencias.push({talle: tallesin, equivalencia: tallesin});

              if(data.talles.length -1 == i ){  
                //console.log(equivalencias);
                callback(null,equivalencias);
              }

            }else{
                var nombre = tallesin;
                
                equivalencias.push({talle: tallesin, equivalencia: talle[0].talle_arg});
                
                if(data.talles.length -1 == i ){  
                //console.log(equivalencias);
                callback(null,equivalencias);
                }

            }
          }
        }
      )
  
    });//foreach
  } //if connection
  else{

      data.talles.forEach((tallesin,i)=>{

        equivalencias.push({talle: tallesin, equivalencia: tallesin});

        if(data.talles.length -1 == i ){  
          //console.log(equivalencias);
          callback(null,equivalencias);
        }


      });  
  
  }

};



module.exports = equivalenciatalles;
