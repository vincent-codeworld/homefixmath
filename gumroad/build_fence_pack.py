#!/usr/bin/env python3
"""Build HomeFixMath Fence Project Math Pack v1 PDF + Gumroad cover."""
from pathlib import Path
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
BRAND = "HomeFixMath"
TITLE = "Fence Project Math Pack"
SUB = "Cut List & Store Checklist (US)"

class Pack(FPDF):
    def _t(self, s):
        return str(s).replace("%", "%%")

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(40, 90, 60)
        self.cell(0, 6, f"{BRAND}  |  {TITLE}", align="L")
        self.ln(8)
        self.set_draw_color(40, 90, 60)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, "Estimates only. Not engineering advice. Call 811 before digging.", align="C")
        self.ln(4)
        self.cell(0, 5, f"Page {self.page_no()}/{{nb}}  |  (c) {BRAND}", align="C")

    def h1(self, text):
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(30, 60, 40)
        self.multi_cell(0, 9, self._t(text), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def h2(self, text):
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(40, 90, 60)
        self.multi_cell(0, 7, self._t(text), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6, self._t(text), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def bullet(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6, self._t("- " + text), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def field_row(self, label, width=90):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.cell(width, 8, self._t(label), border=0)
        self.set_draw_color(180, 180, 180)
        x, y = self.get_x(), self.get_y() + 6
        self.line(x, y, 200, y)
        self.ln(10)

    def checkbox(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 7, self._t("[ ]  " + text), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

def build_pdf():
    pdf = Pack(orientation="P", unit="mm", format="Letter")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.set_margins(10, 12, 10)

    # 1 Cover
    pdf.add_page()
    pdf.ln(40)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(40, 90, 60)
    pdf.cell(0, 8, BRAND, align="C")
    pdf.ln(16)
    pdf.set_font("Helvetica", "B", 26)
    pdf.set_text_color(20, 40, 30)
    pdf.multi_cell(0, 12, TITLE, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(60, 60, 60)
    pdf.multi_cell(0, 8, SUB, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(0, 6, "US feet  -  Prefab panel fences  -  Printable letter size", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(20)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.multi_cell(0, 5, "Planning estimates only. Not engineering or code approval.\nCall 811 before you dig.", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # 2 How to use
    pdf.add_page()
    pdf.h1("How to use this pack")
    pdf.body("Pair this workbook with the free HomeFixMath fence calculator (online). Use the web tool for a quick math check, then fill these pages for the job site and store run.")
    pdf.h2("Five steps")
    for i, t in enumerate([
        "Measure the total fence run in feet (property line or posts you will replace).",
        "Note every gate: count and width of each opening.",
        "Fill the Measure worksheet, then the Cut list / order sheet.",
        "Add 5-10%% waste on panels and posts if your layout has odd corners or trim bays.",
        "Shop with the Store checklist; leave concrete bag counts blank unless you already sized holes.",
    ], 1):
        pdf.bullet(f"{i}. {t}")
    pdf.ln(4)
    pdf.h2("Free online calculator")
    pdf.body("URL (fill when live): https://homefixmath.com/calculators/fence-panels")
    pdf.body("Until the domain is live, open the site files locally or use your staging URL.")

    # 3 Measure worksheet
    pdf.add_page()
    pdf.h1("Measure worksheet")
    pdf.body("Fill before you buy. Units: feet.")
    for label in [
        "Total fence run length (ft):",
        "Panel width (circle one):  4 ft   /   6 ft   /   8 ft",
        "Number of gates:",
        "Width of each gate (ft) - list if different:",
        "Extra posts (corners / grade changes):",
        "Fence height / style notes:",
        "Date measured / measured by:",
    ]:
        pdf.field_row(label, width=85)
    pdf.ln(2)
    pdf.checkbox("Called 811 / utility locate scheduled or completed")
    pdf.checkbox("Checked property line / HOA / permit needs")
    pdf.ln(4)
    pdf.h2("Math used (same as free calculator)")
    pdf.body("1) Net panel length = total run - sum of gate widths")
    pdf.body("2) Panels = ceil(net / panel width)  (always round up)")
    pdf.body("3) Posts = panels + 1 + (2 x gates) + extra posts")
    pdf.body("4) Caps = posts (if using caps)")
    pdf.body("Concrete bag counts are NOT calculated in v1 - leave blank for your hole size / local mix.")

    # 4 Cut list
    pdf.add_page()
    pdf.h1("Cut list / order sheet")
    pdf.body("Qty calc = from the formulas above. Qty to buy = after waste buffer.")
    headers = ["Item", "Spec / size", "Qty calc", "Qty buy", "Notes"]
    col_w = [38, 42, 28, 28, 54]
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_fill_color(230, 240, 230)
    for h, w in zip(headers, col_w):
        pdf.cell(w, 8, h, border=1, fill=True)
    pdf.ln()
    rows = [
        ("Fence panels", "____ ft wide", "", "", ""),
        ("Fence posts", "____ length", "", "", ""),
        ("Post caps", "", "", "", ""),
        ("Concrete bags", "hole size ___", "-", "", "user sized"),
        ("Gate kits", "width ___", "", "", ""),
        ("Fasteners / brackets", "", "", "", ""),
        ("Gravel / base", "", "", "", ""),
        ("Stain / sealant", "", "", "", ""),
        ("Other", "", "", "", ""),
        ("Other", "", "", "", ""),
    ]
    pdf.set_font("Helvetica", "", 9)
    for r in rows:
        for cell, w in zip(r, col_w):
            pdf.cell(w, 9, cell, border=1)
        pdf.ln()
    pdf.ln(4)
    pdf.field_row("Waste buffer used (%%):", 60)
    pdf.body("Example check (optional): 100 ft, one 4-ft gate, 8-ft panels -> 12 panels, 15 posts")

    # 5 Layout sketch
    pdf.add_page()
    pdf.h1("Layout sketch")
    pdf.body("Rough plan view. Mark gates with a G. Note the last bay may need a trimmed panel.")
    pdf.set_draw_color(80, 80, 80)
    pdf.set_fill_color(250, 250, 250)
    pdf.rect(20, 50, 170, 100, style="D")
    # light grid
    pdf.set_draw_color(220, 220, 220)
    for i in range(1, 8):
        pdf.line(20 + i * 21.25, 50, 20 + i * 21.25, 150)
    for j in range(1, 5):
        pdf.line(20, 50 + j * 20, 190, 50 + j * 20)
    pdf.set_xy(20, 155)
    pdf.body("North / street side: ____________________________")
    pdf.field_row("Gate locations (ft from start):", 70)
    pdf.field_row("Corner / slope notes:", 70)

    # 6 Store checklist
    pdf.add_page()
    pdf.h1("Store checklist")
    pdf.body("Check off at Home Depot, Lowe's, or your local yard. Price/aisle notes are yours.")
    for t in [
        "Fence panels (match width & height)",
        "Fence posts",
        "Post caps",
        "Concrete mix / gravel for post holes",
        "Gate kit & hinges / latch",
        "Fasteners / brackets",
        "Level / string line / stakes",
        "Post-hole digger or auger rental",
        "PPE (gloves, glasses, hearing)",
        "Stain / sealant (if finishing this trip)",
    ]:
        pdf.checkbox(t)
    pdf.ln(4)
    pdf.h2("Store notes")
    pdf.field_row("Store A (name / date):", 55)
    pdf.field_row("Store B (name / date):", 55)
    pdf.field_row("Price notes / rain checks:", 55)

    # 7 Install day
    pdf.add_page()
    pdf.h1("Install day checklist")
    for t in [
        "811 / utilities marked and clear",
        "Frost-line / local depth rule checked",
        "Posts plumbed and braced before concrete sets",
        "Gates hung last; swing direction confirmed",
        "Last bay trimmed / filler panel planned",
        "Stain/seal timing noted (weather window)",
        "Scrap / cut-offs staged for disposal",
    ]:
        pdf.checkbox(t)
    pdf.ln(6)
    pdf.h2("Day-of notes")
    for _ in range(6):
        pdf.ln(8); pdf.set_draw_color(180,180,180); pdf.line(10, pdf.get_y(), 200, pdf.get_y())

    # 8 Back matter
    pdf.add_page()
    pdf.h1("Disclaimer & more tools")
    pdf.body("All numbers in this pack and on HomeFixMath.com are planning estimates only. They are not engineering calculations, structural design, or permission to build. Follow manufacturer instructions, local building codes, and HOA rules. Call 811 before digging.")
    pdf.ln(2)
    pdf.body("More free US DIY calculators: https://homefixmath.com (when live)")
    pdf.body("Support / product questions: use your Gumroad receipt reply or the email listed on the product page.")
    pdf.ln(8)
    pdf.set_font("Helvetica", "B", 11)
    pdf.multi_cell(0, 6, f"(c) {BRAND}. All rights reserved.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 5, "Brand: HomeFixMath - free US customary DIY material calculators.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    out_pdf = OUT / "fence-pack-v1.pdf"
    pdf.output(str(out_pdf))
    return out_pdf

def build_cover():
    # 1200x1200 Gumroad-style cover
    W = H = 1200
    img = Image.new("RGB", (W, H), (245, 248, 242))
    d = ImageDraw.Draw(img)
    # green band
    d.rectangle([0, 0, W, 180], fill=(40, 110, 70))
    d.rectangle([0, H - 120, W, H], fill=(40, 110, 70))
    # fence-ish lines
    for x in range(80, W, 100):
        d.rectangle([x, 320, x + 18, 880], fill=(90, 140, 100))
    d.rectangle([60, 300, W - 60, 320], fill=(60, 100, 70))
    d.rectangle([60, 880, W - 60, 900], fill=(60, 100, 70))
    try:
        font_lg = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_md = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        font_sm = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    except Exception:
        font_lg = font_md = font_sm = ImageFont.load_default()
    d.text((60, 50), BRAND, fill=(255, 255, 255), font=font_sm)
    # title block
    d.rounded_rectangle([80, 420, W - 80, 720], radius=24, fill=(255, 255, 255))
    d.text((120, 460), "Fence Project", fill=(20, 50, 30), font=font_lg)
    d.text((120, 545), "Math Pack", fill=(20, 50, 30), font=font_lg)
    d.text((120, 640), "Cut list - Store checklist - US feet", fill=(60, 90, 70), font=font_md)
    d.text((60, H - 80), "Printable PDF  -  $7", fill=(255, 255, 255), font=font_md)
    out = OUT / "fence-pack-cover-1200.png"
    img.save(out, "PNG")
    return out

def write_copy():
    (OUT / "gumroad-listing.md").write_text(
        """# Gumroad listing - Fence Project Math Pack v1

**Title:** Fence Project Math Pack - Cut List & Store Checklist (US)
**Price:** $7 USD
**File:** fence-pack-v1.pdf
**Cover:** fence-pack-cover-1200.png

## Short description
Printable fence workbook for US DIYers: measure sheet, panel/post cut list, store checklist, and install-day notes. Pairs with the free HomeFixMath fence calculator. Letter-size PDF. Estimates only - not engineering advice.

## Long description
Planning a prefab panel fence? This printable letter-size pack turns your measurements into a cut list and store run checklist you can take to Home Depot, Lowe's, or your local yard.

What's inside (8 pages):
- How to use (5 steps) + link to the free online calculator
- Measure worksheet with 811 checkbox
- Cut list / order sheet (panels, posts, caps, gates, fasteners)
- Layout sketch page
- Store checklist with price/aisle notes
- Install-day checklist
- Clear disclaimer (estimates only)

Math matches the free HomeFixMath fence calculator:
net length -> ceil panels -> posts = panels + 1 + 2xgates + extras.

Concrete bag counts are left blank on purpose (hole size varies). Not engineering advice. Call 811 before digging.

## Thank-you / post-purchase
Thanks for grabbing the Fence Project Math Pack. Print letter size, fill the measure sheet first, then shop. Free online calculator: https://homefixmath.com/calculators/fence-panels (use your live URL once the domain is up). Questions? Reply to your Gumroad receipt email.
""",
        encoding="utf-8",
    )
    (OUT / "x-promo-drafts.md").write_text(
        """# X promo drafts - Fence Math Pack (HomeFixMath)

1)
Free fence panel calculator -> printable cut list for the store run.
HomeFixMath Fence Project Math Pack ($7 PDF): measure sheet, panel/post order list, install-day checklist. US feet. Estimates only.
[link]

2)
DIY fence math without the spreadsheet headache.
Panels = ceil(net / width). Posts = panels + 1 + 2xgates.
Free calc on the site; $7 printable workbook if you want it on paper at the lumber aisle.
[link]

3)
Before you dig: 811 + a shopping list that matches your panel width.
New HomeFixMath PDF pack for US prefab fences - cut list, store checklist, layout sketch.
[link]
""",
        encoding="utf-8",
    )

if __name__ == "__main__":
    pdf = build_pdf()
    cover = build_cover()
    write_copy()
    print(pdf, pdf.stat().st_size)
    print(cover, cover.stat().st_size)
