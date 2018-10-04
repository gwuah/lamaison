function Nexus(Model) {
  this.Model = Model;
}

Nexus.prototype.getAll = function() {  
  return new Promise((res, rej) => {
    this.Model.find({}).then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.create = function(body) {
  return new Promise((res, rej) => {
    const new_document = this.Model(body);
    new_document.save().then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.updateById = function(id, body) {
  return new Promise((res, rej) => {
    this.Model.findByIdAndUpdate(id, body, {new: true}).then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.getById = function(id) {
  return new Promise((res, rej) => {
    this.Model.findById(id).then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.deleteById = function(id) {
  return new Promise((res, rej) => {
    this.Model.findByIdAndRemove(id)
    .then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.createBulk = function(array) {
  return new Promise((res, rej) => {
    this.Model.insertMany(array).then(data => {
      res(data)
    }).catch(err => {
      rej(err)
    })
  })
}

Nexus.prototype.query = function(query) {
  return new Promise((res, rej) => {
    this.Model
    .find(query)
    .then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.updatePassword = function(id, newPassword) {
  return new Promise((res, rej) => {
    this.Model.findByIdAndUpdate(id, {
      password: newPassword
    }, {new: true})
      .then(data => {
        res(data)
      }).catch(error => {
        rej(error)
      })
  })
}

Nexus.prototype.updateArrayProp = function(id, propName, prop) {
  return new Promise((res, rej) => {
    this.Model.findByIdAndUpdate(id, 
      {
        $push:{ [propName]: {$each: prop} }
      }, {
        new:true
      }
    ).then(data => {
      res(data)
    }).catch(error => {
      rej(error)
    })
  })
}

Nexus.prototype.findByIdAndToken = function(id, token) {
  return new Promise((res, rej) => {
    this.Model
      .findByIdAndToken(id, token)
      .then(res)
      .catch(rej)
  })
}

Nexus.prototype.findOneByQuery = function(query) {
  return new Promise((res, rej) => {
    this.Model
      .findOne(query)
      .then(res)
      .catch(rej)
  })
}

module.exports = Nexus