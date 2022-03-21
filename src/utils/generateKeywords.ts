export function createCombineWords(word: string) {
  const array = [];
  const arraySplit = word.split(' ').map((i) => i.toLocaleLowerCase());

  for (let x = 0; x < arraySplit.length; x++) {
    array.push(arraySplit[x]);

    for (let y = 0; y < arraySplit.length; y++) {
      if (y === x) continue;

      array.push(arraySplit[y] + ' ' + arraySplit[x]);
    }
  }

  return array;
}
