const Await_response = require("../util/await.response");

const getAll = async (collection) => {
    return await collection.get()
        .then(snapshot => {
            if (snapshot.empty) {
                //console.log('No matching documents.');
                return new Await_response(404, "No matching documents. (getAll)");
            }
            snapshot.forEach(doc => {
                //console.log(doc.id, '=>', doc.data());
            });
            return new Await_response(200, "Found documents. (getAll)", snapshot.docs.map(doc => doc.data()));
        })
        .catch(err => {
            //console.log('Error getting employee', err);
            return new Await_response(500, 'Error getting employees', err);
        });
};

const fbHelper = require('./firebaseHelper.js');
const create = async (data, collection) => {
    if (data.id != null) { //if id is supplied, use it
        collection.doc(String(data.id)).set(data, {merge: true});
        return new Await_response(200, "Created enitity", data);
    } else { //if id is missing, find uuid
        while (true) {
            let returnValue = null;
            let id = fbHelper.getRandomID();
            let entity = await collection.where("id", '==', id).limit(1).get()
                .then(async snapshot => {
                    if (snapshot.empty) {
                        //console.log('Found unused ID (in create)');
                        data.id = String(id);
                        returnValue = collection.doc(String(id))
                            .set(data, {merge: true});
                        return new Await_response(200, "Created enitity", data);
                    }
                    snapshot.forEach(doc => {
                        // console.log(doc.id, '=>', doc.data());
                        return new Await_response(400, "already found user with this id", false);
                    });
                })
                .catch(err => {
                    //console.log('Error getting employee', err);
                    return new Await_response(500, 'Error creating employee', false);
                });
            if (entity.payload !== false) {
                return entity;
            }
        }
    }
};

const update = async (data, collection) => {
    if (data.id == null) {
        return new Await_response(404, "id was null or undefined in update");
    }
    let response = await collection.doc(String(data.id)).update(data);
    // TODO DO Something with response
    return new Await_response(200, "updated", data);
};

const deleteEntity = async (id, collection) => {
    if (id == null) {
        return new Await_response(404, "id was null or undefined in delete");
    }
    let entityToDelete = (await findBy('id', id, collection)).payload;//return deleted entity
    await collection
        .doc(String(id))
        .delete();
    return new Await_response(204, "deleted", entityToDelete);
};

const findBy = async (lookupVar, value, collection) => {
    let response = null;
    await collection.where(lookupVar, '==', String(value)).limit(1).get()
        .then(snapshot => {
            if (snapshot.empty) {
                //console.log('No matching documents. (findBy)');
                response = new Await_response(404, "No matching documents. (findBy)");
            }
            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data());
                response = new Await_response(200, "Found Data", doc.data());
            });
        })
        .catch(err => {
            // console.log('Error getting document', err);
            response = new Await_response(500, "Error getting document", err);
        });
    return response;
};

const findAllBy = async (lookupVar, value, collection) => {
    let response = null;
    await collection.where(lookupVar, '==', String(value)).get()
        .then(snapshot => {
            if (snapshot.empty) {
                //console.log('No matching documents. (findAllBy)');
                response = new Await_response(404, "No matching documents. (findAllBy)");
            }
            let data = [];
            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data());
                data.push(doc.data())
            });
            response = new Await_response(200, "Found Data", data);
        })
        .catch(err => {
            //console.log('Error getting document', err);
            response = new Await_response(500, "Error getting document", err);
        });
    return response;
};

module.exports = {
    getAll,
    create,
    update,
    deleteEntity,
    findBy,
    findAllBy
};
