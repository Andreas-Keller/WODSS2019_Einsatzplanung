const getAll = async (collection) => {
    let returnValue = null;
    await collection.get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                returnValue = 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
            returnValue = snapshot.docs.map(doc => doc.data());
        })
        .catch(err => {
            console.log('Error getting employee', err);
            returnValue = 500;
        });
    return returnValue;
};

const fbHelper = require('./firebaseHelper.js');
const create = async (data, collection) => {
    while (true) {
        let returnValue = null;
        let id = fbHelper.getRandomID();
        let entity = await collection.where("id", '==', id).limit(1).get()
            .then(async snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents. (findBy)');
                    data.id = id;
                    console.log(id);
                    returnValue = collection.doc("" + id)
                        .set(data, {merge: true});
                    return data;
                }
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    returnValue = false;
                    return returnValue;
                });
            })
            .catch(err => {
                console.log('Error getting employee', err);
                returnValue = false;
                return returnValue;
            });
        console.log(entity);
        if (entity !== false && returnValue != null) {
            return entity;
        }
    }
};

const update = async (data, collection) => {
    if(data.id==null){
        return 404;
    }
    return await collection.update
        .doc(data.id)
        .update(data);
};

const deleteEntity = async (id, collection) => {
    return await collection
        .doc(id)
        .delete();
};

const findBy = async (lookupVar, value, collection) => {
    let returnValue = null;
    await collection.where(lookupVar, '==', value).limit(1).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents. (findBy)');
                returnValue = 404;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                returnValue = doc;
            });
        })
        .catch(err => {
            console.log('Error getting employee', err);
            returnValue = 500;
        });
    return returnValue;
};

module.exports = {
    getAll,
    create,
    update,
    deleteEntity,
    findBy
};