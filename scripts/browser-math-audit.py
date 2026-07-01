from __future__ import annotations
import asyncio, json, math, re, sys
from pathlib import Path
from playwright.async_api import async_playwright, Page, Route, Request

BASE = 'http://127.0.0.1:8765/kalkulatorok/'
RESULTS=[]
PAGE_ERRORS=[]
CONSOLE_ERRORS=[]

async def route_handler(route: Route, request: Request):
    url=request.url
    if url.startswith('http://127.0.0.1:8765/'):
        await route.continue_(); return
    if url.startswith('https://api.frankfurter.dev/v1/latest'):
        await route.fulfill(status=200, content_type='application/json', body=json.dumps({
            'amount':1.0,'base':'EUR','date':'2026-07-01','rates':{
                'HUF':400.0,'USD':1.1,'GBP':0.85,'CHF':0.95,'PLN':4.3,'CZK':25.0,'RON':5.0,
                'SEK':11.0,'NOK':11.5,'DKK':7.46,'JPY':170.0,'CAD':1.5,'AUD':1.65,'CNY':8.0
            }
        })); return
    await route.abort()

def hu_numbers(text: str):
    # Dot is usually a date punctuation in Hungarian output; decimal is comma.
    vals=[]
    for m in re.finditer(r'-?\d[\d\s\u00a0\u202f]*(?:[\.,]\d+)?', text or ''):
        raw=m.group(0).replace(' ','').replace('\u00a0','').replace('\u202f','').replace(',','.')
        try: vals.append(float(raw))
        except: pass
    return vals

def close(a,b,tol=1e-6):
    return abs(a-b) <= max(tol, abs(b)*tol)

async def setv(page: Page, selector: str, value: str):
    await page.eval_on_selector(selector, "(el, value) => { el.value = value; el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true})); }", str(value))
    await page.wait_for_timeout(15)

async def select(page: Page, selector: str, value: str):
    await page.eval_on_selector(selector, "(el, value) => { el.value = value; el.dispatchEvent(new Event('change', {bubbles:true})); }", str(value))
    await page.wait_for_timeout(15)

async def check_text(page: Page, selector: str, expected: str, name: str):
    text=(await page.locator(selector).inner_text()).strip()
    ok=expected in text
    RESULTS.append({'name':name,'ok':ok,'actual':text,'expected':expected})
    if not ok: print('FAIL',name,repr(text),'expected contains',repr(expected))

async def check_num(page: Page, selector: str, expected: float, name: str, index=0, tol=1e-6):
    text=(await page.locator(selector).inner_text()).strip()
    nums=hu_numbers(text)
    actual=nums[index] if nums else None
    ok=actual is not None and close(actual,expected,tol)
    RESULTS.append({'name':name,'ok':ok,'actual':actual,'text':text,'expected':expected,'tol':tol})
    if not ok: print('FAIL',name,repr(text),'nums',nums,'expected',expected)

async def open_page(page: Page, filename: str):
    await page.goto(BASE+filename, wait_until='domcontentloaded', timeout=20000)
    await page.wait_for_timeout(150)
    await page.evaluate("document.querySelector('#cookie-banner')?.remove(); document.querySelector('#cookie-modal')?.remove();")

async def run_tests(page: Page):
    # 1 data size
    await open_page(page,'adatmeret-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','mb'); await select(page,'#toUnit','kb')
    await check_num(page,'#result',1024,'Adatméret: 1 MB = 1024 KB',index=-1)

    # 2 VAT net and gross modes
    await open_page(page,'afa-kalkulator.html')
    await setv(page,'#amount','1000'); await setv(page,'#vat','27')
    text=await page.locator('#result-value').inner_text(); nums=hu_numbers(text)
    ok=all(any(close(n,x) for n in nums) for x in [1000,270,1270])
    RESULTS.append({'name':'ÁFA nettó->bruttó 1000 @27%','ok':ok,'text':text,'numbers':nums,'expected':[1000,270,1270]})
    if not ok: print('FAIL VAT',text,nums)
    await page.locator('input[name="mode"][value="brutto"]').check(force=True); await page.wait_for_timeout(50)
    await setv(page,'#amount','1270')
    text=await page.locator('#result-value').inner_text(); nums=hu_numbers(text)
    ok=all(any(close(n,x) for n in nums) for x in [1270,270,1000])
    RESULTS.append({'name':'ÁFA bruttó->nettó 1270 @27%','ok':ok,'text':text,'numbers':nums,'expected':[1270,270,1000]})

    # 3 auto super
    await open_page(page,'auto-kalkulator.html')
    await setv(page,'#distance','500'); await setv(page,'#fuelUsed','35'); await check_num(page,'#result-consumption',7,'Autó fogyasztás 35l/500km',tol=1e-8)
    await setv(page,'#distance-cost','100'); await setv(page,'#consumption-cost','7'); await setv(page,'#fuelPrice','600'); await check_num(page,'#result-cost',4200,'Autó üzemanyagköltség')
    await setv(page,'#tankSize','42'); await setv(page,'#consumption-range','7'); await check_num(page,'#result-range',600,'Autó hatótáv')

    # 4 concrete
    await open_page(page,'beton-kalkulator.html')
    await setv(page,'#length','5'); await setv(page,'#width','4'); await setv(page,'#depth','10'); await check_num(page,'#result-volume',2,'Beton térfogat',tol=1e-8)

    # 5 BMI
    await open_page(page,'bmi-kalkulator.html')
    await setv(page,'#weight','80'); await setv(page,'#height','180'); await check_num(page,'#result-bmi',24.7,'BMI 80kg/180cm',tol=1e-8); await check_text(page,'#result-category','Normál','BMI kategória')
    await setv(page,'#weight','-1'); await check_text(page,'#result-bmi','–','BMI negatív testsúly elutasítva')

    # 6 tiles
    await open_page(page,'csempe-kalkulator.html')
    await setv(page,'#width','2'); await setv(page,'#height','3'); await setv(page,'#tileWidth','30'); await setv(page,'#tileHeight','30'); await check_num(page,'#result-tiles',74,'Csempe darabszám 10% ráhagyással')
    await setv(page,'#tileWidth','0'); await check_text(page,'#result-tiles','–','Csempe nulla lapméret elutasítva')

    # 7 currency mocked
    await open_page(page,'deviza-atvalto-kalkulator.html')
    await page.wait_for_timeout(250)
    await setv(page,'#inputValue','400'); await select(page,'#fromCurrency','HUF'); await select(page,'#toCurrency','EUR'); await check_num(page,'#result',1,'Deviza 400 HUF = 1 EUR',index=-1)
    await setv(page,'#inputValue','100'); await select(page,'#fromCurrency','EUR'); await select(page,'#toCurrency','HUF'); await check_num(page,'#result',40000,'Deviza 100 EUR = 40000 HUF',index=-1)

    # 8 ETF zero return / zero costs
    await open_page(page,'etf-kalkulator.html')
    for sel,val in [('#initial','0'),('#monthly','1000'),('#rate','0'),('#years','1'),('#ter','0'),('#inflation','0'),('#increase','0')]: await setv(page,sel,val)
    await check_num(page,'#result-final',12000,'ETF 0%: 12x1000 = 12000')
    await check_num(page,'#result-invested',12000,'ETF befizetett tőke')

    # 8b ETF non-zero effective return and goal solving
    for sel,val in [('#initial','100000'),('#monthly','10000'),('#rate','6'),('#years','1'),('#ter','0'),('#inflation','0'),('#increase','0')]: await setv(page,sel,val)
    await check_num(page,'#result-final',229265,'ETF 6% effektív éves, hónap végi befizetés',tol=2e-5)
    await page.locator('input[name="etfMode"][value="goal"]').check(force=True); await page.wait_for_timeout(80)
    for sel,val in [('#target','120000'),('#initial','0'),('#rate','0'),('#years','1'),('#ter','0'),('#inflation','0'),('#increase','0')]: await setv(page,sel,val)
    await check_num(page,'#result-final',10000,'ETF célmód: 120000 Ft / 12 hónap')

    # 9 paint
    await open_page(page,'festek-kalkulator.html')
    for sel,val in [('#roomLength','5'),('#roomWidth','4'),('#roomHeight','2.5'),('#windowArea','2'),('#doorArea','0'),('#layers','2'),('#coverage','10')]: await setv(page,sel,val)
    await check_num(page,'#wallArea',45,'Festék falfelület')
    await check_num(page,'#totalArea',43,'Festék nettó felület')
    await check_num(page,'#paintNeeded',8.6,'Festék számított liter',tol=1e-8)
    await check_num(page,'#recommendedPaint',10,'Festék ajánlott liter')
    await setv(page,'#coverage','0'); await check_text(page,'#paintNeeded','–','Festék: nulla fedőképesség elutasítva')

    # 10 payment deadlines
    await open_page(page,'fizetesi-hatarido-kalkulator.html')
    await setv(page,'#startDate','2026-01-01'); await setv(page,'#days','10'); await check_text(page,'#result-date','2026. 01. 11.','Fizetési határidő naptári nap')
    await page.locator('input[name="mode"][value="workdays"]').check(force=True); await page.wait_for_timeout(50); await check_text(page,'#result-date','2026. 01. 15.','Fizetési határidő munkanap (hétvégék nélkül)')

    # 11 budget
    await open_page(page,'havi-koltsegvetes-kalkulator.html')
    vals={'#income':'500000','#housing':'150000','#utilities':'50000','#food':'100000','#transport':'30000','#debt':'20000','#other':'25000','#savings':'50000'}
    for s,v in vals.items(): await setv(page,s,v)
    await check_num(page,'#balanceResult',75000,'Havi költségvetés egyenleg')
    await check_num(page,'#expenseResult',425000,'Havi költségvetés összes kiadás')
    await check_num(page,'#savingsRateResult',10,'Havi költségvetés megtakarítási arány',tol=1e-8)

    # 12 loan 0% and 12%
    await open_page(page,'hitel-torleszto-kalkulator.html')
    await setv(page,'#amount','1000000'); await setv(page,'#rate','0'); await setv(page,'#years','1'); await check_num(page,'#result-monthly',83333,'Hitel 0% havi részlet',tol=2e-5)
    await setv(page,'#rate','12')
    expected=1_000_000*0.01/(1-(1.01)**-12)
    await check_num(page,'#result-monthly',round(expected),'Hitel annuitás 12% nominális',tol=2e-5)

    # 13 credit capacity
    await open_page(page,'hitelkepesseg-kalkulator.html')
    await setv(page,'#income','500000'); await setv(page,'#existing','0'); await setv(page,'#rate','0'); await setv(page,'#years','1')
    await check_num(page,'#result-monthly',200000,'Hitelképesség 40% terhelési keret')
    await check_num(page,'#result-loan',2400000,'Hitelképesség 0% PV')

    # 14 temperature
    await open_page(page,'homerseklet-atvalto-kalkulator.html')
    await setv(page,'#cfInput','0'); await check_num(page,'#cfResult',32,'Hőmérséklet 0C=32F',index=-1)
    await setv(page,'#ckInput','0'); await check_num(page,'#ckResult',273.15,'Hőmérséklet 0C=273.15K',index=-1,tol=1e-8)
    await setv(page,'#ckInput','-274'); await check_text(page,'#ckResult','abszolút nulla','Hőmérséklet abszolút nulla validáció')

    # 15 length
    await open_page(page,'hosszusag-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','mi'); await select(page,'#toUnit','m'); await check_num(page,'#result',1609.344,'Hosszúság 1 mérföld',index=-1,tol=1e-9)

    # 16 time
    await open_page(page,'ido-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','year'); await select(page,'#toUnit','day'); await check_num(page,'#result',365.2425,'Idő: átlagos Gergely-év napban',index=-1,tol=1e-9)

    # 17 inflation
    await open_page(page,'inflacio-kalkulator.html')
    await setv(page,'#amount','1000000'); await setv(page,'#rate','0'); await setv(page,'#years','10'); await check_num(page,'#result-final',1000000,'Infláció 0%')
    await setv(page,'#rate','6'); await setv(page,'#years','5'); await check_num(page,'#result-final',round(1_000_000/(1.06**5)),'Infláció 6% 5 év',tol=2e-5)

    # 18 calories
    await open_page(page,'kaloria-kalkulator.html')
    await select(page,'#gender','male'); await setv(page,'#weight','80'); await setv(page,'#height','180'); await setv(page,'#age','40'); await select(page,'#activity','1.2')
    # Mifflin: 1730, maintenance 2076
    await check_num(page,'#result-calories',2076,'Kalóriaszükséglet Mifflin-St Jeor × aktivitás')

    # 19 compound
    await open_page(page,'kamatos-kamat-kalkulator.html')
    await setv(page,'#initial','0'); await setv(page,'#monthly','1000'); await setv(page,'#rate','0'); await setv(page,'#years','1'); await check_num(page,'#result-final',12000,'Kamatos kamat 0%')
    await setv(page,'#initial','100000'); await setv(page,'#monthly','0'); await setv(page,'#rate','6'); await setv(page,'#years','1'); await check_num(page,'#result-final',106000,'Kamatos kamat 6% effektív éves')

    # 20 down payment
    await open_page(page,'lakas-hitel-onero-kalkulator.html')
    await setv(page,'#price','50000000'); await setv(page,'#percent','20'); await check_num(page,'#result-down',10000000,'Lakáshitel önerő'); await check_num(page,'#result-loan',40000000,'Lakáshitel finanszírozás')

    # 21 millionaire
    await open_page(page,'milliomos-kalkulator.html')
    await setv(page,'#initial','0'); await setv(page,'#monthly','100000'); await setv(page,'#rate','0'); await setv(page,'#goal','1000000'); await check_text(page,'#result-time','0 év 10 hónap','Célösszeg 10 hónap')
    await setv(page,'#monthly','0'); await check_text(page,'#result-time','nem érhető el','Elérhetetlen cél felismerése')

    # 22 net/gross
    await open_page(page,'netto-brutto-kalkulator.html')
    await setv(page,'#gross','600000'); await check_num(page,'#result-net',399000,'Bruttó 600k -> nettó 399k')
    await setv(page,'#gross','1000000'); await page.locator('#under25').check(force=True); await page.wait_for_timeout(50); await check_num(page,'#result-net',772365,'25 év alatti kedvezmény havi plafonnal')
    await page.locator('#under25').uncheck(force=True); await page.locator('input[name="calc-type"][value="net-to-gross"]').check(force=True); await setv(page,'#net-input','399000'); await check_num(page,'#result-net',600000,'Nettó 399k -> bruttó 600k',tol=2e-5)

    await page.locator('input[name="calc-type"][value="gross-to-net"]').check(force=True); await page.wait_for_timeout(40)
    await setv(page,'#gross','300000'); await setv(page,'#family','2')
    await check_num(page,'#result-net',279500,'Családi kedvezmény: 2 gyermek, SZJA majd TB',tol=2e-5)
    await check_num(page,'#result-family',80000,'Családi kedvezmény felhasznált összeg',tol=2e-5)

    # 23 dividend income
    await open_page(page,'osztalek-kalkulator.html')
    await setv(page,'#incomeAmount','3000000'); await setv(page,'#dividendYield','4'); await setv(page,'#simpleDeduction','15'); await setv(page,'#fixedCost','0')
    text=await page.locator('#resultGrid').inner_text(); nums=hu_numbers(text)
    # Must contain gross 120000, annual net 102000, monthly 8500
    ok=all(any(close(n,x,tol=2e-5) for n in nums) for x in [120000,18000,8500])
    RESULTS.append({'name':'Osztalék jövedelem mód 3m×4%, 15% levonás','ok':ok,'text':text,'numbers':nums,'expected':[120000,18000,8500]})
    if not ok: print('FAIL dividend',text,nums)

    # 23b dividend target mode
    await page.locator('input[name="dividendMode"][value="target"]').check(force=True); await page.wait_for_timeout(80)
    await setv(page,'#targetIncome','10000'); await setv(page,'#dividendYield','4'); await setv(page,'#simpleDeduction','20'); await setv(page,'#fixedCost','0')
    await check_num(page,'#result-primary',3750000,'Osztalék célmód: havi nettó 10000, 4% hozam, 20% levonás',tol=2e-5)

    # 23c dividend projection mode, zero-return identity
    await page.locator('input[name="dividendMode"][value="projection"]').check(force=True); await page.wait_for_timeout(80)
    for sel,val in [('#initialPortfolio','0'),('#monthlyContribution','1000'),('#projectionYears','1'),('#dividendYield','0'),('#simpleDeduction','0'),('#fixedCost','0'),('#dividendGrowth','0'),('#priceGrowth','0'),('#inflation','0'),('#contributionIncrease','0')]: await setv(page,sel,val)
    await check_num(page,'#result-primary',12000,'Osztalék projekció: 0% hozam, 12x1000 befizetés',tol=2e-5)

    # 24 speed
    await open_page(page,'sebesseg-atvalto-kalkulator.html')
    await setv(page,'#inputValue','100'); await select(page,'#fromUnit','kmh'); await select(page,'#toUnit','ms'); await check_num(page,'#result',27.7777777778,'Sebesség 100 km/h m/s',index=-1,tol=1e-8)

    # 25 invoice performance deadline
    await open_page(page,'szamla-teljesites-kalkulator.html')
    await setv(page,'#issueDate','2026-01-01'); await setv(page,'#performanceDate','2026-01-01'); await setv(page,'#days','30'); await check_text(page,'#result-deadline','2026. 01. 31.','Számla teljesítés +30 nap')

    # 26 percentage all 3
    await open_page(page,'szazalek-kalkulator.html')
    await setv(page,'#a','25'); await setv(page,'#b','200'); await check_num(page,'#result1',50,'25% of 200')
    await setv(page,'#c','50'); await setv(page,'#d','200'); await check_num(page,'#result2',25,'50 is 25% of 200')
    await setv(page,'#e','100'); await setv(page,'#f','150'); await check_num(page,'#result3',50,'100 to 150 = 50%')
    await setv(page,'#c','0'); await setv(page,'#d','10'); await check_num(page,'#result2',0,'0 is 0% of 10')

    # 27 brick
    await open_page(page,'tegla-kalkulator.html')
    await setv(page,'#wallLength','10'); await setv(page,'#wallHeight','3'); await setv(page,'#windowArea','0'); await setv(page,'#doorArea','0'); await select(page,'#brickType','porotherm10'); await setv(page,'#wastePercent','5')
    await check_num(page,'#brickCountResult',240,'Tégla alap darabszám')
    await check_num(page,'#recommendedBrickCountResult',252,'Tégla 5% ráhagyás')
    await setv(page,'#wastePercent','0'); await check_num(page,'#recommendedBrickCountResult',240,'Tégla 0% ráhagyás valóban nulla')

    # 28 volume
    await open_page(page,'terfogat-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','gal'); await select(page,'#toUnit','l'); await check_num(page,'#result',3.785411784,'1 US gallon literben',index=-1,tol=1e-9)

    # 29 area
    await open_page(page,'terulet-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','ha'); await select(page,'#toUnit','m2'); await check_num(page,'#result',10000,'1 hektár m²',index=-1)

    # 30 mass
    await open_page(page,'tomeg-atvalto-kalkulator.html')
    await setv(page,'#inputValue','1'); await select(page,'#fromUnit','lb'); await select(page,'#toUnit','kg'); await check_num(page,'#result',0.45359237,'1 font kg',index=-1,tol=1e-9)

async def smoke_all(page: Page):
    root=Path('/mnt/data/kb_math_fixed/kalkulatorok')
    for p in sorted(root.glob('*.html')):
        before_e=len(PAGE_ERRORS)
        try:
            resp=await page.goto(BASE+p.name, wait_until='domcontentloaded', timeout=15000)
            await page.wait_for_timeout(60)
            status=resp.status if resp else None
            body=await page.locator('body').inner_text()
            ok=status==200 and 'NaN' not in body and 'Infinity' not in body and len(PAGE_ERRORS)==before_e
            RESULTS.append({'name':f'Smoke: {p.name}','ok':ok,'status':status,'new_page_errors':PAGE_ERRORS[before_e:]})
            if not ok: print('FAIL smoke',p.name,status,PAGE_ERRORS[before_e:])
        except Exception as exc:
            RESULTS.append({'name':f'Smoke: {p.name}','ok':False,'error':str(exc)})
            print('FAIL smoke exception',p.name,exc)

async def main():
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
        context=await browser.new_context(locale='hu-HU', timezone_id='Europe/Budapest', service_workers='block')
        await context.route('**/*', route_handler)
        page=await context.new_page()
        page.on('pageerror', lambda exc: PAGE_ERRORS.append(str(exc)))
        page.on('console', lambda msg: CONSOLE_ERRORS.append(msg.text) if msg.type=='error' and 'ERR_FAILED' not in msg.text else None)
        await run_tests(page)
        if '--tests-only' not in sys.argv:
            await smoke_all(page)
        await browser.close()
    passed=sum(1 for r in RESULTS if r['ok'])
    failed=len(RESULTS)-passed
    out={'passed':passed,'failed':failed,'total':len(RESULTS),'results':RESULTS,'page_errors':PAGE_ERRORS,'console_errors':CONSOLE_ERRORS}
    Path('/mnt/data/kb_math_fixed/scripts/browser-math-audit-results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Browser math/smoke tests: {passed}/{len(RESULTS)} passed, {failed} failed')
    if PAGE_ERRORS: print('Page errors:',PAGE_ERRORS)
    if CONSOLE_ERRORS: print('Console errors:',CONSOLE_ERRORS[:20])
    return 1 if failed else 0

if __name__=='__main__':
    sys.exit(asyncio.run(main()))
