# Database Relationships — Art Gallery Management System

---

## 1. Artist → Artwork

**Type:** One-to-Many  
**FK:** `Artworks.ArtistId` → `Artists.ArtistId`  
**Cardinality:** 1 → 0..\*  
**On Delete:** Restrict  

One artist can have many artworks. Each artwork belongs to one artist.

---

## 2. Category → Artwork

**Type:** One-to-Many  
**FK:** `Artworks.CategoryId` → `Categories.CategoryId`  
**Cardinality:** 1 → 0..\*  
**On Delete:** Restrict  

One category can contain many artworks. Each artwork belongs to one category.

---

## 3. Exhibition → ExhibitionArtwork

**Type:** One-to-Many  
**FK:** `ExhibitionArtworks.ExhibitionId` → `Exhibitions.ExhibitionId`  
**Cardinality:** 1 → 0..\*  
**On Delete:** Cascade (recommended)  

Deleting an exhibition removes its membership rows.

---

## 4. Artwork → ExhibitionArtwork

**Type:** One-to-Many  
**FK:** `ExhibitionArtworks.ArtworkId` → `Artworks.ArtworkId`  
**Cardinality:** 1 → 0..\*  
**On Delete:** Restrict  

Prevents deleting an artwork that is still listed in exhibitions.

---

## 5. Exhibition ↔ Artwork (derived)

**Type:** Many-to-Many (via `ExhibitionArtworks`)  
**Unique:** (`ExhibitionId`, `ArtworkId`)

---

## 6. AspNetUsers ↔ AspNetRoles (Identity)

**Type:** Many-to-Many  
**Junction:** `AspNetUserRoles`  
**FKs:** `UserId` → `AspNetUsers.Id`, `RoleId` → `AspNetRoles.Id`  
**On Delete:** Cascade (Identity default in project SQL script)

Used for Admin / Artist / Visitor authorization. Not a string column on the user table.

---

## Not modelled (by design)

| Pair | Reason |
| --- | --- |
| ApplicationUser → Artist | Artist profile is separate from login account |
| ApplicationUser → Inquiry | Anonymous inquiries allowed |

---

## Summary

| # | Parent | Child | Type | On Delete |
| --- | --- | --- | --- | --- |
| 1 | Artists | Artworks | 1:M | Restrict |
| 2 | Categories | Artworks | 1:M | Restrict |
| 3 | Exhibitions | ExhibitionArtworks | 1:M | Cascade |
| 4 | Artworks | ExhibitionArtworks | 1:M | Restrict |
| 5 | AspNetUsers / AspNetRoles | AspNetUserRoles | M:N | Cascade |
