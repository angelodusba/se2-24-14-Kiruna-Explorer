import API from './Api'


async function getStakeholders() {
    const baseurl = API.baseURL;
    let response = await fetch(baseurl + "stakeholders", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const stakeholders = await response.json();
        return stakeholders;
    } else {
        const errDetail = await response.json();
        if (errDetail.error) throw errDetail.error;
        if (errDetail.message) throw errDetail.message;
    }
}

const stakeholderApi = {
    getStakeholders
}

export default stakeholderApi;