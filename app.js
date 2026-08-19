const FALLBACK_PRODUCTS=[
{id:1,name:"Aero Wireless Headphones",cat:"Audio",price:79.99,r:4.8,img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",d:"Comfortable wireless headphones with rich sound and all-day battery life."},
{id:2,name:"Pulse Smart Watch",cat:"Wearables",price:129.99,r:4.6,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",d:"A modern smartwatch for activity tracking and everyday notifications."},
{id:3,name:"Orbit Backpack",cat:"Travel",price:54.99,r:4.7,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",d:"Lightweight backpack with a padded laptop compartment and smart storage."},
{id:4,name:"Studio Desk Lamp",cat:"Home",price:39.99,r:4.5,img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",d:"Minimal LED desk lamp with adjustable direction."},
{id:5,name:"Cloud Running Shoes",cat:"Fitness",price:89.99,r:4.9,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",d:"Responsive everyday running shoes designed for comfort."},
{id:6,name:"Arc Mechanical Keyboard",cat:"Tech",price:99.99,r:4.7,img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",d:"Tactile mechanical keyboard with a compact layout."},
{id:7,name:"Brew Ceramic Mug",cat:"Home",price:18.99,r:4.4,img:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",d:"Hand-finished ceramic mug for your desk or kitchen."},
{id:8,name:"Pixel Portable Speaker",cat:"Audio",price:59.99,r:4.6,img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",d:"Compact Bluetooth speaker with clear sound and portable design."}
];

let products=[];
let cart=JSON.parse(localStorage.getItem("novacart")||"[]");
let qty=1;

const $=s=>document.querySelector(s);
const money=n=>"$"+Number(n).toFixed(2);

function saveCart(){
  localStorage.setItem("novacart",JSON.stringify(cart));
  $("#cartCount").textContent=cart.reduce((sum,item)=>sum+item.q,0);
}

function toast(message){
  const t=$("#toast");t.textContent=message;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1800);
}

function add(id,n=1){
  const item=cart.find(x=>x.id==id);
  item?item.q+=n:cart.push({id:+id,q:n});
  saveCart();toast("Added to cart");
}

function card(p){
 return `<article class="card">
  <a href="#/product/${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
  <div><small class="tag">${p.cat}</small><h3>${p.name}</h3>
  <span>★ ${p.r}</span><p class="price">${money(p.price)}</p>
  <button class="btn" onclick="add(${p.id})">Add to cart</button></div>
 </article>`;
}

function home(){
 return `<section class="hero"><div><b class="tag">Full-stack capstone</b>
 <h1>Everything you need, in one place.</h1>
 <p>Discover technology, home goods, travel gear and everyday essentials in a fast, responsive shopping experience.</p>
 <a class="btn" href="#/products">Explore products</a>
 <div class="apiStatus">Products are loaded through the REST API on deployment.</div></div>
 <img src="https://images.unsplash.com/photo-1607082348824-0a96f2aee8c1?auto=format&fit=crop&w=1200&q=80" alt="Shopping collection"></section>
 <section class="section"><div class="head"><h2>Featured products</h2><a class="btn" href="#/products">View all</a></div>
 <div class="grid">${products.slice(0,4).map(card).join("")}</div></section>`;
}

function productPage(){
 return `<section class="catalog"><div class="head"><h1>All products</h1><span class="muted">${products.length} products</span></div>
 <div class="controls"><input id="q" oninput="filter()" placeholder="Search products...">
 <select id="cat" onchange="filter()"><option value="">All categories</option>${[...new Set(products.map(p=>p.cat))].map(x=>`<option>${x}</option>`).join("")}</select>
 <select id="sort" onchange="filter()"><option value="">Featured</option><option value="lo">Price low-high</option><option value="hi">Price high-low</option><option value="ra">Top rated</option></select></div>
 <div id="results" class="grid">${products.map(card).join("")}</div></section>`;
}

window.filter=()=>{
 const q=$("#q").value.toLowerCase(),c=$("#cat").value,s=$("#sort").value;
 let a=products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q)&&(!c||p.cat==c));
 if(s=="lo")a.sort((x,y)=>x.price-y.price);
 if(s=="hi")a.sort((x,y)=>y.price-x.price);
 if(s=="ra")a.sort((x,y)=>y.r-x.r);
 $("#results").innerHTML=a.length?a.map(card).join(""):`<div class="empty" style="grid-column:1/-1"><h2>No products found</h2><p>Try another search.</p></div>`;
};

function detail(id){
 const p=products.find(x=>x.id==id);
 if(!p)return `<section class="section"><div class="empty"><h2>Product not found</h2></div></section>`;
 return `<section class="detail"><img src="${p.img}" alt="${p.name}">
 <div><small class="tag">${p.cat}</small><h1>${p.name}</h1><p>★ ${p.r}</p><p class="muted">${p.d}</p><h2>${money(p.price)}</h2>
 <div class="qty">Quantity: <button onclick="setQty(-1)">−</button><b id="qty">1</b><button onclick="setQty(1)">+</button></div><br>
 <button class="btn" onclick="add(${p.id},qty);qty=1">Add to cart</button></div></section>`;
}

window.setQty=d=>{qty=Math.max(1,qty+d);$("#qty").textContent=qty};

function cartPage(){
 if(!cart.length)return `<section class="cartPage"><h1>Your cart</h1><div class="empty"><h2>Your cart is empty</h2><a class="btn" href="#/products">Start shopping</a></div></section>`;
 let total=0;
 const rows=cart.map(x=>{
   const p=products.find(y=>y.id==x.id);
   if(!p)return "";
   total+=p.price*x.q;
   return `<div class="row"><img src="${p.img}" alt="${p.name}"><div><b>${p.name}</b><p>${money(p.price)} × ${x.q}</p>
   <button onclick="change(${p.id},-1)">−</button><button onclick="change(${p.id},1)">+</button>
   <button onclick="removeItem(${p.id})">Remove</button></div><strong>${money(p.price*x.q)}</strong></div>`;
 }).join("");
 return `<section class="cartPage"><h1>Your cart</h1><div class="cartLayout"><div class="cartList">${rows}</div>
 <aside class="summary"><h3>Order summary</h3><div class="line"><span>Subtotal</span><b>${money(total)}</b></div>
 <div class="line"><span>Shipping</span><b>Free</b></div><div class="line total"><span>Total</span><b>${money(total)}</b></div>
 <button class="btn" onclick="checkout()">Checkout</button></aside></div></section>`;
}

window.change=(id,d)=>{
 const x=cart.find(a=>a.id==id);if(!x)return;x.q+=d;
 if(x.q<=0)cart=cart.filter(a=>a.id!=id);saveCart();render();
};
window.removeItem=id=>{cart=cart.filter(a=>a.id!=id);saveCart();render()};
window.checkout=()=>{cart=[];saveCart();toast("Demo checkout complete");render()};

function about(){
 return `<section class="about"><small class="tag">Project architecture</small><h1>Built for a smooth shopping experience.</h1>
 <p>This capstone demonstrates a modular frontend, client-side routing, reusable UI components, REST API integration, product search/filtering, persistent cart state and deployment-ready architecture.</p>
 <div class="features"><div class="feature"><h3>Modular frontend</h3><p class="muted">Reusable product cards and page renderers.</p></div>
 <div class="feature"><h3>Client-side routing</h3><p class="muted">Home, catalog, product, cart and about routes.</p></div>
 <div class="feature"><h3>Persistent state</h3><p class="muted">Cart survives browser reloads with localStorage.</p></div></div></section>`;
}

function render(){
 const h=location.hash.replace("#","")||"/";
 $("#app").innerHTML=h=="/"?home():h=="/products"?productPage():h=="/cart"?cartPage():h=="/about"?about():h.startsWith("/product/")?detail(h.split("/")[2]):`<section class="section"><div class="empty"><h2>Page not found</h2></div></section>`;
 saveCart();scrollTo(0,0);
}

async function loadProducts(){
 try{
   const response=await fetch("/api/products");
   if(!response.ok)throw new Error("API unavailable");
   const data=await response.json();
   products=data.map(p=>({...p,cat:p.cat||p.category}));
 }catch(e){
   products=FALLBACK_PRODUCTS;
 }
 render();
}

$("#year").textContent=new Date().getFullYear();
$("#searchToggle").onclick=()=>$("#searchBar").classList.toggle("hide");
$("#globalSearch").onkeydown=e=>{
 if(e.key==="Enter"){
   location.hash="#/products";
   setTimeout(()=>{if($("#q")){$("#q").value=e.target.value;filter()}},50);
 }
};
$("#menu").onclick=()=>$("#nav").classList.toggle("open");
addEventListener("hashchange",render);
loadProducts();
