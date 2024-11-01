import API from './Api'
import { ConnectionList } from '../dataModels/Connection';

async function sendConnections(connectionsList: ConnectionList) {
    const baseurl = API.baseURL;
    let response = await fetch(baseurl + "connections", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionsList),
    });
    if (response.ok) {
        const connections = await response.json();
        return connections;
    } else {
        const errDetail = await response.json();
        if (errDetail.error) throw errDetail.error;
        if (errDetail.message) throw errDetail.message;
    }
}

async function getTypeOfConnections() {
    const baseurl = API.baseURL;
    let response = await fetch(baseurl + "connections/names", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const connections = await response.json();
        return connections;
    } else {
        const errDetail = await response.json();
        if (errDetail.error) throw errDetail.error;
        if (errDetail.message) throw errDetail.message;
    }
}

const connectionApi = {
    sendConnections,
    getTypeOfConnections
};

export default connectionApi;