const removeLineBreaks = (text) =>
  String(text ?? "").replace(/(\r\n|\n|\r)/gm, " ");

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const sortWithPattern = (arr, length) => {
  const bigPosts = arr.filter((post) => post.content.length > length / 2);
  const smallPosts = arr.filter((post) => post.content.length <= length / 2);
  shuffleArray(bigPosts);
  shuffleArray(smallPosts);

  const result = [];
  for (let i = 0; i < Math.max(bigPosts.length, smallPosts.length); i += 1) {
    if (bigPosts[i]) result.push(bigPosts[i]);
    if (smallPosts[i]) result.push(smallPosts[i]);
  }
  return result;
};

export const computePostChunks = (data) => {
  const empty = {
    largerPosts: [],
    largePosts: [],
    mediumPosts: [],
    semiMediumPosts: [],
    smallPosts: [],
    smallerPosts: [],
    persons: data?.otherPeopleData ?? null,
  };

  const responseData = data?.userPosts;
  if (!Array.isArray(responseData)) return empty;

  let zerothSet = [];
  let firstSet = [];
  let secondSet = [];
  let thirdSet = [];
  let fourthSet = [];
  let fifthSet = [];

  const zerothSetFinal = [];
  const firstSetFinal = [];
  const secondSetFinal = [];
  const thirdSetFinal = [];
  const fourthSetFinal = [];
  const fifthSetFinal = [];

  responseData.forEach((post) => {
    post.content = removeLineBreaks(post.content);

    if (post.content.length >= 1700) zerothSet.push(post);
    else if (post.content.length >= 1000 && post.content.length < 1700)
      firstSet.push(post);
    else if (post.content.length >= 800 && post.content.length < 1000)
      secondSet.push(post);
    else if (post.content.length < 800 && post.content.length >= 300)
      thirdSet.push(post);
    else fourthSet.push(post);
  });

  if (fifthSet.length > 0) {
    fifthSet.sort((a, b) => a.content.length - b.content.length);

    const leftPosts = fifthSet.length % 12;
    if (
      leftPosts !== 0 &&
      (fourthSet.length ||
        thirdSet.length ||
        secondSet.length ||
        firstSet.length ||
        zerothSet.length)
    ) {
      for (let i = 0; i < leftPosts; i += 1) {
        fourthSet.push(fifthSet.pop());
      }
    }

    shuffleArray(fifthSet);
    fifthSet = sortWithPattern(fifthSet, 300);

    for (let i = 0; i < fifthSet.length; i += 12) {
      const chunk = fifthSet.slice(i, i + 12);
      const temp = [];
      for (let j = 0; j < chunk.length; j += 2) {
        temp.push(chunk.slice(j, j + 2));
      }
      fifthSetFinal.push(temp);
    }
  }

  if (fourthSet.length > 0) {
    fourthSet.sort((a, b) => a.content.length - b.content.length);

    const leftPosts = fourthSet.length % 11;
    if (
      leftPosts !== 0 &&
      (thirdSet.length || secondSet.length || firstSet.length || zerothSet.length)
    ) {
      for (let i = 0; i < leftPosts; i += 1) {
        thirdSet.push(fourthSet.pop());
      }
    }

    for (let i = 0; i < fourthSet.length; i += 11) {
      fourthSetFinal.push(fourthSet.slice(i, i + 11));
    }
  }

  if (thirdSet.length > 0) {
    thirdSet.sort((a, b) => a.content.length - b.content.length);

    const leftPosts = thirdSet.length % 9;
    if (leftPosts !== 0 && (secondSet.length || firstSet.length || zerothSet.length)) {
      for (let i = 0; i < leftPosts; i += 1) {
        secondSet.push(thirdSet.pop());
      }
    }

    for (let i = 0; i < thirdSet.length; i += 9) {
      thirdSetFinal.push(thirdSet.slice(i, i + 9));
    }
  }

  if (secondSet.length > 0) {
    secondSet.sort((a, b) => a.content.length - b.content.length);

    const leftPosts = secondSet.length % 7;
    if (leftPosts !== 0 && (firstSet.length || zerothSet.length)) {
      for (let i = 0; i < leftPosts; i += 1) {
        firstSet.push(secondSet.pop());
      }
    }

    shuffleArray(secondSet);
    secondSet = sortWithPattern(secondSet, 2200);

    for (let i = 0; i < secondSet.length; i += 7) {
      secondSetFinal.push(secondSet.slice(i, i + 7));
    }
  }

  if (firstSet.length > 0) {
    firstSet.sort((a, b) => a.content.length - b.content.length);

    const leftPosts = firstSet.length % 5;
    if (leftPosts !== 0 && zerothSet.length) {
      for (let i = 0; i < leftPosts; i += 1) {
        zerothSet.push(firstSet.pop());
      }
    }

    shuffleArray(firstSet);
    firstSet = sortWithPattern(firstSet, 3000);

    for (let i = 0; i < firstSet.length; i += 5) {
      firstSetFinal.push(firstSet.slice(i, i + 5));
    }
  }

  if (zerothSet.length > 0) {
    for (let i = 0; i < zerothSet.length; i += 2) {
      zerothSetFinal.push(zerothSet.slice(i, i + 2));
    }
  }

  return {
    largerPosts: zerothSetFinal,
    largePosts: firstSetFinal,
    mediumPosts: secondSetFinal,
    semiMediumPosts: thirdSetFinal,
    smallPosts: fourthSetFinal,
    smallerPosts: fifthSetFinal,
    persons: data?.otherPeopleData ?? null,
  };
};
