# Database Design Decisions — Art Gallery Management System

Academic design decisions for the MCA Final Year project.

---

## Why GUID primary keys

- Matches implemented Identity (`IdentityUser<Guid>` / `AspNetUsers.Id`)
- Suitable for SQL Server and later Azure SQL
- Avoids guessable sequential IDs in URLs

Trade-off: slightly larger keys than `int`; acceptable for this project size.

---

## Why ExhibitionArtwork exists

Exhibition and Artwork are many-to-many. `ExhibitionArtworks` stores each pair with:

- Surrogate PK `ExhibitionArtworkId`
- FKs `ExhibitionId`, `ArtworkId`
- Unique (`ExhibitionId`, `ArtworkId`)

Easy to explain in viva and map with EF Core.

---

## Why Artist and ApplicationUser are separate

| Concept | Meaning |
| --- | --- |
| ApplicationUser | Login account (Identity) |
| Artist role | Authorization role on a login account |
| Artist entity | Gallery profile for artworks |

An artist catalogue entry does not require a login. No required FK between them.

---

## Why roles are not a string column on AspNetUsers

ASP.NET Core Identity stores roles in `AspNetRoles` and `AspNetUserRoles`.  
Do not invent a `Role nvarchar` column on the users table — it conflicts with the real implementation.

---

## Why enums are used

`ArtworkStatus` and `InquiryStatus` are stored as `int` for controlled values and simple filtering.

---

## Why image URLs are stored

Database stores `ImageUrl` / `ProfileImageUrl` only.  
Files: local during development; Azure Blob Storage later for production.

---

## Why Inquiry has no UserId

Visitors may contact the gallery without signing in.

---

## Why Azure is optional in design docs

Azure App Service / Azure SQL / Blob Storage are for deployment and future hosting.  
The student project focuses on a working web application and SQL Server design first.

---

## Out of current database scope (Future Scope)

Orders, payments, cart, wishlist, reviews, AI recommendations, messaging — documented as future enhancements only, not in the current ER diagram.
