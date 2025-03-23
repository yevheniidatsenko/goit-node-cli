import { program } from "commander";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} from "./contacts.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the path to the contacts.json file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "db", "contacts.json");

// Check if the contacts.json file exists
async function ensureContactsFileExists() {
  try {
    await fs.access(contactsPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(contactsPath, JSON.stringify([]));
      console.warn("\x1B[33m Contacts file created automatically.");
    } else {
      throw error;
    }
  }
}

// CLI setup
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

// Function to invoke the appropriate methods
async function invokeAction({ action, id, name, email, phone }) {
  try {
    await ensureContactsFileExists();

    switch (action) {
      case "list":
        console.log("Performing 'list' operation...");
        const contacts = await listContacts();
        console.table(contacts);
        console.log("\x1B[32m Operation 'list' completed successfully!");
        break;

      case "get":
        if (!id) {
          throw new Error("Contact ID is required for 'get' operation!");
        }
        console.log(`Performing 'get' operation for contact with id=${id}...`);
        const contact = await getContactById(id);
        console.table(contact ? contact : `Contact with id=${id} not found`);
        console.log("\x1B[32m Operation 'get' completed successfully!");
        break;

      case "add":
        if (!name || !email || !phone) {
          throw new Error(
            "Name, email, and phone are required for 'add' operation!"
          );
        }
        console.log(
          `Performing 'add' operation with name=${name}, email=${email}, phone=${phone}...`
        );
        const newContact = await addContact(name, email, phone);
        console.table([newContact]);
        console.log("\x1B[32m Operation 'add' completed successfully!");
        break;

      case "remove":
        if (!id) {
          throw new Error("Contact ID is required for 'remove' operation!");
        }
        console.log(
          `Performing 'remove' operation for contact with id=${id}...`
        );
        const removedContact = await removeContact(id);
        if (removedContact) {
          console.table([removedContact]);
          console.log("\x1B[32m Operation 'remove' completed successfully!");
        } else {
          console.log(`Contact with id=${id} not found`);
        }
        break;

      default:
        console.warn("\x1B[31m Unknown action type!");
    }
  } catch (error) {
    console.error("\x1B[31m Error:", error.message);
  }
}

invokeAction(options);
