import axios from "axios";

const LOCAL_API = "http://localhost:8000/api";
const YEARBOOK_ORIGIN = "https://yearbook.sarc-iitb.org";

const TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg3NjM2MzI5LCJpYXQiOjE3ODI0NTIzMjksImp0aSI6Ijk1NGVhZmI0YjlmYTQ2OGJiNmQ3ODUyOTQxZDIyZjg0IiwidXNlcl9pZCI6ODg1N30.M0RARmmJUiDZon34oUhnVmXn4drq9RNfPxFnNk7eoxs";

const authHeaders = {
    Authorization: `Bearer ${TOKEN}`,
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

const InitialFetchPageData = async (id) => {
    console.log("Initial Page Fetch Data running for id:", id);

    try {
        const res = await axios.get(`${LOCAL_API}/profile/${id}`, {
            headers: authHeaders,
            timeout: 120000,
        });
        return enrichProfileUrls(res.data);
    } catch (backendError) {
        const backendStatus = backendError.response?.status;
        const backendDetail =
            backendError.response?.data?.error ??
            backendError.response?.data?.detail ??
            backendError.message;

        console.warn(
            "Backend profile proxy failed:",
            { yearbookId: id, status: backendStatus, detail: backendDetail }
        );

        if (backendError.code === "ECONNREFUSED" || backendError.message?.includes("Network Error")) {
            throw new Error(
                `Cannot reach Django backend at ${LOCAL_API}. Start it with: ` +
                "cd YB-pdf-backend-main && python manage.py runserver"
            );
        }

        if (backendStatus === 504 || backendStatus === 502) {
            throw new Error(
                `Yearbook server timed out fetching profile ${id}. Try again later.`
            );
        }

        throw new Error(
            `Failed to fetch profile ${id}: ${backendDetail ?? "unknown error"}`
        );
    }
};

export default InitialFetchPageData;
