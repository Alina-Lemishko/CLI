const shortid = require("shortid");
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join("./db/contacts.json");

async function listContacts() {
  try {
    const response = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(response);
    return contacts;
  } catch (error) {
    console.log("error", error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find((el) => el.id === contactId.toString());
    console.table(contactById);
    return contactById;
  } catch (error) {
    console.log("error", error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactById = contacts.filter((el) => el.id !== contactId.toString());
    const data = JSON.stringify(contactById);

    const addContacts = await fs.writeFile(contactsPath, data, "utf-8");
    const updatedListOfContacts = await listContacts();
    console.table(updatedListOfContacts);
    return contactById;
  } catch (error) {
    console.log("error", error);
  }
}

async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    throw new Error("Please add name, email and phone");
  }
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  };
  const response = await listContacts();

  if (response.find((el) => el.email === newContact.email)) {
    console.log("Sorry, contact with the same email was added before");
    return;
  }
  const data = JSON.stringify([...response, newContact]);

  const addContacts = await fs.writeFile(contactsPath, data, "utf-8");
  const updatedListOfContacts = await listContacts();
  console.table(updatedListOfContacts);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
