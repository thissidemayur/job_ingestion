```
apps/
└── backend/
    ├── src/
    │   ├── config/              # Environment & application configuration
    │   ├── routes/              # Express route definitions
    │   ├── controllers/         # HTTP request/response handling
    │   ├── services/            # Business logic
    │   ├── repositories/        # Database access
    │   ├── middleware/          # Auth, validation, error handling, logging
    │   ├── validators/          # Zod schemas
    │   ├── dto/                 # Request/Response DTOs
    │   ├── workers/             # BullMQ workers (future)
    │   ├── queues/              # BullMQ queue definitions (future)
    │   ├── jobs/                # Job producers (future)
    │   ├── clients/             # External service clients (AI service)
    │   ├── lib/                 # Shared infrastructure (Prisma, logger, Redis)
    │   ├── errors/              # Custom error classes
    │   ├── constants/
    │   ├── types/
    │   ├── utils/
    │   ├── app.ts               # Express app configuration
    │   └── server.ts            # HTTP server entry point
    │
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts
    │
    ├── tests/
    │   ├── unit/
    │   ├── integration/
    │   └── e2e/
    │
    ├── docker/
    │
    ├── scripts/
    │
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── Dockerfile
    ├── package.json
    └── tsconfig.json

```

## High Level Diagram:
```
                         VISIONFLOW
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
          │                                     │
    WEB APPLICATION                       AI PIPELINE
          │                                     │
          ▼                                     ▼
       Next.js                               Camera
          │                                     │
          │ REST                                │ Frames
          ▼                                     ▼
       Express                           Python AI Service
          │                                     │
          │                                     │ Recognition
          │                                     │ Event
          │                                     ▼
          │                                  Express
          │                                     │
          │                                     │ enqueue
          │                                     ▼
          │                                Redis / BullMQ
          │                                     │
          │                                     ▼
          │                                   Worker
          │                                     │
          └─────────────────┬───────────────────┘
                            │
                            ▼
                       PostgreSQL

```


## 
```
AI
 │
 │ Event E123
 ▼
Express
 │
 ├─ validate event
 ├─ authenticate AI service
 │
 ▼
BullMQ.add(E123)
 │
 ├──────── FAILURE
 │              ↓
 │         return 503
 │              ↓
 │         AI retains/retries event
 │
 └──────── SUCCESS
                ↓
          return 202
                ↓
          AI may forget event

```
> The ingestion API returns success only after the recognition event has been successfully handed to the asynchronous processing infrastructure. Failed handoff returns an error so the producer can retry. Retries require idempotent event processing.

## Responsibility boundary
```
Camera
   ↓
AI Service
   │
   │ "I recognized this face"
   ▼
Express
   │
   │ "Does this recognition belong
   │  to an active attendance session?"
   ▼
BullMQ
   ↓
Worker
   ↓
Attendance business rules
   ↓
PostgreSQL
```

```
AI Service
     │
     │ RecognitionEvent
     ▼
Express Ingestion API
     │
     ├── authenticate producer
     ├── validate event structure
     └── enqueue
              │
              ▼
          202 Accepted

════════ ASYNC BOUNDARY ════════

           BullMQ
              │
              ▼
            Worker
              │
              ├── determine active session
              ├── verify recognized user
              ├── apply attendance rules
              ├── enforce idempotency
              └── persist attendance
                       │
                       ▼
                   PostgreSQL

```
> AI owns perception. Express ingestion owns acceptance. The asynchronous worker owns attendance processing and business decisions.


## VisionFLow -- High level Arch
```
                         ┌──────────────────────┐
                         │       Next.js        │
                         │       Frontend       │
                         └──────────┬───────────┘
                                    │
                                    │ REST / HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │                      │
                         │ • Authentication     │
                         │ • Authorization      │
                         │ • Business APIs      │
                         │ • Query APIs         │
                         └──────────┬───────────┘
                                    │
                                  Prisma
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     PostgreSQL       │
                         │                      │
                         │ System of Record     │
                         └──────────────────────┘


        REAL-TIME RECOGNITION PIPELINE
        ==============================

┌─────────────┐
│   Camera    │
└──────┬──────┘
       │
       │ Video stream / frames
       ▼
┌──────────────────────────┐
│    Python AI Service     │
│                          │
│ OpenCV                   │
│ YOLO / Face Detection    │
│ Face Embedding           │
│ Face Matching            │
│ Recognition Stabilizing  │
└────────────┬─────────────┘
             │
             │ Recognition Event
             │ HTTP / HTTPS
             ▼
┌──────────────────────────┐
│     Express Backend      │
│                          │
│ Recognition Ingestion    │
│                          │
│ • Authenticate producer  │
│ • Validate event         │
│ • Enqueue event          │
└────────────┬─────────────┘
             │
             │ BullMQ.add()
             ▼
┌──────────────────────────┐
│          Redis           │
│                          │
│       BullMQ Queue       │
└────────────┬─────────────┘
             │
             │ Job
             ▼
┌──────────────────────────┐
│      BullMQ Worker       │
│                          │
│ • Resolve session        │
│ • Validate student       │
│ • Attendance rules       │
│ • Duplicate protection   │
│ • Persist result         │
└────────────┬─────────────┘
             │
           Prisma
             │
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│                          │
│ AttendanceRecord         │
└──────────────────────────┘

```
> There aren't actually two Express servers or two PostgreSQL databases in this diagram. They're repeated visually to make the two flows readable.

physically:
```
                    ┌──────────────┐
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           ▼
Camera ──→ AI ──────→ EXPRESS
                           │
                    ┌──────┴───────┐
                    │              │
                    ▼              ▼
                 BullMQ        PostgreSQL
                    │
                    ▼
                  Worker
                    │
                    └──────────→ PostgreSQL
```


## Flow 1 — Normal business requests

Example: faculty wants attendance information.
```
Flow 1 — Normal business requests

Example: faculty wants attendance information.
```
Next.js
   │
   │ GET /api/v1/attendance/...
   ▼
Express
   ↓
Authentication
   ↓
Authorization
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL

```
This is synchronous because the user is waiting for an answer.
```

## Flow 2 — Recognition events
```
Camera
   ↓
AI
   ↓
Recognition
   ↓
Express
   ↓
Queue
   ↓
202 Accepted
```

The expensive/business processing continues separately:
```
BullMQ
   ↓
Worker
   ↓
Attendance business logic
   ↓
PostgreSQL
```

## Compononent Ownership
1. Camera: 
owns:
   - Capture video
   - Send video/frames to AI

2. AI service
owns **perception**: 
- frame processing
- face detection
- face embeddings
- face matching
- confidence
- recognition stabilization

3. Express:
Owns the application's HTTP boundary and synchronous business APIs.

For AI ingestion:
```
authenticate producer
validate event
enqueue
```
then:
```
enqueue success → 202
enqueue failure → 5xx
```

1. Redis/BullMQ
Owns asynchronous job delivery.
It provides things such as:
- buffering
- retries
- job lifecycle
- worker decoupling

It does not own attendance business rules.


### Better model:
```
             BACKEND
                │
        ┌───────┴────────┐
        │                │
   HTTP Process      Worker Process
        │                │
     Express           BullMQ

```

## 

###  1. Face enrollment
Suppose an admin registers Student A.

```
Admin / Student
      │
      │ Upload face image
      ▼
   Next.js
      │
      ▼
Express Backend
      │
      ├── authenticate
      ├── authorize
      ├── verify user exists
      │
      │ image
      ▼
AI Service
      │
      ├── detect face
      ├── validate image
      ├── generate embedding
      │
      ▼
Embedding Result(generate embedding)
      │
      ▼
Express
      │
      ▼
store FaceProfile
      │
      ▼
Persistent Storage(PostgreSQL)

```

### 2. Recognition
Once embeddings are available in AI memory:

```
Camera
   ↓
Frame
   ↓
Face Detection
   ↓
Face Embedding
   ↓
Compare against runtime embeddings
   ↓
Candidate identity
   ↓
Recognition stabilization
   ↓
RecognitionEvent
```
Then our previously designed pipeline continues:

```
RecognitionEvent
       ↓
Express
       ↓
BullMQ
       ↓
Worker
       ↓
Attendance business rules
       ↓
PostgreSQL

```
Express owns face enrollment as a business operation. The AI service owns generating embeddings and performing recognition. Durable identity/face-profile metadata belongs to backend-controlled persistent storage, while the AI service maintains the runtime representation needed for fast inference


## How do we update a running AI service? and How do we prevent PostgreSQL and AI memory from disagreeing?

when 5-1 enrolls:
```
Face image
    ↓
Express
    ↓
AI: generate embedding
    ↓
AI returns embedding
    ↓
Express
    ↓
PostgreSQL: persist FaceProfile
    ↓
COMMIT SUCCESSFUL
    ↓
Express → AI
"activate this persisted face profile"
    ↓
AI adds embedding to runtime index

```

critical oredering is: 

```GENERATE → PERSIST → ACTIVATE```

> PostgreSQL is authoritative. AI runtime is a derived, in-memory representation that may temporarily lag behind PostgreSQL but must have mechanisms to converge back to the authoritative state.
