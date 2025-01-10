This document provides an overview of how sessions are implemented, token handling, and how to use the `extractUserId` middleware to fetch the authenticated user's ID. It also explains how this can be applied for functionalities like database interactions.

---

## **Session Management**

1. **Authentication Token**:
    - Upon login, a JSON Web Token (JWT) is generated and signed using the secret key (`process.env.JWT_SECRET`).
    - The token includes the `user_id` as part of its payload.
    - Example token generation during login:
        
        ```jsx
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        ```
        
2. **Token Storage**:
    - The token is stored in a **HTTP-only cookie** for security and automatically sent with each request.
3. **Logout**:
    - During logout, the session token is cleared from cookies to invalidate the session.

---

## **Middleware for Authentication and User ID Extraction**

### **1. `authenticateUser`**

This middleware validates the session token and ensures the request is from an authenticated user.

- **Usage**: Use it for routes requiring basic authentication without extracting user details.

---

### **2. `extractUserId`**

This middleware extracts the `user_id` from the token and attaches it to the `req` object.

- **Purpose**: Provides the `user_id` to be used in controller logic for database interactions or logging.

---

## **How to Use `extractUserId`**

### **1. Middleware Integration**

Add `extractUserId` to any route where the `userId` is needed for database operations or logging. Example:

```jsx
router.post('/create-post', extractUserId, createPost);
```

### **2. Accessing `userId` in Controller**

Once the middleware is applied, the `userId` is available as `req.userId` in the route handler.

Example:

```jsx
 // Extract userId from the middleware (JWT)
 const home_owner_id = req.userId; // then you can use it as you need
```

---

## **Best Practices**

1. **Use `authenticateUser` for Authentication**:
    - Apply this middleware for routes requiring token validation without the need to access `userId`.
2. **Use `extractUserId` for Database Operations**:
    - Apply this middleware in routes where `userId` is required for database interactions or logging user-specific actions.
3. **Secure Token Management**:
    - Store the token in HTTP-only cookies.
    - Use `process.env.JWT_SECRET` to sign and verify tokens.
4. **Consistent Middleware Application**:
    - Ensure `extractUserId` is added **before** the controller function in the middleware chain.

---

## **Testing with Postman**

1. **Login**:
    - Perform a `POST` request to `/login` with valid credentials.
    - Retrieve the token from the response or cookies.
2. **Protected Route**:
    - Add the token to the `Authorization` header as `Bearer <token>` for requests requiring authentication or `extractUserId`.
    - Example:
        
        ```makefile
        Authorization: Bearer <your_token>
        ```
        
3. **Create Post Example**:
    - Endpoint: `/create-post`
    - Method: `POST`
    - Headers: `Authorization: Bearer <your_token>`
    - Body:
        
        ```json
        {
          "title": "My First Post",
          "content": "This is a post content"
        }
        ```
        

---

## **Conclusion**

With this setup:

- Sessions are secure and managed via JWT tokens.
- `userId` can be easily extracted using `extractUserId`.
- Your teammates can focus on using `req.userId` in their controllers to inject user-specific data into the database.