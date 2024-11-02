import API from './Api'

async function getTypes() {
    const baseurl = API.baseURL;
    let response = await fetch(baseurl + "types", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const types = await response.json();
        return types;
    } else {
        const errDetail = await response.json();
        if (errDetail.error) throw errDetail.error;
        if (errDetail.message) throw errDetail.message;
    }
}

const typeApi = {
    getTypes
}

export default typeApi;