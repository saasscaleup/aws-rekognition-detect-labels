// Load aws sdk
var aws = require('aws-sdk');

// Load aws Rekognition object
var rekognition = new aws.Rekognition();

// Set aws lambda handler function
exports.handler = (event, context, callback) => {
  
    // Buffer created to receive the encode base64 image
    var buffer = new Buffer.from(event.image_base64, 'base64');
    
    // aws Rekognition required params
    var params = {
        Image :{
            Bytes: buffer
        },
        MaxLabels: 10, // Max labels we are allowing to get back. Can be changed
        MinConfidence: 75 // // Min labels detect A.I. Confidance level. 1%-100%
    }; 
  
   //send params to Amazon rekognition
    rekognition.detectLabels(params, function(error, data){
      
        //if there is an error, return the description about it
        if(error){
          
            // Prepare error response
            var ErrorOcurred = {
              "file_name": event.file_name,
              "Error":{
                "Error": error.stack,
                "Description": error
              }
            };
            
            // invoke callback function with error response
            callback(null, ErrorOcurred);
        }
      
        //if everything is ok, send the labels of the image
        else{
            
            // Prepare success response
            var res = {
                "file_name": event.file_name,
                "Tags": data
            };
          
            // invoke callback function with image labels response
            callback(null, res);
        }
    });
};

// Success response example
/*
   data = {
    Labels: [
       {
      Confidence: 99.25072479248047, 
      Name: "People"
     }, 
       {
      Confidence: 99.25074005126953, 
      Name: "Person"
     }
    ]
   }
*/
