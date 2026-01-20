# Pague Zap - Project Rules & Architecture

## 1. Project Context
**Name:** Pague Zap
**Description:** B2B SaaS for WhatsApp billing management using the Official API.
**Core Value:** "Hybrid Billing" (Native Pix Button + Web Link Fallback) & "Opinionated Templates" (Pre-approved high-conversion templates).
**Language:** Portuguese (pt-BR) is mandatory for UI and Database content. Code comments/commits in English or Portuguese.

## 2. Tech Stack & Tools (Strict)
* **Framework:** Next.js 14+ (App Router).
* **Language:** TypeScript (Strict mode).
* **Styling:** Tailwind CSS + `@ui-ux-pro-max` (Custom Package) + `shadcn/ui` (Base components).
* **Backend/DB:** Supabase (PostgreSQL + Auth).
* **Payments:** Mercado Pago SDK.
* **Deploy:** Vercel.
* **MCPs:** Use `mcp-supabase`, `mcp-mercadopago`, `mcp-github` when available.

## 3. Critical Business Rules (Must Follow)

### A. The "Snapshot" Pattern (Charges)
**Rule:** NEVER rely solely on `product_id` relationship for historical charges.
**Logic:** When a charge is created, you MUST copy the product's current data (name, price, image) into the `charges` table columns (`snapshot_product_name`, `snapshot_price`, etc.).
**Why:** To allow editing a specific charge (e.g., giving a discount) without altering the global product, and to preserve history if the product changes later.

### B. "Opinionated" Templates
**Rule:** Users cannot create free-text templates.
**Logic:** The UI only allows enabling/disabling 2 standard system templates:
1.  `paguezap_billing_simple` (Variables: client, product, price, link).
2.  `paguezap_billing_detailed` (Variables: client, product, description, price, link).

### C. WhatsApp Payload Structure
**Rule:** All billing messages must use `type: "template"` with `button_type: "MPM"` (Multi-Product Message) logic for the Pix button.
**Payload Constraint:**
* `header`: Image URL (from snapshot).
* `body`: Mapped variables.
* `action`: Must contain `order_details` object with `pix_dynamic_code`.

## 4. Database Schema (Supabase)

Use this schema as the source of truth for all SQL queries and Types:

-- CUSTOMERS
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL, -- E.164 Format (55...)
  email TEXT,
  cpf TEXT
);

-- PRODUCTS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description_short VARCHAR(150), -- Critical for WhatsApp compatibility
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT
);

-- CHARGES (The Snapshot Table)
CREATE TABLE charges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  
  -- Snapshot Columns (Data frozen at creation time)
  snapshot_product_name TEXT NOT NULL,
  snapshot_product_description TEXT,
  snapshot_price DECIMAL(10,2) NOT NULL,
  snapshot_image_url TEXT,
  
  -- Payment Data
  payment_link_url TEXT, -- Fallback Web Link
  pix_copy_paste_code TEXT, -- Native WhatsApp Button Payload
  external_reference_id TEXT, -- For Webhook reconciliation
  
  status TEXT CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'FAILED')),
  scheduled_for TIMESTAMPTZ
);

-- SYSTEM SETTINGS
CREATE TABLE settings (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  waba_id TEXT,
  phone_number_id TEXT,
  waba_access_token TEXT, -- Store Encrypted
  mercadopago_access_token TEXT -- Store Encrypted
);

## 5. Coding Guidelines

### Frontend (Next.js)
* **Server Actions:** Use Server Actions for all data mutations (Create Charge, Save Product). Avoid API Routes unless necessary for Webhooks.
* **Client Components:** Use 'use client' only for interactive elements (Forms, Buttons, Dropdowns). Keep page roots as Server Components.
* **Validation:** Use `zod` for all form schemas.
* **UI Components:** Always prioritize `shadcn/ui` components. Use the sidebar layout pattern defined in `@ui-ux-pro-max`.

### Backend Logic
* **Hydration:** When creating a charge UI, fetch product data -> Populate Form State -> Allow User Edit -> Submit Snapshot.
* **Money Handling:** Always handle currency as Decimals/Integers on the backend. Format to "R$ XX,XX" only at the UI layer or text payload.

## 6. Directory Structure
/app
  /(dashboard)      # Protected Routes
    /dashboard
    /clients
    /products
    /charges        # Creation & List
    /settings
  /api
    /webhooks       # MP & WABA listeners
/components
  /ui               # Shadcn
  /forms            # Zod schemas & React Hook Form
/lib
  supabase.ts
  mercadopago.ts
  whatsapp.ts       # Template generators