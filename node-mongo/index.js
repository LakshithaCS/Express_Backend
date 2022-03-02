const MongoClient = require('mongodb').MongoClient; //to connect monogo db
const assert = require('assert'); //assert module

//include operations
const dboper = require('./operations');

//database informations
const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "dishes")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");

        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
                            
            return db.dropCollection("dishes");
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));
    //what happens here
    //insert a document
    //print all documents in perticular collection
    //update same document
    //print all again
    //drop the collection


	/* v1.0

	//dishes collection
    const collection = db.collection("dishes");

    //insert one object to the cllection
    collection.insertOne({"name": "Uthappizza", "description": "test"},

    	//second argument is a callback function
    	(err, result) => {

    		//check errors
        	assert.equal(err,null);

        	console.log("After Insert:\n");
        	console.log(result.ops);//ops = how many operations has been done

        	// find
        	// {} = empty means all
        	// it will be converted to an array
        	collection.find({}).toArray((err, docs) => {
            	//check errors
            	assert.equal(err,null);
            
            	console.log("Found:\n");
            	console.log(docs); //print all

            	//drop/remove the dishesh collection
            	db.dropCollection("dishes", (err, result) => {
                	
                	//check errors
                	assert.equal(err,null);

                	client.close(); //close the client

             	});
        	});
    	});
	*/
