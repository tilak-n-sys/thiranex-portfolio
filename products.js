const products = [
  {id:1,name:"Aero Wireless Headphones",category:"Audio",price:79.99,r:4.8,img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",d:"Comfortable wireless headphones with rich sound and all-day battery life."},
  {id:2,name:"Pulse Smart Watch",category:"Wearables",price:129.99,r:4.6,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",d:"A modern smartwatch for activity tracking and everyday notifications."},
  {id:3,name:"Orbit Backpack",category:"Travel",price:54.99,r:4.7,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",d:"Lightweight backpack with a padded laptop compartment and smart storage."},
  {id:4,name:"Studio Desk Lamp",category:"Home",price:39.99,r:4.5,img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",d:"Minimal LED desk lamp with adjustable direction."},
  {id:5,name:"Cloud Running Shoes",category:"Fitness",price:89.99,r:4.9,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",d:"Responsive everyday running shoes designed for comfort."},
  {id:6,name:"Arc Mechanical Keyboard",category:"Tech",price:99.99,r:4.7,img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",d:"Tactile mechanical keyboard with a compact layout."},
  {id:7,name:"Brew Ceramic Mug",category:"Home",price:18.99,r:4.4,img:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",d:"Hand-finished ceramic mug for your desk or kitchen."},
  {id:8,name:"Pixel Portable Speaker",category:"Audio",price:59.99,r:4.6,img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",d:"Compact Bluetooth speaker with clear sound and portable design."}
];

export default function handler(req,res){
  res.setHeader("Cache-Control","s-maxage=60, stale-while-revalidate=300");
  res.status(200).json(products);
}
