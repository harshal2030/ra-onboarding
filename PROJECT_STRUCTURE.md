# IndoThai Securities - Client Onboarding Platform

A **Next.js 16 + React 19** full-stack app for KYC onboarding and e-signature for research analyst services.

---

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 16 (App Router)                     |
| UI         | React 19, Tailwind CSS 4, shadcn/ui (Radix) |
| Database   | SQLite via Prisma 6.19 (BetterSQLite3)      |
| Auth       | JWT (jose) + OTP via SMS (Dove SMS)          |
| E-Sign     | Leegality API                               |
| Email      | Nodemailer (SMTP)                           |
| Validation | Zod                                         |

---

## Directory Structure

```
ra-onboarding/
├── app/
│   ├── layout.tsx                  # Root layout (Geist fonts, Toaster)
│   ├── page.tsx                    # Redirects → /verification
│   ├── login/                      # OTP-based phone login (2-step)
│   ├── verification/               # 5-step onboarding wizard
│   │   ├── disclaimer.tsx              # Step 1: Risk disclosure
│   │   ├── select-user-type.tsx        # Step 2: User type + PAN validation
│   │   ├── client-basic-details.tsx    # Step 3: Name, email, password
│   │   ├── client-profile.tsx          # Step 4: Full KYC info
│   │   └── kyc-esign.tsx               # Step 5: Leegality e-signature
│   └── api/
│       ├── send-otp/               # Generate & SMS OTP
│       ├── verify-otp/             # Validate OTP → JWT cookie
│       ├── logout/                 # Clear auth cookie
│       ├── user/me/                # GET/POST user profile
│       ├── user/verify/            # Step-specific data submission (Zod)
│       ├── esign/initiate/         # Start Leegality signing
│       ├── esign/callback/         # Webhook: save PDF, send email
│       ├── agreement/              # Generate HTML agreement (Handlebars)
│       ├── nationality/            # Nationality search API
│       └── cities/                 # Indian city search API
├── components/
│   ├── ui/                         # shadcn/ui primitives (button, input, dialog, calendar...)
│   └── custom/verify.tsx           # Confirmation dialog before submission
├── lib/
│   ├── auth.ts                     # JWT generate/verify, cookie helpers
│   ├── db.ts                       # Prisma client init
│   ├── sms.ts                      # Dove SMS integration
│   ├── mail.ts                     # Nodemailer email service
│   ├── leegality.ts                # E-signature service class
│   ├── file.ts                     # Base64 → file saver
│   ├── utils.ts                    # cn() helper
│   ├── nationality.json            # 250+ countries
│   └── city_names.json             # Indian cities
├── prisma/
│   ├── schema.prisma               # User model + enums
│   └── migrations/                 # DB migrations
├── hooks/useStepper.ts             # Step navigation hook
├── constants/config.ts             # Env-based config (mail, docs dir)
├── types/steps.ts                  # Step enum
├── proxy.ts                        # Auth middleware (JWT → x-user header)
└── templates/agreement.hbs         # Handlebars agreement template
```

---

## Database Schema (Prisma / SQLite)

Single **User** model tracking the entire onboarding lifecycle:

- **Auth**: `phone`, `otp`, `otpExpire`, `passwordHash`
- **Personal**: `firstName`, `middleName`, `lastName`, `email`, `dateOfBirth`, `gender`
- **KYC**: `type` (Individual/HUF/LLP/Corporate/Trust/Partnership), `pan_no`, `nationality`, `sourceOfIncome`, `politicalExpose`, `residentialStatus`, `maritalStatus`, `address`, `city`
- **Onboarding**: `currentStep` (1–5), `onboardingStatus` (PENDING → IN_PROGRESS → COMPLETED)
- **E-Sign**: `esignDocumentId`, `esignStatus`, `esignCompletedAt`

### Enums

| Enum              | Values                                                        |
| ----------------- | ------------------------------------------------------------- |
| UserType          | INDIVIDUAL, HUF, LLP, PARTNERSHIP_FIRM, CORPORATE, TRUST     |
| SourceOfIncome    | SALARY, BUSINESS, OTHER                                       |
| PoliticalExpose   | YES, NO, RELATED                                              |
| Gender            | MALE, FEMALE, OTHER                                           |
| ResidentialStatus | RESIDENTIAL_INDIVIDUAL, NON_RESIDENTIAL_INDIVIDUAL            |
| MaritalStatus     | SINGLE, MARRIED, DIVORCED                                     |
| OnboardingStatus  | PENDING, IN_PROGRESS, COMPLETED                               |
| EsignStatus       | INITIATED, IN_PROGRESS, COMPLETED, FAILED                     |

---

## Application Flow

```
Phone Login (OTP) → JWT Cookie
        ↓
Step 1: Disclaimer (risk agreement)
Step 2: User Type + PAN validation
Step 3: Basic Details (name/email/password)
Step 4: Full KYC Profile
Step 5: E-Sign via Leegality
        ↓
Webhook callback → Save signed PDF → Send confirmation email → COMPLETED
```

---

## Authentication & Middleware

- **`proxy.ts`** protects `/api/user/*`, `/api/agreement`, `/api/esign/initiate`
- Verifies JWT from cookies, injects `x-user` header with phone number
- Login/verification layouts also check JWT and redirect accordingly

### Auth Flow

1. User enters phone number on `/login`
2. API generates 6-digit OTP and sends via Dove SMS
3. User enters OTP → API validates and issues JWT (24h expiry)
4. JWT stored as `httpOnly` + `secure` cookie
5. User redirected to `/verification`

---

## API Routes

### Authentication

| Method | Route             | Description                     |
| ------ | ----------------- | ------------------------------- |
| POST   | `/api/send-otp`   | Generate OTP & send SMS         |
| POST   | `/api/verify-otp` | Validate OTP → set JWT cookie   |
| POST   | `/api/logout`     | Clear auth cookie               |

### User Management

| Method | Route              | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| GET    | `/api/user/me`     | Fetch current user profile               |
| POST   | `/api/user/me`     | Update user profile                      |
| POST   | `/api/user/verify` | Step-specific data submission (Zod)      |

### E-Signature (Leegality)

| Method | Route                 | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| POST   | `/api/esign/initiate` | Start Leegality signing, return signing URL  |
| POST   | `/api/esign/callback` | Webhook: save signed PDF, send email         |

### Data Lookups

| Method | Route              | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/api/nationality` | Search nationalities (250+)      |
| GET    | `/api/cities`      | Search Indian cities (fuzzy)     |
| GET    | `/api/agreement`   | Generate HTML agreement (HBS)    |

---

## Key Libraries

| Package       | Version | Purpose                      |
| ------------- | ------- | ---------------------------- |
| next          | 16.0.1  | App framework                |
| react         | 19.2.0  | UI library                   |
| prisma        | 6.19.0  | Database ORM                 |
| zod           | 4.1.12  | Schema validation            |
| jose          | 6.1.1   | JWT signing/verification     |
| bcryptjs      | 3.0.3   | Password hashing             |
| nodemailer    | 8.0.1   | Email sending                |
| handlebars    | 4.7.8   | Template engine              |
| date-fns      | 4.1.0   | Date utilities               |
| lucide-react  | 0.553.0 | Icon library                 |
| tailwindcss   | 4       | CSS framework                |
| @radix-ui/*   | Various | Headless UI components       |

---

## Environment Variables

```env
# Database
DATABASE_URL=file:./dev.db

# Auth
JWT_SECRET=<secret>
OTP_EXPIRE_MIN=2
ENV=dev|prod
NEXT_PUBLIC_ENV=dev|prod

# SMS (Dove SMS)
SMS_SENDERID=...
SMS_CLIENTSMSID=...
SMS_ACCOUNTUSAGETYPEID=1
SMS_ENTITYID=...
SMS_TEMPID=...
SMS_USER=...
SMS_USER_PASSWORD=...
SMS_ENDPOINT=https://mobicomm.dove-sms.com//REST/sendsms/

# Leegality E-Signature
LEEGALITY_AUTH_TOKEN=...
LEEGALITY_PRIVATE_SALT=...
LEEGALITY_BASE_URL=https://sandbox.leegality.com/api/v3.0
LEEGALITY_WORKFLOW_ID=...

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_PASSWORD=...
MAIL_USERNAME=...
MAIL_SENDER_EMAIL=...
MAIL_SENDER_NAME=Indo Thai

# File Storage
DOCS_DIR=../uploads
```

---

## Planned Improvements

- Migrate Prisma → **Drizzle ORM**
- Migrate SQLite → **PostgreSQL**
- Add a **Services** tab
