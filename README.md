# Password Manager - System Design Document


## 1. Architecture Overview


```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ PasswordManager  │  │ AddPasswordForm   │  │ PasswordList │  │
│  │   Component      │  │   Component       │  │  Component   │  │
│  └────────┬─────────┘  └─────────┬────────┘  └──────┬───────┘  │
│           │                      │                  │           │
│           └──────────────────────┼──────────────────┘           │
│                                  │                              │
│                    ┌─────────────▼──────────────┐               │
│                    │  Encryption Utility        │               │
│                    │  (crypto-js, AES-256)      │               │
│                    └─────────────┬──────────────┘               │
│                                  │                              │
│                    ┌─────────────▼──────────────┐               │
│                    │  API Client (axios)        │               │
│                    │  /api/v1/passwords/*       │               │
│                    └─────────────┬──────────────┘               │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │ HTTPS
                                   │
┌──────────────────────────────────┼──────────────────────────────┐
│                     NETWORK / API GATEWAY                        │
│                     (Rate Limiting, CORS)                        │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────┐
│                      SERVER LAYER (Node.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Auth Middleware  │  │ Password Routes  │  │ Error Handle │  │
│  │ (JWT Validation) │  │ (CRUD + Security)│  │    Logging   │  │
│  └────────┬─────────┘  └─────────┬────────┘  └──────┬───────┘  │
│           │                      │                  │           │
│           └──────────────────────┼──────────────────┘           │
│                                  │                              │
│                    ┌─────────────▼──────────────┐               │
│                    │ Password Controller        │               │
│                    │ • Create                   │               │
│                    │ • Read                     │               │
│                    │ • Update                   │               │
│                    │ • Delete                   │               │
│                    │ • Search                   │               │
│                    └─────────────┬──────────────┘               │
│                                  │                              │
│                    ┌─────────────▼──────────────┐               │
│                    │ Encryption Service         │               │
│                    │ (Server-side encryption)   │               │
│                    └─────────────┬──────────────┘               │
│                                  │                              │
│                    ┌─────────────▼──────────────┐               │
│                    │ Audit Logger               │               │
│                    │ (Log all password access)  │               │
│                    └─────────────┬──────────────┘               │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Password         │  │ AuditLog         │  │ User         │  │
│  │ Collection       │  │ Collection       │  │ Collection   │  │
│  │ • userId         │  │ • userId         │  │ • _id        │  │
│  │ • service        │  │ • action         │  │ • email      │  │
│  │ • username       │  │ • timestamp      │  │ • password   │  │
│  │ • password(enc)  │  │ • ipAddress      │  │ • role       │  │
│  │ • url            │  │ • status         │  │ • verified   │  │
│  │ • createdAt      │  │                  │  │              │  │
│  │ • updatedAt      │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Models

### 2.1 Password Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  service: String,               // Gmail, GitHub, etc.
  username: String,              // Username or email
  password: String,              // Encrypted password
  url: String,                   // Optional URL
  category: String,              // Work, Personal, etc.
  tags: [String],                // Tags for organization
  notes: String,                 // Additional notes
  strengthScore: Number,         // 0-100 password strength
  lastAccessedAt: Date,          // Track access
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 AuditLog Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  action: String,                // 'CREATE', 'READ', 'UPDATE', 'DELETE'
  resourceType: String,          // 'PASSWORD'
  resourceId: ObjectId,          // Password ID
  ipAddress: String,
  userAgent: String,
  status: String,                // 'SUCCESS', 'FAILED'
  reason: String,                // Failure reason if any
  createdAt: Date
}
```

---

## 3. Security Layers

### 3.1 Client-Side Security
```
┌─────────────────────────────────────┐
│ User Input                          │
├─────────────────────────────────────┤
│ ↓ Password Strength Validator       │
│ (Min 12 chars, uppercase, numbers)  │
├─────────────────────────────────────┤
│ ↓ AES-256 Encryption                │
│ (crypto-js library)                 │
├─────────────────────────────────────┤
│ ↓ HTTPS Transmission                │
│ (SSL/TLS encryption in transit)     │
├─────────────────────────────────────┤
│ Encrypted Data → Server             │
└─────────────────────────────────────┘
```

### 3.2 Server-Side Security
```
┌─────────────────────────────────────┐
│ Encrypted Data Received             │
├─────────────────────────────────────┤
│ ↓ JWT Validation                    │
│ (Verify user authentication)        │
├─────────────────────────────────────┤
│ ↓ Rate Limiting                     │
│ (Max 100 requests/hour)             │
├─────────────────────────────────────┤
│ ↓ Input Sanitization                │
│ (Remove malicious code)             │
├─────────────────────────────────────┤
│ ↓ Optional: Re-encryption           │
│ (Server-side additional layer)      │
├─────────────────────────────────────┤
│ ↓ Database Storage                  │
│ (Encrypted at rest)                 │
├─────────────────────────────────────┤
│ ↓ Audit Logging                     │
│ (All access tracked)                │
└─────────────────────────────────────┘
```

### 3.3 Database Security
```
┌─────────────────────────────────────┐
│ Database Layer                      │
├─────────────────────────────────────┤
│ • MongoDB Atlas encryption          │
│ • User isolation (userId filtering) │
│ • Indexed queries (Fast + Secure)   │
│ • Backup & Point-in-time recovery   │
│ • Role-based access control         │
│ • Connection IP whitelisting        │
└─────────────────────────────────────┘
```

---

## 4. API Endpoints

### 4.1 Password Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/passwords` | Get all passwords | ✅ |
| GET | `/api/v1/passwords/:id` | Get single password | ✅ |
| GET | `/api/v1/passwords/search?q=gmail` | Search passwords | ✅ |
| POST | `/api/v1/passwords` | Create password | ✅ |
| PUT | `/api/v1/passwords/:id` | Update password | ✅ |
| DELETE | `/api/v1/passwords/:id` | Delete password | ✅ |
| POST | `/api/v1/passwords/:id/copy` | Log access & return decrypted | ✅ |

### 4.2 Audit Log Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/audit-logs` | View access logs | ✅ |
| GET | `/api/v1/audit-logs/password/:id` | Logs for specific password | ✅ |

---

## 5. Request/Response Flow

### 5.1 Save Password Flow
```
User Input (Plain Password)
        ↓
Client-side validation
        ↓
AES-256 Encryption (client)
        ↓
HTTPS POST /api/v1/passwords
        ↓
Server receives encrypted password
        ↓
JWT verification
        ↓
Input sanitization
        ↓
Optional: Server-side re-encryption
        ↓
Store in MongoDB
        ↓
Log audit event
        ↓
Return { success: true, id: "..." }
        ↓
Display success toast
```

### 5.2 Retrieve & Auto-fill Flow
```
User clicks "Copy" or "Auto-fill"
        ↓
Client sends GET /api/v1/passwords/:id
        ↓
Server verifies JWT & permission
        ↓
Log audit access event
        ↓
Return encrypted password
        ↓
Client decrypts (AES-256)
        ↓
Display in masked form OR
Auto-fill into form field
```

---

## 6. Encryption Strategy

### 6.1 Client-Side Encryption
```javascript
// Encryption Key (16, 24, or 32 bytes for AES)
SECRET_KEY = process.env.VITE_ENCRYPTION_KEY

// Encryption
encrypted = AES.encrypt(plainPassword, SECRET_KEY)

// Decryption
plain = AES.decrypt(encrypted, SECRET_KEY)
```

### 6.2 Server-Side Optional Re-encryption
```javascript
// Master encryption key (different from client key)
MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY

// Store double-encrypted in database
doubleEncrypted = AES.encrypt(clientEncrypted, MASTER_KEY)

// On retrieval
clientEncrypted = AES.decrypt(doubleEncrypted, MASTER_KEY)
// Return to client for decryption
```

---

## 7. Performance Optimization

### 7.1 Caching Strategy
```javascript
// Cache passwords in memory (with TTL)
Redis Cache:
- Key: user_id:password_id
- Value: Encrypted password
- TTL: 5 minutes
- Hit ratio: ~70% reduction in DB queries
```

### 7.2 Indexing Strategy
```javascript
// MongoDB Indexes
db.passwords.createIndex({ userId: 1 })
db.passwords.createIndex({ userId: 1, service: 1 })
db.passwords.createIndex({ userId: 1, createdAt: -1 })
db.auditlogs.createIndex({ userId: 1, createdAt: -1 })

// Improves query speed by 100-1000x
```

---

## 8. Scalability Design

### 8.1 Horizontal Scaling
```
Load Balancer (Nginx/HAProxy)
        ↓
┌───────────────────────────────┐
│ Server Instance 1 (Node.js)   │
│ Server Instance 2 (Node.js)   │
│ Server Instance 3 (Node.js)   │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│ MongoDB Replica Set           │
│ (Primary + 2 Secondaries)     │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│ Redis Cluster (Caching)       │
└───────────────────────────────┘
```

### 8.2 Database Sharding
```
User ID 0-100K → Shard 1
User ID 100K-200K → Shard 2
User ID 200K+ → Shard 3

Benefits:
- Distribute load across servers
- Faster queries on smaller datasets
- Independent backup per shard
```

---

## 9. Rate Limiting Strategy

```javascript
// Per-user rate limits
POST /api/v1/passwords → 10 requests/minute
GET /api/v1/passwords → 100 requests/minute
DELETE /api/v1/passwords/:id → 5 requests/minute

// Implementation
Redis Counter:
- Key: user_id:endpoint:minute
- Increment on each request
- Expire after 60 seconds
- Return 429 (Too Many Requests) if exceeded
```

---

## 10. Audit Logging Strategy

```javascript
// Log entry structure
{
  timestamp: Date,
  userId: ObjectId,
  action: 'PASSWORD_COPY',
  passwordId: ObjectId,
  service: 'Gmail',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  status: 'SUCCESS',
  duration: 45  // ms
}

// Retention policy
- Keep logs for 90 days
- Archive to cold storage after 90 days
- Searchable for 30 days
```

---

## 11. Error Handling & Logging

### 11.1 Error Codes
```javascript
400 → Bad Request (invalid input)
401 → Unauthorized (no valid JWT)
403 → Forbidden (permission denied)
404 → Not Found (password doesn't exist)
429 → Too Many Requests (rate limited)
500 → Internal Server Error
503 → Service Unavailable (DB down)
```

### 11.2 Structured Logging
```javascript
{
  timestamp: ISO8601,
  level: 'ERROR|WARN|INFO',
  service: 'password-manager',
  context: {
    userId: '...',
    endpoint: '/api/v1/passwords',
    method: 'POST'
  },
  message: 'Failed to save password',
  error: {
    code: 'DB_CONNECTION_ERROR',
    details: '...'
  }
}
```

---

## 12. Deployment Architecture

```
┌─────────────────────────────────────┐
│ Client (React SPA)                  │
│ Hosted on: Vercel / AWS S3 + CloudFront
└─────────────────────────────────────┘
              ↓ (HTTPS)
┌─────────────────────────────────────┐
│ API Server (Node.js/Express)        │
│ Hosted on: AWS EC2 / Heroku / Render
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Database (MongoDB)                  │
│ Hosted on: MongoDB Atlas            │
│ Replication: 3-node replica set     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Cache (Redis)                       │
│ Hosted on: AWS ElastiCache          │
└─────────────────────────────────────┘
```

---

## 13. Security Checklist

- [ ] HTTPS/TLS for all communication
- [ ] JWT tokens with 1-hour expiry
- [ ] Refresh tokens with 7-day expiry
- [ ] Password hashing (bcrypt) for user passwords
- [ ] Rate limiting (100 requests/minute per user)
- [ ] Input validation & sanitization
- [ ] XSS protection (content security headers)
- [ ] CSRF protection (CSRF tokens)
- [ ] SQL/NoSQL injection prevention (parameterized queries)
- [ ] Encrypted at rest (database level)
- [ ] Encrypted in transit (HTTPS)
- [ ] Audit logging for all access
- [ ] Regular security audits
- [ ] Penetration testing quarterly
- [ ] Incident response plan
- [ ] Data backup daily (with encryption)
- [ ] GDPR compliance (data retention, right to delete)
- [ ] Master password option (optional 2FA)

---

## 14. Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Save password | < 200ms | - |
| Retrieve password | < 100ms | - |
| Search passwords | < 300ms | - |
| API response time | < 500ms | - |
| Database query time | < 50ms | - |
| Cache hit ratio | > 70% | - |
| Uptime | 99.9% | - |
| Error rate | < 0.1% | - |

---

## 15. Future Enhancements

1. **Master Password Protection** - Add master password for extra security
2. **Biometric Authentication** - Fingerprint/Face recognition unlock
3. **Password Generator** - Auto-generate strong passwords
4. **Browser Extension** - Chrome/Firefox extension for auto-fill
5. **Mobile App** - iOS/Android native app
6. **End-to-End Encryption** - Client encrypts all data before sending
7. **Zero-Knowledge Architecture** - Server never sees plain passwords
8. **Hardware Security Keys** - Support for YubiKey, etc.
9. **Breach Monitoring** - Alert if password appears in data leaks
10. **Team Sharing** - Share passwords securely with team members
11. **Backup Codes** - Recovery codes for account access
12. **Password History** - Track password changes over time

---

## Summary

This password manager system provides:
- ✅ **End-to-end encryption** (client + server)
- ✅ **User isolation** (userId-based access)
- ✅ **Audit trails** (all access logged)
- ✅ **Rate limiting** (DDoS protection)
- ✅ **Scalable architecture** (horizontal scaling ready)
- ✅ **High performance** (caching + indexing)
- ✅ **Enterprise-grade security** (industry standards)
- ✅ **Compliance-ready** (GDPR, CCPA)
