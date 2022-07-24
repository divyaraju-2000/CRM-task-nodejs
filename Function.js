import {client} from './index.js';
import {ObjectId} from 'mongodb';




export async function Login(username) {
    return await client.db("CRM").collection("users").findOne({ username: username });
}

export function updateServiceRequest(id, data) {
    return client.db("CRM").collection("serviceRequest").updateOne({ _id: ObjectId(id) }, $set(data));
}

export async function updateLeads(id, data) {
    return await client.db("CRM").collection("leads").updateOne({ _id: ObjectId(id) }, $set(data));
}

export async function updateContact(id, data) {
    return await client.db("CRM").collection("contacts").updateOne({ _id: ObjectId(id) }, $set(data));
}

export async function createServiceRequest(request) {
    return await client.db("CRM").collection("serviceRequest").insertOne({
        id: request.body.id,
        service_name: request.body.service_name,
        service_address1: request.body.service_address,
        servicce_description: request.body.service_description,
        name: request.body.name,
        active: request.body.active,
        email: request.body.email,
        phone: request.body.phone,
        preffered_slot: request.body.preffered_slot,
        preffered_date: request.body.preffered_date,
        client_address: request.body.client_address,
        zip: request.body.zip,
        user_id: request.body.user_id,
        date_deadline: request.body.date_deadline,
        description: request.body.description
    });
}

export async function createLeads(request, response) {
    return await client.db("CRM").collection("leads").insertOne({
        id: request.body.id,
        name: request.body.name,
        active: request.body.active,
        email: request.body.email,
        phone: request.body.phone,
        city: request.body.city,
        street: request.body.street,
        country_id: response.body.country,
        state_id: request.body.street_id,
        zip: request.body.zip,
        partner_name: request.body.partner_name,
        user_id: request.body.user_id,
        date_deadline: request.body.date_deadline,
        team_id: request.body.team_id,
        description: request.body.description
    });
}

export async function createContacts(request, response) {
    return await client.db("CRM").collection("contacts").insertOne({
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        city: request.body.city,
        street: request.body.street,
        country: response.body.country
    });
}

export async function createUser(request, hashedPassword) {
    return await client.db("CRM").collection("users").insertOne({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        username: request.body.username,
        password: hashedPassword,
        role: request.body.role
    });
}