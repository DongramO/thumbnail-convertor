let mysql = require('mysql')
const MysqlPoolBooster = require('mysql-pool-booster')
const { mysql: mysqlConfig } = require('mc_secret')

mysql = MysqlPoolBooster(mysql)
/*
  PoolCluster의 reader connection 개수는 5개
  PoolCluster의 writer connection 개수는 10개
*/

const __getPool = (() => {
  let cluster = ''
  return {
    getInstance() {
      if (!cluster) {
        cluster = mysql.createPoolCluster({ nodes: mysqlConfig })
      }
      return cluster
    },
  }
})()

module.exports = function DBConnection(action, target) {
  return new Promise((resolve, reject) => {
    const pool = __getPool.getInstance()
    if (action === 'reader') {
      pool.getReaderConnection(target, (err, conn) => {
        if (err) {
          console.log('Connection Error', err)
          reject(err)
        } else {
          resolve(conn)
        }
      })
    } else if (action === 'writer') {
      pool.getWriterConnection((err, conn) => {
        if (err) {
          console.log('Connection Error', err)
          reject(err)
        } else {
          resolve(conn)
        }
      })
    }
  })
}
