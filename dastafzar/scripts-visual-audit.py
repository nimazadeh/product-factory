from playwright.sync_api import sync_playwright
import pathlib
root=pathlib.Path("/home/user/dastafzar/screenshots")
pages=[("landing","http://localhost:3000/","02-tools/landing-390.png",390),
("converter","http://localhost:3000/tools/date-converter","02-tools/date-converter-390.png",390),
("age","http://localhost:3000/tools/age-calculator","02-tools/age-calculator-390.png",390),
("diff","http://localhost:3000/tools/date-difference","02-tools/date-difference-390.png",390),
("nowruz","http://localhost:3000/tools/nowruz-countdown","02-tools/nowruz-countdown-390.png",390),
("landing-desktop","http://localhost:3000/","03-breakpoints/landing-1440.png",1440)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,url,out,w in pages:
        pg=b.new_page(viewport={"width":w,"height":900 if w>1000 else 844})
        errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
        pg.goto(url,wait_until="networkidle"); pg.wait_for_timeout(900)
        sw=pg.evaluate("document.documentElement.scrollWidth"); iw=pg.evaluate("innerWidth")
        # every input must sit inside its card
        bad=[]
        for inp in pg.locator("input").all():
            bb=inp.bounding_box()
            card=inp.evaluate("e=>{const c=e.closest('.converter,.tool-box'); if(!c) return null; const r=c.getBoundingClientRect(); return [r.x,r.width]}")
            if bb and card and (bb["x"]<card[0]-1 or bb["x"]+bb["width"]>card[0]+card[1]+1): bad.append(inp)
        print(f"{name}: scrollW={sw} innerW={iw} overflow={sw-iw} inputs-outside={len(bad)} errs={errs}")
        pg.screenshot(path=str(root/out)); pg.close()
    b.close()

from PIL import Image
for f in sorted(root.rglob("*.png")):
    im=Image.open(f).convert("L"); px=list(im.getdata())
    print(f.relative_to(root), "dark%=", round(sum(1 for x in px if x<200)/len(px)*100,2))
