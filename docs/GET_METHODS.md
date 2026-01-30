# GET Methods Documentation

This document describes how the GET endpoints work in the API, including all available query parameters and their usage.

## Base URL

All endpoints are prefixed with `/api`

---

## Endpoints

### 1. Get All Users

**Endpoint:** `GET /api/user`

**Description:** Retrieves a list of users with optional filtering, sorting, pagination, and field selection.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `fields` | string | No | `_id` | Comma-separated list of fields to include in the response |
| `limit` | number | No | `10` | Maximum number of results to return |
| `sort` | string | No | `createdAt` | Field name to sort by |
| `order` | string | No | `desc` | Sort order: `asc` or `desc` |
| `filter` | string | No | - | Filter conditions (see Filter Syntax below) |
| `populate` | string | No | - | Comma-separated list of relations to populate |

#### Field Selection (`fields`)

Select specific fields to include in the response. Fields are comma-separated.

**Note:** The `password` field is **automatically excluded** from all responses for security reasons, even if explicitly requested.

**Examples:**
```
GET /api/user?fields=username,email
GET /api/user?fields=username,email,avatar
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
]
```

#### Sorting (`sort` and `order`)

Sort results by any field in ascending or descending order.

**Examples:**
```
GET /api/user?sort=username&order=asc
GET /api/user?sort=createdAt&order=desc
GET /api/user?sort=email&order=asc
```

#### Pagination (`limit`)

Limit the number of results returned.

**Examples:**
```
GET /api/user?limit=5
GET /api/user?limit=20
```

#### Filtering (`filter`)

Filter users based on field conditions. Multiple conditions can be combined using commas.

**Filter Syntax:**

| Operator | Syntax | Description | Example |
|----------|--------|-------------|---------|
| Equals | `field:value` | Exact match | `email:john@example.com` |
| Greater Than | `field:>value` | Greater than | `createdAt:>2024-01-01` |
| Less Than | `field:<value` | Less than | `createdAt:<2024-12-31` |
| Greater or Equal | `field:>=value` | Greater than or equal | `createdAt:>=2024-01-01` |
| Less or Equal | `field:<=value` | Less than or equal | `createdAt:<=2024-12-31` |
| Wildcard | `field:*value*` | Pattern match (case-insensitive) | `username:*john*` |

**Examples:**
```
GET /api/user?filter=email:john@example.com
GET /api/user?filter=username:*john*,email:test@example.com
GET /api/user?filter=createdAt:>2024-01-01
```

#### Populate Relations (`populate`)

Populate referenced documents. Provide comma-separated relation names.

**Examples:**
```
GET /api/user?populate=profile,settings
```

#### Combined Examples

**Get first 5 users, sorted by username ascending, only username and email fields:**
```
GET /api/user?fields=username,email&limit=5&sort=username&order=asc
```

**Get users with email containing "example", sorted by creation date descending:**
```
GET /api/user?filter=email:*example*&sort=createdAt&order=desc
```

**Get users created after 2024-01-01, limit to 10, sorted by email:**
```
GET /api/user?filter=createdAt:>2024-01-01&limit=10&sort=email&order=asc
```

---

### 2. Get User by ID

**Endpoint:** `GET /api/user/:id`

**Description:** Retrieves a single user by their ID with optional field selection and population.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The unique identifier of the user |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated list of fields to include in the response |
| `populate` | string | No | Comma-separated list of relations to populate |

**Note:** The `password` field is **automatically excluded** from all responses for security reasons.

#### Examples

**Get user with all default fields:**
```
GET /api/user/507f1f77bcf86cd799439011
```

**Get user with specific fields:**
```
GET /api/user/507f1f77bcf86cd799439011?fields=username,email,avatar
```

**Get user with populated relations:**
```
GET /api/user/507f1f77bcf86cd799439011?populate=profile,settings
```

**Get user with specific fields and populated relations:**
```
GET /api/user/507f1f77bcf86cd799439011?fields=username,email&populate=profile
```

#### Response

**Success (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

**Error (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

## Security Features

### Password Field Protection

The `password` field is **automatically excluded** from all GET responses, regardless of query parameters. This ensures passwords are never exposed through the API, even if:

- `fields=password` is explicitly requested
- `fields=username,email,password` includes password
- No fields parameter is provided (password is excluded by default)

**Example:**
```
GET /api/user?fields=username,email,password
```

Even though `password` is requested, it will be automatically removed from the response.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Error message describing what went wrong"
}
```

**Common causes:**
- Invalid filter syntax
- Invalid field names in `fields` parameter
- MongoDB projection errors (e.g., mixing inclusion/exclusion)

### 404 Not Found
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

**Note:** In development mode, error responses include a `stack` property with the full error stack trace for debugging purposes.

---

## Response Format

All successful responses return JSON data:

- **Get All Users:** Returns an array of user objects
- **Get User by ID:** Returns a single user object

### Default Fields

When no `fields` parameter is specified:
- **Get All Users:** Returns only `_id` field
- **Get User by ID:** Returns all fields except `password`

### Timestamps

All user documents include automatic timestamps:
- `createdAt`: Date when the user was created
- `updatedAt`: Date when the user was last updated

These fields are included by default unless explicitly excluded via field selection.

---

## Best Practices

1. **Always exclude password:** The API automatically handles this, but be aware that password is never returned.

2. **Use field selection for performance:** When you only need specific fields, use the `fields` parameter to reduce response size and improve performance.

3. **Use pagination:** Always use the `limit` parameter when fetching lists to avoid large responses.

4. **Filter before fetching:** Use the `filter` parameter to narrow down results rather than filtering client-side.

5. **Combine parameters:** You can combine multiple query parameters for powerful queries:
   ```
   GET /api/user?fields=username,email&filter=email:*example*&sort=username&order=asc&limit=10
   ```

---

## Examples Summary

### Basic Usage
```bash
# Get all users (default: _id only, limit 10)
GET /api/user

# Get user by ID
GET /api/user/507f1f77bcf86cd799439011
```

### Field Selection
```bash
# Get specific fields
GET /api/user?fields=username,email,avatar

# Get user with specific fields
GET /api/user/507f1f77bcf86cd799439011?fields=username,email
```

### Filtering
```bash
# Filter by email
GET /api/user?filter=email:john@example.com

# Filter with wildcard
GET /api/user?filter=username:*john*

# Multiple filters
GET /api/user?filter=email:*example*,username:*doe*
```

### Sorting
```bash
# Sort by username ascending
GET /api/user?sort=username&order=asc

# Sort by creation date descending
GET /api/user?sort=createdAt&order=desc
```

### Pagination
```bash
# Limit results to 5
GET /api/user?limit=5

# Limit to 20 results
GET /api/user?limit=20
```

### Complex Queries
```bash
# Get first 5 users, sorted by username, only username and email
GET /api/user?fields=username,email&limit=5&sort=username&order=asc

# Get users with email containing "example", sorted by date
GET /api/user?filter=email:*example*&sort=createdAt&order=desc&limit=10
```
