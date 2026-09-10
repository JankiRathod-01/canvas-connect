/**
 * Classroom PPT: Art Gallery Management System
 * UML + ER + Data Dictionary (+ screenshot placeholders)
 */
const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Art Gallery Management System";
pptx.title = "Art Gallery Management System — Database & UML Design";

const COLORS = {
  bg: "F7F4EF",
  ink: "1C1917",
  muted: "57534E",
  accent: "0F766E",
  accentSoft: "CCFBF1",
  card: "FFFFFF",
  border: "D6D3D1",
  warn: "B45309",
  tableHeader: "134E4A",
  white: "FFFFFF",
  soft: "ECFDF5",
};

function addBg(slide) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: COLORS.bg },
    line: { color: COLORS.bg },
  });
}

function addFooter(slide, page, total) {
  slide.addText("Art Gallery Management System  |  MCA Final Year Project", {
    x: 0.5,
    y: 7.1,
    w: 10,
    h: 0.25,
    fontSize: 11,
    color: COLORS.muted,
    fontFace: "Calibri",
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.5,
    y: 7.1,
    w: 1.3,
    h: 0.25,
    fontSize: 11,
    color: COLORS.muted,
    align: "right",
    fontFace: "Calibri",
  });
}

function sectionBar(slide, title) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.9,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
  });
  slide.addText(title, {
    x: 0.5,
    y: 0.22,
    w: 12,
    h: 0.5,
    fontSize: 26,
    bold: true,
    color: COLORS.white,
    fontFace: "Calibri",
  });
}

function card(slide, x, y, w, h) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: COLORS.card },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.08,
  });
}

const TOTAL = 16;

// ---------- 1 Title ----------
{
  const s = pptx.addSlide();
  addBg(s);
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.35,
    h: 7.5,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
  });
  s.addText("MCA FINAL YEAR PROJECT", {
    x: 0.9,
    y: 1.6,
    w: 11,
    h: 0.4,
    fontSize: 14,
    color: COLORS.accent,
    bold: true,
    fontFace: "Calibri",
  });
  s.addText("Art Gallery Management System", {
    x: 0.9,
    y: 2.1,
    w: 11.5,
    h: 0.8,
    fontSize: 40,
    bold: true,
    color: COLORS.ink,
    fontFace: "Calibri",
  });
  s.addText("UML Class Diagram  ·  ER Diagram  ·  Data Dictionary", {
    x: 0.9,
    y: 3.0,
    w: 11,
    h: 0.4,
    fontSize: 20,
    color: COLORS.muted,
    fontFace: "Calibri",
  });
  s.addText(
    "Classroom Presentation  |  Database Design & Domain Model",
    {
      x: 0.9,
      y: 5.8,
      w: 11,
      h: 0.35,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Calibri",
    }
  );
  addFooter(s, 1, TOTAL);
}

// ---------- 2 Agenda ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Agenda");
  addFooter(s, 2, TOTAL);
  const items = [
    "1. Project overview and technology stack",
    "2. System modules",
    "3. UML Class Diagram (domain model)",
    "4. Entity Relationship (ER) Diagram",
    "5. Data Dictionary (key tables)",
    "6. Important design decisions",
    "7. Frontend screenshots (to be added)",
  ];
  items.forEach((t, i) => {
    card(s, 0.7, 1.3 + i * 0.7, 11.9, 0.58);
    s.addText(t, {
      x: 1.0,
      y: 1.4 + i * 0.7,
      w: 11.3,
      h: 0.4,
      fontSize: 20,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

// ---------- 3 Overview ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Project Overview");
  addFooter(s, 3, TOTAL);

  const boxes = [
    {
      title: "Frontend",
      lines: "React.js + TypeScript\nVite + Tailwind CSS\nJWT Auth UI",
    },
    {
      title: "Backend",
      lines: "ASP.NET Core Web API\nEF Core + Identity\nJWT Authentication",
    },
    {
      title: "Database",
      lines: "Microsoft SQL Server\nAzure SQL (planned)\nDatabase-first scripts",
    },
  ];
  boxes.forEach((b, i) => {
    const x = 0.7 + i * 4.1;
    card(s, x, 1.4, 3.8, 3.2);
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: 1.4,
      w: 3.8,
      h: 0.7,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    s.addText(b.title, {
      x: x + 0.2,
      y: 1.55,
      w: 3.4,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: COLORS.white,
      fontFace: "Calibri",
    });
    s.addText(b.lines, {
      x: x + 0.25,
      y: 2.4,
      w: 3.3,
      h: 1.8,
      fontSize: 16,
      color: COLORS.ink,
      fontFace: "Calibri",
      valign: "top",
    });
  });
  s.addText(
    "Goal: Manage artists, artworks, categories, exhibitions, and visitor inquiries with role-based access.",
    {
      x: 0.7,
      y: 5.0,
      w: 12,
      h: 0.8,
      fontSize: 16,
      color: COLORS.muted,
      fontFace: "Calibri",
    }
  );
}

// ---------- 4 Modules ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "System Modules");
  addFooter(s, 4, TOTAL);
  const mods = [
    ["Authentication", "Register, Login, Logout\nRoles: Admin, Artist, Visitor"],
    ["Artist Management", "CRUD artist profiles\nOne artist → many artworks"],
    ["Category Management", "Painting, Sculpture, etc.\nOne category → many artworks"],
    ["Artwork Management", "Title, price, image, status\nLinked to artist & category"],
    ["Exhibition Management", "Shows with date & venue\nMany-to-many with artworks"],
    ["Visitor Inquiries", "Contact form submissions\nAnonymous visitors allowed"],
  ];
  mods.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.55 + col * 4.2;
    const y = 1.25 + row * 2.7;
    card(s, x, y, 3.95, 2.4);
    s.addText(m[0], {
      x: x + 0.2,
      y: y + 0.25,
      w: 3.5,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: COLORS.accent,
      fontFace: "Calibri",
    });
    s.addText(m[1], {
      x: x + 0.2,
      y: y + 0.9,
      w: 3.5,
      h: 1.2,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

// ---------- 5 UML intro ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "UML Class Diagram — Purpose");
  addFooter(s, 5, TOTAL);
  card(s, 0.6, 1.3, 12.1, 5.2);
  const points = [
    "Shows the backend / domain model (not React components).",
    "Classes: ApplicationUser, Artist, Category, Artwork, Exhibition, ExhibitionArtwork, Inquiry.",
    "Includes attributes, C# data types, and navigation properties.",
    "Enums: ArtworkStatus and InquiryStatus for controlled values.",
    "Artist is separate from ApplicationUser (login account ≠ gallery profile).",
  ];
  points.forEach((p, i) => {
    s.addShape(pptx.shapes.OVAL, {
      x: 1.0,
      y: 1.7 + i * 0.85,
      w: 0.28,
      h: 0.28,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    s.addText(p, {
      x: 1.5,
      y: 1.65 + i * 0.85,
      w: 10.5,
      h: 0.5,
      fontSize: 18,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

// ---------- 6 UML visual ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "UML Class Diagram — Core Classes");
  addFooter(s, 6, TOTAL);

  function umlBox(x, y, w, h, title, body) {
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y,
      w,
      h,
      fill: { color: COLORS.card },
      line: { color: COLORS.accent, width: 1.5 },
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y,
      w,
      h: 0.38,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    s.addText(title, {
      x: x + 0.05,
      y: y + 0.05,
      w: w - 0.1,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Calibri",
    });
    s.addText(body, {
      x: x + 0.08,
      y: y + 0.45,
      w: w - 0.16,
      h: h - 0.55,
      fontSize: 10,
      color: COLORS.ink,
      fontFace: "Consolas",
      valign: "top",
    });
  }

  umlBox(
    0.35,
    1.15,
    2.5,
    2.35,
    "ApplicationUser",
    "+ UserId : Guid\n+ Name : string\n+ Email : string\n+ Role : string\n+ CreatedAt : DateTime\n+ UpdatedAt : DateTime?"
  );
  umlBox(
    3.1,
    1.15,
    2.5,
    2.55,
    "Artist",
    "+ ArtistId : Guid\n+ FullName : string\n+ Biography : string?\n+ Country : string?\n+ DateOfBirth : DateTime?\n+ ProfileImageUrl : string?\n+ Artworks : ICollection<>"
  );
  umlBox(
    5.85,
    1.15,
    2.5,
    2.2,
    "Category",
    "+ CategoryId : Guid\n+ Name : string\n+ Description : string?\n+ CreatedAt : DateTime\n+ Artworks : ICollection<>"
  );
  umlBox(
    8.6,
    1.15,
    2.55,
    2.7,
    "Artwork",
    "+ ArtworkId : Guid\n+ Title : string\n+ ArtistId : Guid\n+ CategoryId : Guid\n+ Price : decimal?\n+ Status : ArtworkStatus\n+ ImageUrl : string?"
  );
  umlBox(
    11.35,
    1.15,
    1.75,
    2.0,
    "Enums",
    "ArtworkStatus\nInquiryStatus"
  );

  umlBox(
    1.5,
    4.2,
    3.0,
    2.35,
    "Exhibition",
    "+ ExhibitionId : Guid\n+ Name : string\n+ Venue : string?\n+ StartDate : DateTime\n+ EndDate : DateTime\n+ ExhibitionArtworks"
  );
  umlBox(
    5.0,
    4.2,
    3.4,
    2.35,
    "ExhibitionArtwork",
    "+ ExhibitionArtworkId : Guid\n+ ExhibitionId : Guid (FK)\n+ ArtworkId : Guid (FK)\n+ CreatedAt : DateTime\nUQ(ExhibitionId, ArtworkId)"
  );
  umlBox(
    8.9,
    4.2,
    3.5,
    2.35,
    "Inquiry",
    "+ InquiryId : Guid\n+ Name, Email, Phone?\n+ Subject, Message\n+ Status : InquiryStatus\n+ CreatedAt : DateTime\n(No User FK)"
  );
}

// ---------- 7 UML relationships ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "UML Relationships & Multiplicity");
  addFooter(s, 7, TOTAL);

  const rows = [
    ["Relationship", "Multiplicity", "Meaning"],
    ["Artist → Artwork", "1  →  0..*", "One artist creates many artworks"],
    ["Category → Artwork", "1  →  0..*", "One category groups many artworks"],
    ["Exhibition → ExhibitionArtwork", "1  →  0..*", "Exhibition lists many links"],
    ["Artwork → ExhibitionArtwork", "1  →  0..*", "Artwork can join many shows"],
    ["Exhibition ↔ Artwork", "0..* ↔ 0..*", "Many-to-many via junction"],
  ];

  s.addTable(
    rows.map((r, idx) =>
      r.map((cell) => ({
        text: cell,
        options: {
          bold: idx === 0,
          color: idx === 0 ? COLORS.white : COLORS.ink,
          fill: {
            color: idx === 0 ? COLORS.tableHeader : idx % 2 === 0 ? COLORS.soft : COLORS.card,
          },
        },
      }))
    ),
    {
      x: 0.6,
      y: 1.4,
      w: 12.1,
      colW: [4.2, 2.4, 5.5],
      border: [
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
      ],
      fontFace: "Calibri",
      fontSize: 15,
      align: "left",
      valign: "middle",
      rowH: 0.7,
    }
  );

  s.addText(
    "Note: ApplicationUser has no required association to Artist or Inquiry.",
    {
      x: 0.7,
      y: 6.3,
      w: 12,
      h: 0.35,
      fontSize: 14,
      color: COLORS.warn,
      fontFace: "Calibri",
    }
  );
}

// ---------- 8 ER intro ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "ER Diagram — Purpose");
  addFooter(s, 8, TOTAL);
  card(s, 0.6, 1.3, 12.1, 5.2);
  const points = [
    "Database-focused view of SQL Server tables, PKs, and FKs.",
    "Core tables: Artists, Categories, Artworks, Exhibitions, ExhibitionArtworks, Inquiries.",
    "ApplicationUsers = simplified academic view of ASP.NET Identity (AspNetUsers).",
    "ExhibitionArtworks resolves Exhibition ↔ Artwork many-to-many.",
    "Passwords are NOT stored in a custom table — Identity manages authentication data.",
  ];
  points.forEach((p, i) => {
    s.addShape(pptx.shapes.OVAL, {
      x: 1.0,
      y: 1.7 + i * 0.85,
      w: 0.28,
      h: 0.28,
      fill: { color: COLORS.accent },
      line: { color: COLORS.accent },
    });
    s.addText(p, {
      x: 1.5,
      y: 1.65 + i * 0.85,
      w: 10.5,
      h: 0.5,
      fontSize: 17,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

// ---------- 9 ER visual ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "ER Diagram — Tables & Relationships");
  addFooter(s, 9, TOTAL);

  function erBox(x, y, w, h, title, lines) {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w,
      h,
      fill: { color: COLORS.card },
      line: { color: COLORS.accent, width: 1.25 },
      rectRadius: 0.06,
    });
    s.addText(title, {
      x: x + 0.08,
      y: y + 0.08,
      w: w - 0.16,
      h: 0.32,
      fontSize: 13,
      bold: true,
      color: COLORS.accent,
      align: "center",
      fontFace: "Calibri",
    });
    s.addText(lines, {
      x: x + 0.1,
      y: y + 0.42,
      w: w - 0.2,
      h: h - 0.5,
      fontSize: 10,
      color: COLORS.ink,
      fontFace: "Consolas",
      valign: "top",
    });
  }

  erBox(0.4, 1.2, 2.4, 2.0, "Artists", "PK ArtistId\nFullName\nBiography\nCountry\n...");
  erBox(0.4, 4.0, 2.4, 1.8, "Categories", "PK CategoryId\nName (UQ)\nDescription\nCreatedAt");
  erBox(4.0, 2.4, 2.8, 2.6, "Artworks", "PK ArtworkId\nFK ArtistId\nFK CategoryId\nTitle, Price\nStatus, ImageUrl");
  erBox(8.0, 1.2, 2.5, 2.0, "Exhibitions", "PK ExhibitionId\nName, Venue\nStartDate\nEndDate");
  erBox(8.0, 4.0, 2.6, 2.0, "ExhibitionArtworks", "PK ExhibitionArtworkId\nFK ExhibitionId\nFK ArtworkId\nUQ(ExhId, ArtId)");
  erBox(11.0, 2.5, 2.0, 2.2, "Inquiries", "PK InquiryId\nName, Email\nSubject\nStatus");

  // Relationship labels
  s.addText("1", { x: 2.85, y: 2.0, w: 0.4, h: 0.3, fontSize: 14, bold: true, color: COLORS.accent, fontFace: "Calibri" });
  s.addText("──── *", { x: 3.1, y: 2.0, w: 1.0, h: 0.3, fontSize: 12, color: COLORS.ink, fontFace: "Calibri" });
  s.addText("1", { x: 2.85, y: 4.5, w: 0.4, h: 0.3, fontSize: 14, bold: true, color: COLORS.accent, fontFace: "Calibri" });
  s.addText("──── *", { x: 3.1, y: 4.5, w: 1.0, h: 0.3, fontSize: 12, color: COLORS.ink, fontFace: "Calibri" });
  s.addText("* ──── 1", { x: 6.85, y: 2.0, w: 1.2, h: 0.3, fontSize: 12, color: COLORS.ink, fontFace: "Calibri" });
  s.addText("* ──── 1", { x: 6.85, y: 4.6, w: 1.2, h: 0.3, fontSize: 12, color: COLORS.ink, fontFace: "Calibri" });

  s.addText("ApplicationUsers (Identity) is independent — used for login/roles only.", {
    x: 0.5,
    y: 6.35,
    w: 12,
    h: 0.3,
    fontSize: 13,
    color: COLORS.muted,
    fontFace: "Calibri",
  });
}

// ---------- 10 ER cardinality ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "ER Cardinality Summary");
  addFooter(s, 10, TOTAL);

  const rows = [
    ["Parent", "Child", "Type", "Foreign Key", "On Delete"],
    ["Artists", "Artworks", "1 : Many", "Artworks.ArtistId", "Restrict"],
    ["Categories", "Artworks", "1 : Many", "Artworks.CategoryId", "Restrict"],
    ["Exhibitions", "ExhibitionArtworks", "1 : Many", "ExhibitionArtworks.ExhibitionId", "Cascade"],
    ["Artworks", "ExhibitionArtworks", "1 : Many", "ExhibitionArtworks.ArtworkId", "Restrict"],
  ];

  s.addTable(
    rows.map((r, idx) =>
      r.map((cell) => ({
        text: cell,
        options: {
          bold: idx === 0,
          color: idx === 0 ? COLORS.white : COLORS.ink,
          fill: { color: idx === 0 ? COLORS.tableHeader : idx % 2 === 0 ? COLORS.soft : COLORS.card },
        },
      }))
    ),
    {
      x: 0.5,
      y: 1.5,
      w: 12.3,
      colW: [2.4, 3.2, 2.0, 3.2, 1.5],
      border: [
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
      ],
      fontFace: "Calibri",
      fontSize: 14,
      align: "left",
      valign: "middle",
      rowH: 0.7,
    }
  );

  s.addText(
    "Many-to-Many: Exhibition ↔ Artwork is implemented through ExhibitionArtworks.",
    {
      x: 0.6,
      y: 5.5,
      w: 12,
      h: 0.4,
      fontSize: 16,
      color: COLORS.accent,
      bold: true,
      fontFace: "Calibri",
    }
  );
}

// ---------- 11 Data dictionary intro ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Data Dictionary — Overview");
  addFooter(s, 11, TOTAL);

  const tables = [
    "ApplicationUsers",
    "Artists",
    "Categories",
    "Artworks",
    "Exhibitions",
    "ExhibitionArtworks",
    "Inquiries",
  ];
  tables.forEach((t, i) => {
    const x = 0.55 + (i % 4) * 3.15;
    const y = 1.5 + Math.floor(i / 4) * 2.0;
    card(s, x, y, 2.95, 1.6);
    s.addText(t, {
      x: x + 0.15,
      y: y + 0.55,
      w: 2.65,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: COLORS.accent,
      align: "center",
      fontFace: "Calibri",
    });
  });
  s.addText(
    "Full field-level dictionary: docs/database/data-dictionary.md (+ CSV)",
    {
      x: 0.6,
      y: 6.2,
      w: 12,
      h: 0.35,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Calibri",
    }
  );
}

// ---------- 12 DD Artworks ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Data Dictionary — Artworks (example)");
  addFooter(s, 12, TOTAL);

  const rows = [
    ["Field", "Type", "Null", "Key", "Description"],
    ["ArtworkId", "uniqueidentifier", "No", "PK", "Unique artwork id"],
    ["Title", "nvarchar(200)", "No", "-", "Artwork title"],
    ["ArtistId", "uniqueidentifier", "No", "FK", "→ Artists.ArtistId"],
    ["CategoryId", "uniqueidentifier", "No", "FK", "→ Categories.CategoryId"],
    ["Price", "decimal(18,2)", "Yes", "-", "Selling price"],
    ["Status", "int", "No", "-", "ArtworkStatus enum"],
    ["ImageUrl", "nvarchar(500)", "Yes", "-", "Image path / URL"],
    ["CreatedAt", "datetime2", "No", "-", "UTC created time"],
  ];

  s.addTable(
    rows.map((r, idx) =>
      r.map((cell) => ({
        text: cell,
        options: {
          bold: idx === 0,
          color: idx === 0 ? COLORS.white : COLORS.ink,
          fill: {
            color: idx === 0 ? COLORS.tableHeader : idx % 2 === 0 ? COLORS.soft : COLORS.card,
          },
          fontSize: idx === 0 ? 13 : 12,
        },
      }))
    ),
    {
      x: 0.45,
      y: 1.2,
      w: 12.4,
      colW: [2.3, 2.8, 1.2, 1.0, 5.1],
      border: [
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
        { pt: 0.5, color: COLORS.border },
      ],
      fontFace: "Calibri",
      align: "left",
      valign: "middle",
      rowH: 0.52,
    }
  );
}

// ---------- 13 Enums + other tables highlight ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Enums & Key Constraints");
  addFooter(s, 13, TOTAL);

  card(s, 0.5, 1.25, 6.0, 4.8);
  s.addText("ArtworkStatus", {
    x: 0.75,
    y: 1.45,
    w: 5.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
    fontFace: "Calibri",
  });
  s.addText(
    "0  Available\n1  Sold\n2  Displayed\n3  Archived",
    {
      x: 0.85,
      y: 2.1,
      w: 5.3,
      h: 2.2,
      fontSize: 18,
      color: COLORS.ink,
      fontFace: "Consolas",
    }
  );

  card(s, 6.8, 1.25, 6.0, 4.8);
  s.addText("InquiryStatus", {
    x: 7.05,
    y: 1.45,
    w: 5.5,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.accent,
    fontFace: "Calibri",
  });
  s.addText(
    "0  New\n1  Read\n2  Responded\n3  Closed",
    {
      x: 7.15,
      y: 2.1,
      w: 5.3,
      h: 2.2,
      fontSize: 18,
      color: COLORS.ink,
      fontFace: "Consolas",
    }
  );

  s.addText(
    "Unique: Categories.Name  ·  ExhibitionArtworks(ExhibitionId, ArtworkId)",
    {
      x: 0.7,
      y: 5.4,
      w: 11.8,
      h: 0.4,
      fontSize: 14,
      color: COLORS.muted,
      fontFace: "Calibri",
    }
  );
}

// ---------- 14 Design decisions ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Important Design Decisions");
  addFooter(s, 14, TOTAL);

  const decisions = [
    ["GUID primary keys", "uniqueidentifier / Guid — consistent with Identity & Azure"],
    ["Artist ≠ ApplicationUser", "Gallery profile vs login account (no forced FK)"],
    ["ExhibitionArtwork junction", "Resolves Exhibition ↔ Artwork many-to-many"],
    ["Enums for status", "Controlled int values (not free text)"],
    ["Image URLs only", "DB stores paths; files in local / Azure Blob later"],
    ["Identity for passwords", "No custom password table"],
  ];
  decisions.forEach((d, i) => {
    const y = 1.2 + i * 0.85;
    card(s, 0.6, y, 12.1, 0.72);
    s.addText(d[0], {
      x: 0.85,
      y: y + 0.18,
      w: 3.8,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.accent,
      fontFace: "Calibri",
    });
    s.addText(d[1], {
      x: 4.8,
      y: y + 0.18,
      w: 7.6,
      h: 0.4,
      fontSize: 15,
      color: COLORS.ink,
      fontFace: "Calibri",
    });
  });
}

// ---------- 15 Screenshot placeholders ----------
{
  const s = pptx.addSlide();
  addBg(s);
  sectionBar(s, "Frontend Screenshots — Add Your Images");
  addFooter(s, 15, TOTAL);

  const slots = [
    "Home / Landing Page",
    "Login / Signup",
    "Admin Dashboard",
    "Explore / Artworks",
    "Artist Studio",
    "Contact / Inquiry",
  ];
  slots.forEach((title, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.2;
    const y = 1.25 + row * 2.7;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 3.95,
      h: 2.4,
      fill: { color: COLORS.card },
      line: { color: COLORS.border, width: 1.5, dashType: "dash" },
      rectRadius: 0.08,
    });
    s.addText(title, {
      x: x + 0.2,
      y: y + 0.7,
      w: 3.55,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.ink,
      align: "center",
      fontFace: "Calibri",
    });
    s.addText("[ Paste screenshot here ]", {
      x: x + 0.2,
      y: y + 1.2,
      w: 3.55,
      h: 0.35,
      fontSize: 13,
      color: COLORS.muted,
      align: "center",
      fontFace: "Calibri",
    });
  });
}

// ---------- 16 Thank you ----------
{
  const s = pptx.addSlide();
  addBg(s);
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.35,
    h: 7.5,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent },
  });
  s.addText("Thank You", {
    x: 0.9,
    y: 2.3,
    w: 11,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: COLORS.ink,
    fontFace: "Calibri",
  });
  s.addText("Questions & Discussion", {
    x: 0.9,
    y: 3.2,
    w: 11,
    h: 0.5,
    fontSize: 22,
    color: COLORS.accent,
    fontFace: "Calibri",
  });
  s.addText(
    "Docs: docs/diagrams  ·  docs/database\nSource: PlantUML, Mermaid ER, Data Dictionary",
    {
      x: 0.9,
      y: 4.3,
      w: 11,
      h: 0.8,
      fontSize: 15,
      color: COLORS.muted,
      fontFace: "Calibri",
    }
  );
  addFooter(s, 16, TOTAL);
}

const out = path.join(__dirname, "Art-Gallery-UML-ER-DataDictionary.pptx");
pptx
  .writeFile({ fileName: out })
  .then(() => {
    console.log("CREATED:", out);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
