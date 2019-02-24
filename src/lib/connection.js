const mysql = require('mysql')
const { mysql: mysqlConfig } = require('mc_secret')
const { CustomError } = require('lib/util/respond')
const codes = require('lib/util/codes')

let PoolCluster = mysql.createPoolCluster({ nodes: mysqlConfig })

// setting Databse Cluster
PoolCluster.add('writer', mysqlConfig[0])
PoolCluster.add('reader', mysqlConfig[1])

module.exports = function DBConnection(action, target) {
  return new Promise((resolve, reject) => {
    const pool = PoolCluster
    pool.getConnection(action, (err, conn) => {
      if (err) {
        console.log(err.message)
        if (err.message === 'Pool does not exist.') {
          PoolCluster = mysql.createPoolCluster({ nodes: mysqlConfig })
          PoolCluster.add('writer', mysqlConfig[0])
          PoolCluster.add('reader', mysqlConfig[1])

          PoolCluster.getConnection(action, (_err, _conn) => {
            if (_err) reject(_err)
            else resolve(_conn)
          })
        }
        
        reject(new CustomError(codes.DATABASE_ERROR_ANYWAY, 404, err, { action, target }))
      } else {
        resolve(conn)
      }
    })
  })
}