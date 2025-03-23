import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Constants for error messages
const ERROR_MESSAGES = {
  CONTACT_NOT_FOUND: "Contact not found!",
  INVALID_INPUT: "Name, email, and phone are required!",
  FILE_NOT_FOUND: "Contacts file not found!",
};

// Get the path to the contacts.json file
function getFilePath(filename) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "db", filename);
}

const contactsPath = getFilePath("contacts.json");

// Function to get the list of contacts
async function listContacts() {
  try {
    await fs.access(contactsPath);
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(ERROR_MESSAGES.FILE_NOT_FOUND);
      return [];
    }
    console.error("Error reading contacts:", error);
    throw error;
  }
}

// Function to get a contact by ID
async function getContactById(contactId) {
  if (!contactId) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error finding contact:", error);
    throw error;
  }
}

// Function to remove a contact by ID
async function removeContact(contactId) {
  if (!contactId) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);

    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
}

// Function to add a new contact
async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    const contacts = await listContacts();
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

export { listContacts, getContactById, addContact, removeContact };
