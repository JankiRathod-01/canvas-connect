# SQL Server Recommendations — Art Gallery Management System

Practical SQL Server guidelines for implementing the Art Gallery Management System schema (database-first scripts under the backend `database/scripts/` folder).

---

## Naming conventions

| Item | Convention | Example |
| --- | --- | --- |
| Tables | Plural PascalCase | `Artists`, `Artworks`, `ExhibitionArtworks` |
| Columns | PascalCase | `ArtistId`, `CreatedAt` |
| Primary keys | `<Entity>Id` | `ArtworkId` |
| Foreign keys | Same name as referenced PK | `Artworks.ArtistId` |
| Indexes | `IX_<Table>_<Columns>` | `IX_Artworks_ArtistId` |
| Unique indexes | `UQ_<Table>_<Columns>` | `UQ_Categories_Name` |
| Primary key constraints | `PK_<Table>` | `PK_Artworks` |
| Foreign key constraints | `FK_<Child>_<Parent>` | `FK_Artworks_Artists` |
| Check constraints | `CK_<Table>_<Column>` | `CK_Artworks_Status` |
| Defaults | `DF_<Table>_<Column>` | `DF_Artworks_CreatedAt` |

Identity tables keep ASP.NET Core names (`AspNetUsers`, `AspNetRoles`, …).

---

## Data types

| Use case | Recommended type | Notes |
| --- | --- | --- |
| Primary / foreign keys | `uniqueidentifier` | Aligns with Identity `Guid` keys |
| Short / medium text | `nvarchar(n)` | Unicode (names, titles, emails) |
| Long text | `nvarchar(MAX)` | Biography, descriptions, messages |
| Money | `decimal(18,2)` | Artwork price |
| Status enums | `int` | `ArtworkStatus`, `InquiryStatus` |
| Year | `int` | `YearCreated` |
| Timestamps | `datetime2` | Prefer UTC (`SYSUTCDATETIME()`) |
| Flags (Identity) | `bit` | EmailConfirmed, LockoutEnabled, etc. |

**Do not use** `varchar` for user-facing text (prefer `nvarchar` for Unicode).  
**Do not use** `float`/`real` for money.  
**Prefer** `datetime2` over `datetime`.

---

## Unicode / UTF-8 support

- Use `nvarchar` for all textual business columns.
- Application and connection collation should support multilingual artist names and titles.
- Azure SQL / SQL Server can use UTF-8 collations if chosen at database creation; `nvarchar` remains the safe academic default.

---

## Date and time storage

| Rule | Recommendation |
| --- | --- |
| Kind | Store UTC in `CreatedAt` / `UpdatedAt` |
| Default | `SYSUTCDATETIME()` or `GETUTCDATE()` |
| Exhibition dates | `StartDate` / `EndDate` as `datetime2`; validate `EndDate >= StartDate` |
| Date of birth | `datetime2` (or `date` if time is never needed) |

Convert to local time only in the UI layer when required.

---

## Decimal precision

```sql
Price decimal(18, 2) NULL
```

- `18` total digits, `2` after the decimal point.
- Suitable for gallery prices in major currencies (including INR display on the frontend).

---

## Recommended constraints

### Primary keys

Every table must have a primary key (`uniqueidentifier`).

### Foreign keys

| Child | Column | Parent | On Delete |
| --- | --- | --- | --- |
| Artworks | ArtistId | Artists | RESTRICT / NO ACTION |
| Artworks | CategoryId | Categories | RESTRICT / NO ACTION |
| ExhibitionArtworks | ExhibitionId | Exhibitions | CASCADE |
| ExhibitionArtworks | ArtworkId | Artworks | RESTRICT / NO ACTION |

### Unique constraints

| Table | Columns |
| --- | --- |
| Categories | Name |
| ExhibitionArtworks | (ExhibitionId, ArtworkId) |
| AspNetUsers | NormalizedEmail / NormalizedUserName (Identity) |

### Check constraints (recommended)

```sql
-- Artworks.Status must be a valid ArtworkStatus
ALTER TABLE dbo.Artworks
ADD CONSTRAINT CK_Artworks_Status CHECK ([Status] IN (0, 1, 2, 3));

-- Inquiries.Status must be a valid InquiryStatus
ALTER TABLE dbo.Inquiries
ADD CONSTRAINT CK_Inquiries_Status CHECK ([Status] IN (0, 1, 2, 3));

-- Non-negative price when provided
ALTER TABLE dbo.Artworks
ADD CONSTRAINT CK_Artworks_Price CHECK ([Price] IS NULL OR [Price] >= 0);

-- Exhibition date range
ALTER TABLE dbo.Exhibitions
ADD CONSTRAINT CK_Exhibitions_DateRange CHECK ([EndDate] >= [StartDate]);
```

---

## Recommended indexes

| Table | Index | Columns | Purpose |
| --- | --- | --- | --- |
| Artworks | IX_Artworks_ArtistId | ArtistId | Artworks by artist |
| Artworks | IX_Artworks_CategoryId | CategoryId | Filter by category |
| Artworks | IX_Artworks_Status | Status | Availability filters |
| ExhibitionArtworks | UQ_ExhibitionArtworks_ExhibitionId_ArtworkId | ExhibitionId, ArtworkId | Uniqueness + lookup |
| ExhibitionArtworks | IX_ExhibitionArtworks_ArtworkId | ArtworkId | Exhibitions for an artwork |
| Exhibitions | IX_Exhibitions_StartDate_EndDate | StartDate, EndDate | Schedule queries |
| Inquiries | IX_Inquiries_Status | Status | Admin inbox |
| Inquiries | IX_Inquiries_CreatedAt | CreatedAt | Newest first |
| Artists | IX_Artists_FullName | FullName | Admin search |
| Categories | UQ_Categories_Name | Name | Unique category names |

Primary keys already provide clustered indexes by default in SQL Server.

---

## Foreign key delete behaviors (summary)

| Scenario | Behavior | Why |
| --- | --- | --- |
| Delete Artist with artworks | Block | Protect artwork integrity |
| Delete Category with artworks | Block | Force reclassification first |
| Delete Exhibition | Cascade junction rows | Membership rows are dependent |
| Delete Artwork still in exhibitions | Block | Clear exhibition links first |
| Delete Identity user | Identity defaults (often Cascade on Identity child tables) | Managed by ASP.NET Identity schema |

---

## Authentication tables

Do **not** create a custom password table.

Use the existing database-first script:

`canvas-connect-solution/database/scripts/001_CreateAuthTables.sql`

It creates `AspNetUsers`, `AspNetRoles`, `AspNetUserRoles`, and supporting Identity tables. Academic ER diagrams should show these Identity tables (or a short note) rather than inventing a `Role` column on the users table.

---

## Script organisation (recommended)

```
database/scripts/
  001_CreateAuthTables.sql          -- implemented
  002_CreateArtistsCategories.sql   -- planned
  003_CreateArtworks.sql            -- planned
  004_CreateExhibitions.sql         -- planned
  005_CreateInquiries.sql           -- planned
```

Keep scripts idempotent where practical (`IF OBJECT_ID ... IS NULL`) to match the auth script style.

---

## Example column patterns

```sql
ArtistId UNIQUEIDENTIFIER NOT NULL
    CONSTRAINT PK_Artists PRIMARY KEY
    CONSTRAINT DF_Artists_ArtistId DEFAULT (NEWID()),

CreatedAt DATETIME2(3) NOT NULL
    CONSTRAINT DF_Artists_CreatedAt DEFAULT (SYSUTCDATETIME()),

UpdatedAt DATETIME2(3) NULL,

Price DECIMAL(18, 2) NULL,

Status INT NOT NULL
    CONSTRAINT DF_Artworks_Status DEFAULT (0)
```

---

## Consistency checklist

- Same key names as UML and Data Dictionary (`ArtistId`, not `Artist_ID`).
- `nvarchar` for text; `datetime2` for timestamps; `decimal(18,2)` for price.
- Enums stored as `int` with documented meanings.
- Image columns store URLs only.
- No unnecessary commerce or messaging tables.
