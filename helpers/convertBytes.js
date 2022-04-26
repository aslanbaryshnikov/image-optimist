const convertBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return 'n/a';

  const isNegative = bytes < 0;
  // eslint-disable-next-line no-param-reassign
  if (isNegative) bytes *= -1;

  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);

  if (i === 0) return `${bytes} ${sizes[i]}`;

  return `${isNegative ? '-' : ''}${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

module.exports = convertBytes;
