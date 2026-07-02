import json,unicodedata,re,math
d=json.load(open('provinces.geojson'))
def slug(s):
    s=unicodedata.normalize('NFD',s); s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    s=s.replace('đ','d').replace('Đ','D'); return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

# --- Douglas-Peucker on lon/lat ---
def perp(p,a,b):
    (x,y),(x1,y1),(x2,y2)=p,a,b
    dx,dy=x2-x1,y2-y1
    if dx==0 and dy==0: return math.hypot(x-x1,y-y1)
    t=((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)
    t=max(0,min(1,t)); px,py=x1+t*dx,y1+t*dy
    return math.hypot(x-px,y-py)
def dp(pts,tol):
    if len(pts)<3: return pts
    dmax,idx=0,0
    for i in range(1,len(pts)-1):
        dd=perp(pts[i],pts[0],pts[-1])
        if dd>dmax: dmax,idx=dd,i
    if dmax>tol:
        l=dp(pts[:idx+1],tol); r=dp(pts[idx:],tol)
        return l[:-1]+r
    return [pts[0],pts[-1]]

TOL=0.006          # ~600m simplify
MIN_AREA=0.0016    # drop specks (deg^2)
CLIP_LNG=110.6     # drop far offshore islands (Paracel/Spratly) for compact mainland view

def ring_area(r):
    a=0
    for i in range(len(r)-1):
        a+=r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1]
    return abs(a)/2

# Source-data fixup: Ma 31 is geographically the Mekong-delta unit Đồng Tháp
# (centroid lat ~10.5), but the source mislabels it "Lạng Sơn". Correct it.
FIXUPS={'31':{'name':'Đồng Tháp','SapNhap':'Tiền Giang, Đồng Tháp'}}

feats=[]
allpts=[]
for ft in d['features']:
    p=ft['properties']; code=p['Ma']
    fx=FIXUPS.get(code,{})
    name=fx.get('name',p['TinhThanh'])
    sapnhap=fx.get('SapNhap',p.get('SapNhap') or '')
    merged=[m.strip() for m in sapnhap.split(',') if m.strip() and m.strip()!=name]
    g=ft['geometry']; polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    rings=[]
    for poly in polys:
        outer=poly[0]  # ignore holes
        # clip far offshore
        cx=sum(pt[0] for pt in outer)/len(outer)
        if cx>CLIP_LNG: continue
        simp=dp([tuple(pt) for pt in outer],TOL)
        if len(simp)<4: continue
        if ring_area(simp)<MIN_AREA: continue
        rings.append(simp)
        allpts+=simp
    if not rings:  # keep largest ring even if below threshold
        biggest=max(polys,key=lambda pl:ring_area(pl[0]))
        simp=dp([tuple(pt) for pt in biggest[0]],TOL); rings.append(simp); allpts+=simp
    feats.append({'code':code,'id':slug(name),'name':name,'merged':merged,'rings':rings})

# --- mercator projection over mainland bbox ---
def merc(lon,lat): return lon, math.degrees(math.log(math.tan(math.pi/4+math.radians(lat)/2)))
xs=[merc(x,y)[0] for x,y in allpts]; ys=[merc(x,y)[1] for x,y in allpts]
minx,maxx,miny,maxy=min(xs),max(xs),min(ys),max(ys)
W=1000.0; H=W*(maxy-miny)/(maxx-minx)
def project(lon,lat):
    mx,my=merc(lon,lat)
    X=(mx-minx)/(maxx-minx)*W
    Y=(maxy-my)/(maxy-miny)*H  # flip Y
    return round(X,1),round(Y,1)

def path_d(rings):
    parts=[]
    for r in rings:
        pts=[project(x,y) for x,y in r]
        seg='M'+' '.join(f'{x},{y}' for x,y in pts)+'Z'
        parts.append(seg)
    return ''.join(parts)

out=[]
for f in feats:
    dstr=path_d(f['rings'])
    # centroid = avg of first ring projected pts
    fr=[project(x,y) for x,y in f['rings'][0]]
    cx=round(sum(x for x,_ in fr)/len(fr),1); cy=round(sum(y for _,y in fr)/len(fr),1)
    out.append({'code':f['code'],'id':f['id'],'name':f['name'],'merged':f['merged'],'cx':cx,'cy':cy,'d':dstr})
out.sort(key=lambda x:x['id'])
json.dump({'viewBox':f'0 0 {round(W,1)} {round(H,1)}','provinces':out},open('provinces-svg.json','w'),ensure_ascii=False)
import os
print("viewBox 0 0 %.1f %.1f"%(W,H))
print("features:",len(out))
print("output json size: %.1f KB"%(os.path.getsize('provinces-svg.json')/1024))
# dup slug check
from collections import Counter
c=Counter(x['id'] for x in out)
print("dup slugs:",{k:v for k,v in c.items() if v>1})
