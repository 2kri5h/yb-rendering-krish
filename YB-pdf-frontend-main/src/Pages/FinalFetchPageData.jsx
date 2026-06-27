import axios from "axios";

const YEARBOOK_ORIGIN = "https://yearbook.sarc-iitb.org";
const LOCAL_API = "http://localhost:8000/api";
const YEARBOOK_TIMEOUT_MS = 45000;
const LOCAL_BACKEND_TIMEOUT_MS = 10000;
const FEED_PROCESS_TIMEOUT_MS = 90000;

const parseIdList = (idList) => {
    if (Array.isArray(idList)) return idList;
    if (typeof idList === "string" && idList.trim()) {
        try {
            return JSON.parse(idList);
        } catch (e) {
            console.warn("Could not parse idList, using empty list:", idList, e);
            return [];
        }
    }
    return [];
};

/** Ensure gallery/profile URLs are absolute for react-pdf */
const enrichProfileUrls = (profile) => {
    if (!profile || typeof profile !== "object") return profile;
    const p = { ...profile };
    ["profile_image", "img1", "img2", "img3", "img4"].forEach((key) => {
        const val = p[key];
        if (!val || typeof val !== "string") return;
        if (/^https?:\/\//i.test(val)) return;
        p[key] = `${YEARBOOK_ORIGIN}${val.startsWith("/") ? val : `/${val}`}`;
    });
    return p;
};

const enrichPostProfileUrls = (posts) => {
    if (!Array.isArray(posts)) return [];
    return posts.map((post) => {
        if (post?.is_anonymous) return post;

        let wbp = post.written_by_profile;
        if (!wbp && post.written_by_id) {
            wbp = {
                user: post.written_by_id,
                id: post.written_by_id,
                name: post.written_by,
            };
        }
        if (!wbp) return post;

        const enriched = enrichProfileUrls({ ...wbp });
        const hasImage =
            enriched.profile_image &&
            typeof enriched.profile_image === "string" &&
            enriched.profile_image.trim();

        if (!hasImage && post.written_by_id) {
            enriched.profile_image = `/api/Impression_Images/user_${post.written_by_id}/profile.jpg`;
        }

        return {
            ...post,
            written_by_profile: enriched,
        };
    });
};

/** When local Django backend is running, resolve default/placeholder profile URLs */
const tryProcessPostsViaBackend = async (posts) => {
    if (!Array.isArray(posts) || !posts.length) return posts;
    try {
        const res = await axios.post(
            `${LOCAL_API}/feed`,
            { posts },
            { timeout: FEED_PROCESS_TIMEOUT_MS }
        );
        const processed = Array.isArray(res.data)
            ? res.data
            : JSON.parse(res.data);
        if (!Array.isArray(processed) || processed.length !== posts.length) {
            return posts;
        }
        const byId = new Map(processed.map((p) => [p.id, p]));
        return posts.map((post) => {
            const updated = byId.get(post.id);
            if (!updated?.written_by_profile) return post;
            return {
                ...post,
                written_by_profile: enrichProfileUrls({
                    ...post.written_by_profile,
                    ...updated.written_by_profile,
                }),
            };
        });
    } catch {
        return posts;
    }
};

const FinalFetchPageData = async (id, idList) => {
    idList = parseIdList(idList);
    // console.log("Inside FinalFetchPageData: id:", id, "idList:", idList);
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg3NjM2MzI5LCJpYXQiOjE3ODI0NTIzMjksImp0aSI6Ijk1NGVhZmI0YjlmYTQ2OGJiNmQ3ODUyOTQxZDIyZjg0IiwidXNlcl9pZCI6ODg1N30.M0RARmmJUiDZon34oUhnVmXn4drq9RNfPxFnNk7eoxs";


    // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjM3NzcyOSwiaWF0IjoxNzMyMjkxMzI5LCJqdGkiOiI1NzA4MjM4ZmI4YzQ0MTExOTlkMzZhYzA4YzUzZGVlZSIsInVzZXJfaWQiOjY4Mjh9.tAAa-PbIm0akyqtSe8pMTgbySDkPyD_ralMuzNXAfho'
        // console.log('id in finalfetch: ', id);
        // console.log('idList in finalfetch: ', idList);
        const removeLineBreaks = (text) => {
            // Replace all line breaks with a space
            return text.replace(/(\r\n|\n|\r)/gm, " ");
        };
        
        try {
            const temp = [];
            
            const response = await axios.get(
                `${YEARBOOK_ORIGIN}/api/posts/others/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: YEARBOOK_TIMEOUT_MS,
                }
            );
            
            const responseDataUser = response.data;
            const userPostsRaw = Array.isArray(responseDataUser)
                ? responseDataUser
                : Array.isArray(responseDataUser?.results)
                  ? responseDataUser.results
                  : [];

            console.log("responseDataUser count:", userPostsRaw.length);

            const enrichedUserPosts = enrichPostProfileUrls(userPostsRaw);
            const processedUserPosts = await tryProcessPostsViaBackend(enrichedUserPosts);
            
            const fetchPostPromises = idList.map(async (otherId) => {
                try {
                const response = await axios.get(
                    `${YEARBOOK_ORIGIN}/api/posts/others/${otherId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        timeout: YEARBOOK_TIMEOUT_MS,
                    }
                );
                
                const profileResponse = await axios.get(
                    `${YEARBOOK_ORIGIN}/api/authenticate/profile/${otherId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        timeout: YEARBOOK_TIMEOUT_MS,
                    }
                );
                
                const profile = profileResponse.data;
                let newProfile = profile;

                try {
                    const newProfileResponse = await axios.post(
                        `${LOCAL_API}/profile`,
                        { profiles: [profile] },
                        { timeout: LOCAL_BACKEND_TIMEOUT_MS }
                    );
                    newProfile =
                        newProfileResponse.data?.[0] ??
                        newProfileResponse.data ??
                        profile;
                } catch (postError) {
                    console.warn(
                        `Local profile sync failed for user ${otherId}, using remote profile:`,
                        postError?.message ?? postError
                    );
                }

                newProfile = enrichProfileUrls(newProfile);
                
                let responseData = enrichPostProfileUrls(response.data);
                responseData = await tryProcessPostsViaBackend(responseData);
                
                let minusoneSet = [];
                let zerothSet = [];
                let firstSet = [];
                let firstPointOneSet = [];
                let firstPointTwoSet = [];
                let secondSet = [];
                let secondPointOneSet = [];
                let thirdSet = [];
                let fourthSet = [];
                let fifthSet = [];
                
                const minusoneSetFinal = [];
                const zerothSetFinal = [];
                const firstSetFinal = [];
                const firstPointOneSetFinal = [];
                const firstPointTwoSetFinal = [];
                const secondSetFinal = [];
                const secondPointOneSetFinal = [];
                const thirdSetFinal = [];
                const fourthSetFinal = [];
                const fifthSetFinal = [];
                
                responseData.forEach((post) => {
                    post.content = removeLineBreaks(post.content);
                    
                    if (post.content.length >= 4000) {
                        minusoneSet.push(post);
                    } else if (
                        post.content.length >= 2000 &&
                        post.content.length < 4000
                    ) {
                        zerothSet.push(post);
                    } else if (
                        post.content.length >= 1800 &&
                        post.content.length < 2000
                    ) {
                        firstPointOneSet.push(post);
                    } else if (
                        post.content.length < 1800 &&
                        post.content.length >= 1200
                    ) {
                        firstPointTwoSet.push(post);
                    } else if (
                        post.content.length < 1200 &&
                        post.content.length >= 1000
                    ) {
                        firstSet.push(post);
                    }
                    else if (
                        post.content.length < 1000 &&
                        post.content.length >= 800
                    ) {
                        secondPointOneSet.push(post);
                    }
                    else if (
                    post.content.length < 800 &&
                    post.content.length >= 600
                ) {
                    secondSet.push(post);
                }
                else if (
                    post.content.length < 600 &&
                    post.content.length >= 250
                ) {
                    thirdSet.push(post);
                }
                else if (
                    post.content.length < 250 &&
                    post.content.length >= 0
                ) {
                    fourthSet.push(post);
                } else {
                    fourthSet.push(post);
                }
            });

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
            
            function sortWithPattern(arr, length) {
                const bigPosts = arr.filter(
                    (post) => post.content.length > length / 2
                );
                const smallPosts = arr.filter(
                    (post) => post.content.length <= length / 2
                );
                
                shuffleArray(bigPosts);
                shuffleArray(smallPosts);
                
                const result = [];
                
                for (
                    let i = 0;
                    i < Math.max(bigPosts.length, smallPosts.length);
                    i++
                ) {
                    if (bigPosts[i]) result.push(bigPosts[i]);
                    if (smallPosts[i]) result.push(smallPosts[i]);
                }
                
                return result;
            }
            
            if (fifthSet.length > 0) {
                fifthSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = fifthSet.length % 12;
                
                if (
                    leftPosts !== 0 &&
                    (fourthSet.length !== 0 ||
                        thirdSet.length !== 0 ||
                        secondSet.length !== 0 ||
                        firstSet.length !== 0 ||
                        zerothSet.length !== 0)
                    ) {
                        for (let i = 0; i < leftPosts; i += 1) {
                            fourthSet.push(fifthSet.pop());
                        }
                    }
                    
                    shuffleArray(fifthSet);
                    
                    fifthSet = sortWithPattern(fifthSet, 300);
                    
                    for (let i = 0; i < fifthSet.length; i += 12) {
                        let chunk = fifthSet.slice(i, i + 12);
                        let temp = [];
                        
                        for (let j = 0; j < chunk.length; j += 2) {
                            let chunk2 = chunk.slice(j, j + 2);
                            temp.push(chunk2);
                        }
                        
                        fifthSetFinal.push(temp);
                    }
                }
                
                if (fourthSet.length > 0) {
                    fourthSet.sort((a, b) => a.content.length - b.content.length);
                    
                let leftPosts = fourthSet.length % 11;

                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        thirdSet.push(fourthSet.pop());
                    }
                }
                
                shuffleArray(fourthSet);
                fourthSet = sortWithPattern(fourthSet, 300);
                
                for (let i = 0; i < fourthSet.length; i += 11) {
                    let chunk = fourthSet.slice(i, i + 11);
                    fourthSetFinal.push(chunk);
                }
            }
            
            // Third Set
            if (thirdSet.length > 0) {
                thirdSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = thirdSet.length % 9;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        secondPointOneSet.push(thirdSet.pop());
                    }
                }
                
                shuffleArray(thirdSet);
                thirdSet = sortWithPattern(thirdSet, 600);
                
                for (let i = 0; i < thirdSet.length; i += 9) {
                    let chunk = thirdSet.slice(i, i + 9);
                    thirdSetFinal.push(chunk);
                }
            }
            
            // Second Point One Set
            if (secondPointOneSet.length > 0) {
                secondPointOneSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = secondPointOneSet.length % 7;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        secondSet.push(secondPointOneSet.pop());
                    }
                }
                
                shuffleArray(secondPointOneSet);
                secondPointOneSet = sortWithPattern(secondPointOneSet, 1000);
                
                for (let i = 0; i < secondPointOneSet.length; i += 7) {
                    let chunk = secondPointOneSet.slice(i, i + 7);
                    secondPointOneSetFinal.push(chunk);
                }
            }
            
            // Second Set
            if (secondSet.length > 0) {
                secondSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = secondSet.length % 6;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        firstSet.push(secondSet.pop());
                    }
                }
                
                shuffleArray(secondSet);
                secondSet = sortWithPattern(secondSet, 800);
                
                for (let i = 0; i < secondSet.length; i += 6) {
                    let chunk = secondSet.slice(i, i + 6);
                    secondSetFinal.push(chunk);
                }
            }
            
            // First Set
            if (firstSet.length > 0) {
                firstSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = firstSet.length % 5;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        firstPointOneSet.push(firstSet.pop());
                    }
                }
                
                shuffleArray(firstSet);
                firstSet = sortWithPattern(firstSet, 1000);
                
                for (let i = 0; i < firstSet.length; i += 5) {
                    let chunk = firstSet.slice(i, i + 5);
                    firstSetFinal.push(chunk);
                }
            }
            
            // First Point One Set
            if (firstPointOneSet.length > 0) {
                firstPointOneSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = firstPointOneSet.length % 4;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        firstPointTwoSet.push(firstPointOneSet.pop());
                    }
                }
                
                shuffleArray(firstPointOneSet);
                firstPointOneSet = sortWithPattern(firstPointOneSet, 1200);
                
                for (let i = 0; i < firstPointOneSet.length; i += 4) {
                    let chunk = firstPointOneSet.slice(i, i + 4);
                    firstPointOneSetFinal.push(chunk);
                }
            }
            
            // First Point Two Set
            if (firstPointTwoSet.length > 0) {
                firstPointTwoSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = firstPointTwoSet.length % 3;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        zerothSet.push(firstPointTwoSet.pop());
                    }
                }
                
                shuffleArray(firstPointTwoSet);
                firstPointTwoSet = sortWithPattern(firstPointTwoSet, 1800);
                
                for (let i = 0; i < firstPointTwoSet.length; i += 3) {
                    let chunk = firstPointTwoSet.slice(i, i + 3);
                    firstPointTwoSetFinal.push(chunk);
                }
            }
            
            // Zeroth Set
            if (zerothSet.length > 0) {
                zerothSet.sort((a, b) => a.content.length - b.content.length);
                
                let leftPosts = zerothSet.length % 2;
                
                if (leftPosts !== 0) {
                    for (let i = 0; i < leftPosts; i += 1) {
                        minusoneSet.push(zerothSet.pop());
                    }
                }
                
                shuffleArray(zerothSet);
                zerothSet = sortWithPattern(zerothSet, 2000);
                
                for (let i = 0; i < zerothSet.length; i += 2) {
                    let chunk = zerothSet.slice(i, i + 2);
                    zerothSetFinal.push(chunk);
                }
            }
            
            // Minus One Set
            if (minusoneSet.length > 0) {
                minusoneSet.sort((a, b) => a.content.length - b.content.length);
                
                shuffleArray(minusoneSet);
                minusoneSet = sortWithPattern(minusoneSet, 4000);
                
                for (let i = 0; i < minusoneSet.length; i += 1) {
                    let chunk = minusoneSet.slice(i, i + 1);
                    minusoneSetFinal.push(chunk);
                }
            }
            
            return {
                id: otherId,
                posts: {
                    profile: newProfile,
                    smallerPosts: fifthSetFinal,
                    smallPosts: fourthSetFinal,
                    semiMediumPosts: thirdSetFinal,
                    semiMediummPosts: secondPointOneSetFinal,
                    mediumPosts: secondSetFinal,
                    largePosts: firstSetFinal,
                    largeePosts: firstPointOneSetFinal,
                    largeeePosts: firstPointTwoSetFinal,
                    largerPosts: zerothSetFinal,
                    largerrPosts: minusoneSetFinal,
                },
            };
                } catch (personError) {
                    console.error(
                        `Failed to fetch other person ${otherId}:`,
                        personError?.message ?? personError
                    );
                    return null;
                }
        });
        
        const fetchedData = (await Promise.all(fetchPostPromises)).filter(Boolean);
        fetchedData.forEach((entry) => {
            if (entry?.posts) temp.push({ ...entry.posts });
        });

        return {
            userPosts: Array.isArray(processedUserPosts) ? processedUserPosts : [],
            otherPeopleData: temp,
        };

    } catch (error) {
        const status = error.response?.status;
        const detail =
            error.response?.data?.detail ??
            error.response?.data?.error ??
            error.message;

        console.error("FinalFetchPageData failed:", { id, status, detail, error });

        if (error.code === "ECONNABORTED" || String(detail).includes("timeout")) {
            throw new Error(
                `Yearbook server timed out fetching posts for ${id}. Try again later.`
            );
        }

        if (status === 401 || status === 403) {
            throw new Error(
                `Yearbook API rejected the request (${status}). The access token may have expired.`
            );
        }

        throw new Error(
            `Failed to fetch posts for ${id}: ${detail ?? "unknown error"}`
        );
    }
};

export default FinalFetchPageData;