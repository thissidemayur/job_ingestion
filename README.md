> # VisionFlow

```
                 ┌────────────────────┐
                 │  External API      │
                 │    Arbeitnow       │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ packages/ingestion │
                 │                    │
                 │ Fetcher            │
                 │ Adapter            │
                 │ Validator          │
                 │ Normalizer         │
                 └─────────┬──────────┘
                           │
                    canonical Job
                           │
                           ▼
                 ┌────────────────────┐
                 │ packages/database  │
                 │      Prisma        │
                 └─────────┬──────────┘
                           │
                           ▼
                      PostgreSQL


                 ┌────────────────────┐
                 │    apps/worker     │
                 │      BullMQ        │
                 └─────────┬──────────┘
                           │
                           └── uses ingestion

```

later the worker becomes:
```
Scheduler / API trigger
        ↓
     BullMQ
        ↓
      Worker
        ↓
   ingestion package
        ↓
    database package
    ```

```
                    ┌──────────────────┐
                    │  packages/shared │
                    └────────▲─────────┘
                             │
                             │
                    ┌────────┴─────────┐
                    │ packages/ingestion│
                    └────────▲─────────┘
                             │
                             │
                    ┌────────┴─────────┐
                    │   apps/worker    │
                    └──────────────────┘

apps/worker ───────────────→ packages/database
packages/ingestion ────────→ packages/shared

```


## how packages works:
```
                    ┌──────────────────┐
                    │      Shared      │
                    │   CanonicalJob   │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ↓                       ↓
        ┌─────────────────┐     ┌─────────────────┐
        │    Ingestion    │     │    Database     │
        │                 │     │                 │
        │ Fetch           │     │ Repository      │
        │ Validate        │     │ Prisma          │
        │ Normalize       │     │ PostgreSQL      │
        └────────┬────────┘     └────────┬────────┘
                 │                       │
                 └───────────┬───────────┘
                             ↓
                         Worker
                     (orchestration)
```