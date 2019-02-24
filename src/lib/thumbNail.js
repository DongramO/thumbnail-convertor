const thumbNailSizes = {

  MAINLIST: [
    {size: [414, 370], alias: 'mobile', type: 'crop'},
    {size: [960, 960], alias: 'detail'},
  ],

  sizeFromKey: function(key) {
    const type = key.split('/')[1];
    if (type === 'service') {
      return thumbNailSizes.MAINLIST;
    }
    return null;
  }
}

const supportImageTypes = ["jpg", "jpeg", "png", "gif"];

const sizeFromKey = (key) => {
  const result = thumbNailSizes.sizeFromKey(key)
  return result ? result : null
}

module.exports = {
  thumbNailSizes,
  supportImageTypes,
  sizeFromKey,
}