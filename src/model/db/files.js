const { YEAR, MONTH} = require('lib/date')

exports.insertImageForQuestion = (connection, { user_id }, { board_id, image, filesKey, original }) => {
  return new Promise((resolve, reject) => {
    const Query = `
    INSERT INTO
      MC_BOARD_FILE (
        board_id, file_origin_name, file_date, file_size,
        original_file_key, mobile_file_key, detail_file_key,
        cr_user, ud_user
      )
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `
    const query = connection.query(
      Query, [board_id, image.originalname, `${YEAR}/${MONTH}`, image.size, filesKey, user_id, user_id], (err, result) => {
        err 
          ? reject(err)
          : resolve(result.insertId)
      },
    )
  })
}

exports.deleteImageFromUser = (connection, { user_id }, { board_id }) => {
  const Query = `
    DELETE FROM
      MC_BOARD_FILE
    WHERE
      cr_user = ? AND file_id = ?
  `
  const quesy = connection.quesy(Query, [user_id, file_id], (err, result) => {
    err 
      ? reject(err)
      : resolve(result)
  })
}