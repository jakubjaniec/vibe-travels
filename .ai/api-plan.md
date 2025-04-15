# REST API Plan

## 1. Resources

- **Users**: Managed by Supabase Auth. Contains user details and authentication credentials.
- **Travel Preferences**: Stores users' travel preferences, linked by user_id.
- **Travel Notes**: Contains travel note data, including title and content (with a validation constraint for content length between 100 and 10,000 characters), linked by user_id.
- **Travel Plans**: Stores AI-generated travel plans, in a 1:1 relationship with travel notes via note_id.
- **Logs**: Captures user actions and events for auditing purposes, linked by user_id.

## 2. Endpoints

### Travel Preferences

- **GET /api/preferences**

  - **Description**: Retrieve the current user's travel preferences.
  - **Response**:
    ```json
    {
      "user_id": "UUID",
      "travel_type": "string",
      "budget": "string",
      "style": "string",
      "number_of_people": number,
      "travel_duration": number,
      "activity_level": "string",
      "preferred_climates": "string",
      "restrictions": "string"
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

- **PUT /api/preferences**

  - **Description**: Update the current user's travel preferences.
  - **Request Body**:
    ```json
    {
      "travel_type": "string",
      "budget": "string",
      "style": "string",
      "number_of_people": number,
      "travel_duration": number,
      "activity_level": "string",
      "preferred_climates": "string",
      "restrictions": "string"
    }
    ```
  - **Response**: Updated preferences object.
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 Bad Request, 401 Unauthorized

### Travel Notes

- **GET /api/travel-notes**

  - **Description**: Retrieve a list of travel notes for the authenticated user.
  - **Response**:
    ```json
    {
      "notes": [
        { "id": "UUID", "title": "string", "content": "string", "created_at": "timestamp", "updated_at": "timestamp" }
      ]
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized

- **POST /api/travel-notes**

  - **Description**: Create a new travel note.
  - **Request Body**:
    ```json
    {
      "title": "string",
      "content": "string" // Must be between 100 and 10,000 characters
    }
    ```
  - **Response**: Created travel note object.
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 Bad Request, 401 Unauthorized

- **GET /api/travel-notes/{noteId}**

  - **Description**: Retrieve a single travel note by its ID.
  - **Path Parameter**:
    - `noteId`: UUID
  - **Response**: Travel note object.
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

- **PUT /api/travel-notes/{noteId}**

  - **Description**: Update an existing travel note.
  - **Path Parameter**:
    - `noteId`: UUID
  - **Request Body**:
    ```json
    {
      "title": "string",
      "content": "string" // Must be between 100 and 10,000 characters
    }
    ```
  - **Response**: Updated travel note object.
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

- **DELETE /api/travel-notes/{noteId}**
  - **Description**: Delete an existing travel note.
  - **Path Parameter**:
    - `noteId`: UUID
  - **Response**: Confirmation message.
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

### Travel Plans

- **POST /api/travel-notes/{noteId}/generate-plan**

  - **Description**: Generate a detailed travel plan for the specified travel note using AI.
  - **Path Parameter**:
    - `noteId`: UUID
  - **Request Body**: Optionally empty or additional parameters for customization.
  - **Behavior**: Validates that the note's content length is between 100 and 10,000 characters. Logs the generation action.
  - **Response**:
    ```json
    {
      "note_id": "UUID",
      "title": "string",
      "content": "string", // Generated plan content
      "generated_at": "timestamp"
    }
    ```
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 Bad Request, 401 Unauthorized, 422 Unprocessable Entity

- **GET /api/travel-notes/{noteId}/plan**
  - **Description**: Retrieve the generated travel plan associated with a specific travel note.
  - **Path Parameter**:
    - `noteId`: UUID
  - **Response**: Travel plan object.
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

### Logs

- **GET /api/logs**
  - **Description**: Retrieve a log of user actions. This endpoint may be restricted to the user's own actions or require admin privileges.
  - **Response**:
    ```json
    {
      "logs": [
        { "id": number, "user_id": "UUID", "timestamp": "timestamp", "action_type": "string" }
      ],
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 403 Forbidden

## 3. Authentication and Authorization

- The API will use token-based authentication (e.g., JWT) managed by Supabase Auth.
- All endpoints (except registration and login) require an `Authorization: Bearer <token>` header.
- Role-based access control will be implemented for sensitive endpoints (e.g., retrieving logs).

## 4. Validation and Business Logic

- **Validation Rules**:
  - Travel Note `content` must be between 100 and 10,000 characters.
  - All required fields for each resource must be present and properly formatted.
- **Business Logic**:
  - AI-powered travel plan generation is triggered only if the travel note meets the length requirements.
  - User actions (create note; generate travel plan) are logged in the database.
  - Rate limiting, input sanitization, and other security measures will be enforced to prevent abuse.

This API plan is designed to integrate seamlessly with the specified tech stack (Astro, TypeScript, React, Tailwind, and Supabase) and adhere to the project requirements outlined in the PRD and database schema.
