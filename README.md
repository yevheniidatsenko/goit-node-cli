# Home Assignment: Creating Console Applications

## Description

This project is a Node.js console application for managing a contact list. The task involved setting up a repository, implementing functionality to read, add, delete, and retrieve contacts, and executing commands via the terminal.

## Implementation Steps

1. **Project Setup:**

   - Created a repository `goit-node-cli`.
   - Initialized the project with `npm init`.
   - Installed `commander` as a dependency.

2. **Core Functionality:**
   - Implemented `contacts.js` with file system operations using `fs/promises` and `path`.
   - Functions:
     - `listContacts()`: Retrieves all contacts.
     - `getContactById(id)`: Finds a contact by ID.
     - `addContact(name, email, phone)`: Adds a new contact.
     - `removeContact(id)`: Deletes a contact.
3. **Command Line Execution:**
   - Commands used:
     ```sh
     node index.js -a list
     node index.js -a get -i <contactId>
     node index.js -a add -n John -e john@example.com -p 123-456-7890
     node index.js -a remove -i <contactId>
     ```

## Results

- Successfully implemented all required functionalities.
- Below is a screenshot of the console output showcasing the results of executed commands:

![Task Results](/screenshots/SCR_1.png)
