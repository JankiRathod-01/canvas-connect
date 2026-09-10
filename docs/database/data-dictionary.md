# Data Dictionary — Art Gallery Management System

**Database:** Microsoft SQL Server (`canvas-connect-dev`)  
**Project:** MCA Final Year — Art Gallery Management System  
**Naming:** PascalCase (`ArtistId`, `ArtworkId`, …)

CSV: [`data-dictionary.csv`](./data-dictionary.csv)

---

## Authentication note (ASP.NET Core Identity)

Login accounts are stored by **ASP.NET Core Identity**, not a custom password table.

| Item | Detail |
| --- | --- |
| Application class | `ApplicationUser : IdentityUser<Guid>` |
| Primary table | `dbo.AspNetUsers` |
| Roles | `dbo.AspNetRoles` + `dbo.AspNetUserRoles` |
| Roles used | Admin, Artist, Visitor |
| Script | `canvas-connect-solution/database/scripts/001_CreateAuthTables.sql` |

Supporting Identity tables (`AspNetUserClaims`, `AspNetUserLogins`, `AspNetUserTokens`, `AspNetRoleClaims`) exist for Identity compatibility and are omitted from the academic field lists below except where noted.

---

## 1. AspNetUsers (ApplicationUser)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Id | uniqueidentifier | - | No | PK | NEWID() | User primary key (Identity) |
| Name | nvarchar | 80 | No | - | - | Display name (custom app field) |
| UserName | nvarchar | 256 | Yes | - | - | Identity user name |
| NormalizedUserName | nvarchar | 256 | Yes | UQ | - | Normalized user name |
| Email | nvarchar | 256 | Yes | - | - | Email address |
| NormalizedEmail | nvarchar | 256 | Yes | UQ | - | Normalized email (unique when present) |
| EmailConfirmed | bit | - | No | - | 0 | Email confirmation flag |
| PasswordHash | nvarchar | MAX | Yes | - | - | Identity password hash (not plain text) |
| SecurityStamp | nvarchar | MAX | Yes | - | - | Identity security stamp |
| ConcurrencyStamp | nvarchar | MAX | Yes | - | - | Concurrency token |
| PhoneNumber | nvarchar | MAX | Yes | - | - | Optional phone |
| PhoneNumberConfirmed | bit | - | No | - | 0 | Phone confirmation flag |
| TwoFactorEnabled | bit | - | No | - | 0 | 2FA flag |
| LockoutEnd | datetimeoffset | - | Yes | - | - | Lockout end time |
| LockoutEnabled | bit | - | No | - | 1 | Lockout enabled |
| AccessFailedCount | int | - | No | - | 0 | Failed login count |
| CreatedAt | datetime2 | 3 | No | - | SYSUTCDATETIME() | Custom: account created (UTC) |
| UpdatedAt | datetime2 | 3 | Yes | - | - | Custom: last update (UTC) |

**There is no `Role` column.** Roles are assigned through `AspNetUserRoles`.

---

## 2. AspNetRoles

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Id | uniqueidentifier | - | No | PK | NEWID() | Role id |
| Name | nvarchar | 256 | Yes | - | - | Role name (Admin, Artist, Visitor) |
| NormalizedName | nvarchar | 256 | Yes | UQ | - | Normalized role name |
| ConcurrencyStamp | nvarchar | MAX | Yes | - | - | Concurrency token |

---

## 3. AspNetUserRoles

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| UserId | uniqueidentifier | - | No | PK, FK | - | → AspNetUsers.Id |
| RoleId | uniqueidentifier | - | No | PK, FK | - | → AspNetRoles.Id |

---

## 4. Artists (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| ArtistId | uniqueidentifier | - | No | PK | NEWID() | Unique artist id |
| FullName | nvarchar | 150 | No | - | - | Artist full name |
| Biography | nvarchar | MAX | Yes | - | - | Biography |
| Country | nvarchar | 100 | Yes | - | - | Country |
| DateOfBirth | datetime2 | - | Yes | - | - | Date of birth |
| ProfileImageUrl | nvarchar | 500 | Yes | - | - | Profile image URL/path |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Created (UTC) |
| UpdatedAt | datetime2 | - | Yes | - | - | Updated (UTC) |

Indexes: PK(ArtistId); IX(FullName)

---

## 5. Categories (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| CategoryId | uniqueidentifier | - | No | PK | NEWID() | Unique category id |
| Name | nvarchar | 100 | No | UQ | - | Category name |
| Description | nvarchar | 500 | Yes | - | - | Description |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Created (UTC) |

---

## 6. Artworks (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| ArtworkId | uniqueidentifier | - | No | PK | NEWID() | Unique artwork id |
| Title | nvarchar | 200 | No | - | - | Title |
| Description | nvarchar | MAX | Yes | - | - | Description |
| ArtistId | uniqueidentifier | - | No | FK | - | → Artists.ArtistId |
| CategoryId | uniqueidentifier | - | No | FK | - | → Categories.CategoryId |
| Price | decimal | 18,2 | Yes | - | - | Price |
| YearCreated | int | - | Yes | - | - | Year created |
| ImageUrl | nvarchar | 500 | Yes | - | - | Image URL/path |
| Status | int | - | No | - | 0 | ArtworkStatus enum |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Created (UTC) |
| UpdatedAt | datetime2 | - | Yes | - | - | Updated (UTC) |

Indexes: IX(ArtistId), IX(CategoryId), IX(Status)  
Checks (recommended): Status IN (0,1,2,3); Price IS NULL OR Price >= 0

---

## 7. Exhibitions (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| ExhibitionId | uniqueidentifier | - | No | PK | NEWID() | Unique exhibition id |
| Name | nvarchar | 200 | No | - | - | Exhibition name |
| Description | nvarchar | MAX | Yes | - | - | Description |
| Venue | nvarchar | 200 | Yes | - | - | Venue |
| StartDate | datetime2 | - | No | - | - | Start date |
| EndDate | datetime2 | - | No | - | - | End date |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Created (UTC) |
| UpdatedAt | datetime2 | - | Yes | - | - | Updated (UTC) |

Check (recommended): EndDate >= StartDate

---

## 8. ExhibitionArtworks (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| ExhibitionArtworkId | uniqueidentifier | - | No | PK | NEWID() | Junction row id |
| ExhibitionId | uniqueidentifier | - | No | FK | - | → Exhibitions.ExhibitionId |
| ArtworkId | uniqueidentifier | - | No | FK | - | → Artworks.ArtworkId |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Link created (UTC) |

Unique: (ExhibitionId, ArtworkId)

---

## 9. Inquiries (planned)

| Field Name | Data Type | Size | Null Allowed | Key | Default | Description |
| --- | --- | --- | --- | --- | --- | --- |
| InquiryId | uniqueidentifier | - | No | PK | NEWID() | Unique inquiry id |
| Name | nvarchar | 150 | No | - | - | Visitor name |
| Email | nvarchar | 256 | No | - | - | Visitor email |
| Phone | nvarchar | 30 | Yes | - | - | Optional phone |
| Subject | nvarchar | 200 | No | - | - | Subject |
| Message | nvarchar | MAX | No | - | - | Message |
| Status | int | - | No | - | 0 | InquiryStatus enum |
| CreatedAt | datetime2 | - | No | - | SYSUTCDATETIME() | Submitted (UTC) |

No FK to AspNetUsers (anonymous inquiries allowed).

---

## Enum data dictionary

### ArtworkStatus

| Value | Integer | Description |
| --- | --- | --- |
| Available | 0 | Available |
| Sold | 1 | Sold |
| Displayed | 2 | Currently displayed |
| Archived | 3 | Archived |

### InquiryStatus

| Value | Integer | Description |
| --- | --- | --- |
| New | 0 | Newly submitted |
| Read | 1 | Reviewed |
| Responded | 2 | Gallery responded |
| Closed | 3 | Closed |

---

## Foreign key summary

| Child | Column | Parent | Parent column |
| --- | --- | --- | --- |
| AspNetUserRoles | UserId | AspNetUsers | Id |
| AspNetUserRoles | RoleId | AspNetRoles | Id |
| Artworks | ArtistId | Artists | ArtistId |
| Artworks | CategoryId | Categories | CategoryId |
| ExhibitionArtworks | ExhibitionId | Exhibitions | ExhibitionId |
| ExhibitionArtworks | ArtworkId | Artworks | ArtworkId |

---

## Corrections applied (review)

1. Replaced fake `ApplicationUsers.Role` / `UserId` academic shortcuts with real Identity columns (`Id`, role join tables).
2. Documented `AspNetRoles` and `AspNetUserRoles`.
3. Kept planned business tables fully documented for project blueprint completeness.
