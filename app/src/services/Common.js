export const fakePromise = async (secs) => (
  await new Promise(async(resolve) => {
    let timeout = 0;
    timeout = await setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, secs);
  })
);

export const createSentence = (tagNames) => {
  const single = [];
  const multi = [];
  tagNames.forEach((tagName) => {
    const temp = tagName.split(' ');
    if (temp.length > 1) {
      multi.push(tagName);
    } else {
      single.push(temp[0]);
    }
  });

  let sentence = '';
  const sLength = single.length;
  single.forEach((tag, index) => {
    if (sLength === 1) {
      sentence = tag;
    } else if (sLength === 2) {
      if (index === sLength - 1) {
        sentence += `${tag} `;
      } else {
        sentence += `${tag} & `;
      }
    } else if (sLength > 2) {
      if (index === sLength - 1) {
        sentence = sentence.trim().slice(0, -1);
        sentence += ` & ${tag} `;
      } else {
        sentence += `${tag}, `;
      }
    }
  });

  const temp = sentence.split(' ');
  if (temp.length === 1) {
    sentence += ' ';
  } else {
    sentence += '';
  }
  multi.forEach((tag) => {
    sentence += `${tag} `;
  });


  return sentence;
};
