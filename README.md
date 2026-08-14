# Laxmi Cheat Fund 🏦

A backend-focused **Banking Management System** built with **Node.js, Express.js, MongoDB, JWT, and bcrypt**.

This project is primarily a learning project where I explored how real-world banking-style workflows can be designed — authentication, account management, role-based operations, financial transactions, transaction records, statements, receipts, and audit logging.

> **Note:** This is a learning/simulation project and is not intended for real-world banking or financial use.

---

## 🚀 Features

### Authentication & Account Management

* User registration
* User and Admin roles
* JWT-based authentication
* Password hashing with bcrypt
* Transaction PIN
* Automatic account number generation
* Account status management

  * Pending
  * Active
  * Blocked
  * Closed
* Admin registration with single-admin restriction
* Admin login
* User profile
* Change password
* Change transaction PIN

### Admin Management

* View all users
* Filter users by account status
* View pending users
* View active users
* View blocked users
* View closed users
* Update user account status

### 💰 Banking Operations

* Deposit money
* Withdraw money
* Transfer money between accounts
* Balance management
* Transaction PIN verification
* Receiver account verification
* Insufficient balance validation
* Self-transfer prevention
* Receiver account status validation

### 📊 Transaction System

Every financial operation generates a transaction record.

Supported transaction types:

* Deposit
* Withdrawal
* Transfer

Transaction records contain information such as:

* Transaction reference number
* User ID
* Account number
* Amount
* Transaction type
* Sender account
* Receiver account
* Transaction status
* Failure reason
* Timestamp

Both successful and failed transaction attempts are recorded.

### 🧾 Transaction Receipts

Transaction responses include receipt information containing details such as:

* Transaction reference
* Transaction type
* Amount
* Status
* Account information
* Failure reason when applicable
* Timestamp

### 📄 Account Statements

Users can retrieve their transaction history through the Statement API.

The transaction data can be filtered by:

* Transaction type
* Transaction status
* Transaction reference
* Date

### 📝 Audit Logs

The system maintains centralized audit logs for important application activities.

Examples:

* Account creation
* Login
* Failed login
* Logout
* Password changes
* PIN changes
* Admin actions
* Account status changes
* Other important system operations

Audit records can contain:

* Actor
* Actor role
* Action
* Status
* Target user
* IP address
* Timestamp

---

## 🧠 What I Learned

This project was built mainly to understand backend engineering beyond basic CRUD.

Some of the concepts explored:

* REST API design
* MVC architecture
* Authentication and authorization
* JWT and cookies
* Password/PIN hashing
* Middleware
* Role-based access
* MongoDB relationships
* Mongoose models
* Query parameters
* Transaction modelling
* Reusable utility functions
* Transaction reference generation
* Financial business logic
* Account status workflows
* Audit logging
* Error handling
* Database consistency considerations

One of the biggest learning points was understanding that a banking transaction is not simply:

```text
balance -= amount
```

but involves validation, transaction records, failure states, traceability, and eventually database-level atomicity.

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### Development

* Postman
* Git
* GitHub
* Nodemon

---

## 🔄 Basic Transaction Flow

```text
User
  │
  ▼
Authentication
  │
  ▼
Account Status Verification
  │
  ▼
Transaction Request
  │
  ├── Validation
  ├── PIN Verification
  ├── Balance Verification
  ├── Receiver Verification
  │
  ▼
Balance Update
  │
  ▼
Transaction Record
  │
  ▼
Success / Failed Response
```

---

## 🔐 Security Considerations

The project currently implements:

* Password hashing
* Transaction PIN hashing
* JWT authentication
* Protected routes
* Role-based access
* Account status checks
* Sensitive information exclusion from user-facing responses
* IP address recording in audit logs

Additional security and production-grade consistency improvements are planned for future iterations.

---

## 📌 Future Improvements

This project is intentionally not being turned into a production banking platform.

Potential future additions include:

* Email verification
* OTP verification
* Forgot password
* Improved logout/session invalidation
* QR-based payments
* Notifications
* MongoDB transactions for atomic financial operations
* Better frontend
* Additional banking features

---

## 🎯 Purpose

The goal of this project is not to recreate an actual bank.

The goal is to use a familiar domain to explore:

> **How backend systems handle authentication, authorization, state, financial operations, data modelling, failures, and auditability.**

This project will continue to evolve as I learn more about backend development and system design.

---

## 👨‍💻 Author

**Rishabh**

Built as a hands-on backend learning project.

---
