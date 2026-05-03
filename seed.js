const https = require("https");
const http = require("http");
const FormData = require("form-data");

const BASE_URL = "http://localhost:8080/api";

// Unsplash image pools per category
const images = {
  Laptop: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80",
    "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&q=80",
  ],
  Mobile: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&q=80",
  ],
  Headphone: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400&q=80",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  ],
  Toys: [
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
    "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&q=80",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  ],
};

const laptopBrands = ["Apple","Dell","HP","Lenovo","Asus","Acer","MSI","Razer","Microsoft","LG"];
const mobileBrands = ["Samsung","Apple","OnePlus","Xiaomi","Oppo","Vivo","Google","Motorola","Nokia","Realme"];
const headphoneBrands = ["Sony","Bose","JBL","Sennheiser","Audio-Technica","Beats","AKG","Jabra","Skullcandy","Anker"];
const electronicsBrands = ["Canon","Logitech","LG","Samsung","Philips","Panasonic","Nikon","GoPro","Garmin","Fitbit"];
const toysBrands = ["Lego","Hasbro","Mattel","Fisher-Price","Hot Wheels","Nerf","Barbie","Playmobil","Funko","Bandai"];
const fashionBrands = ["Nike","Adidas","Puma","Reebok","New Balance","Under Armour","Vans","Converse","Gucci","Zara"];

function makeProducts() {
  const all = [];
  const laptopNames = [
    "ProBook 450","EliteBook 840","VivoBook 15","IdeaPad 5","ZenBook 14","Swift 3","Inspiron 15","ThinkPad X1","MacBook Air","Gram 16",
    "Pavilion 15","Spectre x360","ROG Zephyrus","Blade 15","Surface Laptop","Legion 5","Nitro 5","TUF Gaming","Predator Helios","Envy 13",
    "ProBook 640","EliteBook 1040","VivoBook Pro","IdeaPad Gaming","ZenBook Pro","Swift 5","Inspiron 14","ThinkPad E14","MacBook Pro 16","Gram 14",
    "Pavilion Gaming","Spectre x360 14","ROG Strix","Blade 17","Surface Pro 9","Legion 7","Nitro 7","TUF Dash","Predator Triton","Envy 15",
    "ProBook 470","EliteBook 850","VivoBook S15","IdeaPad Slim","ZenBook Flip","Swift X","Inspiron 16","ThinkPad T14","MacBook Pro 14","Gram 17",
  ];
  const mobileNames = [
    "Galaxy S24","iPhone 15","OnePlus 12","Redmi Note 13","Reno 11","V29","Pixel 8","Edge 40","G84","GT 5",
    "Galaxy A55","iPhone 15 Plus","OnePlus Nord 3","Redmi 13C","Reno 10","V27","Pixel 7a","Edge 30","G54","GT Neo 5",
    "Galaxy Z Fold 5","iPhone 15 Pro","OnePlus 11R","POCO X6","Find X6","iQOO 12","Pixel 8 Pro","Edge 50","G73","GT 3",
    "Galaxy S23 FE","iPhone 14","OnePlus Nord CE 3","Redmi Note 12","Reno 8","V25","Pixel 7","Edge 20","G62","GT 2 Pro",
    "Galaxy A35","iPhone 15 Pro Max","OnePlus 12R","POCO M6","Find N3","iQOO Neo 7","Pixel Fold","Edge 40 Pro","G82","GT Explorer",
  ];
  const headphoneNames = [
    "WH-1000XM5","QuietComfort 45","Tune 760","HD 450BT","ATH-M50xBT","Studio Pro","N700NC","Evolve2 65","Crusher Evo","Q45",
    "WH-1000XM4","QuietComfort 35","Live 660","HD 350BT","ATH-SR50BT","Solo Pro","N60NC","Evolve2 40","Hesh EVO","Q35",
    "WF-1000XM5","Sport Earbuds","Free NC+","IE 300","ATH-CKS50TW","Powerbeats Pro","N400","Jabra Elite 7","Indy ANC","Liberty 4",
    "WH-CH720N","Bose 700","Tune 230NC","Momentum 4","ATH-ANC300TW","Fit Pro","Y400","Jabra Elite 4","Push Ultra","Space A40",
    "WH-XB910N","QuietComfort Earbuds","Tune 125TWS","CX Plus","ATH-TWX9","Studio Buds+","N200","Jabra Elite 3","Dime 3","Soundcore Q30",
  ];
  const electronicsNames = [
    "EOS R50","MX Master 3S","OLED C3 55","Galaxy Tab S9","Hue Starter Kit","Lumix S5","Alpha 7 IV","Hero 12 Black","Fenix 7","Versa 4",
    "EOS R8","MX Keys Mini","OLED C3 65","Galaxy Tab A9","Hue Play Bar","Lumix GH6","Alpha 6700","Hero 11 Mini","Forerunner 265","Charge 6",
    "EOS M50 II","MX Anywhere 3","QNED 4K 55","iPad Pro 12.9","Hue Go","Lumix FZ300","ZV-E10","Max 360","Instinct 2","Sense 2",
    "PowerShot G7X","MX Vertical","NanoCell 4K","Fire HD 10","Hue Bloom","FZ80","ZV-1F","Session","Venu 3","Luxe",
    "EOS 90D","G502 X Plus","UltraGear 27","Kindle Paperwhite","Hue Iris","DC-ZS80","RX100 VII","Volta","Epix Pro","Inspire 3",
  ];
  const toysNames = [
    "Technic Bugatti","Transformers Optimus","Hot Wheels Track","Fisher-Price Piano","Nerf Elite 2.0","Barbie Dreamhouse","City Police","Pop Deadpool","Gundam RX-78","Star Wars AT-AT",
    "Creator Expert","GI Joe Snake Eyes","Matchbox Cars","Little People Farm","Nerf Hyper","Barbie Malibu","Technic Ferrari","Pop Spider-Man","Zaku II","Millennium Falcon",
    "Architecture Eiffel","Monopoly Classic","Uno Card Game","Baby Einstein","Nerf Fortnite","Barbie Extra","City Fire Station","Pop Iron Man","Strike Freedom","Death Star",
    "Ideas NASA Apollo","Risk Board Game","Jenga Giant","VTech Baby","Nerf Rival","Barbie Fashionista","Technic Lamborghini","Pop Thor","Wing Gundam","Hogwarts Castle",
    "Mindstorms Robot","Scrabble Deluxe","Connect Four","LeapFrog Tablet","Nerf Ultra","Barbie Skipper","City Airport","Pop Captain America","Destiny Gundam","Batmobile",
  ];
  const fashionNames = [
    "Air Max 270","Ultraboost 22","RS-X","Classic Leather","Fresh Foam 1080","Charged Assert","Old Skool","Chuck Taylor","Ace Sneaker","Stan Smith",
    "Air Force 1","NMD R1","Suede Classic","Club C 85","990v5","HOVR Phantom","Sk8-Hi","Run Star Hike","Princetown Loafer","Superstar",
    "React Infinity","Forum Low","Mayze","Aztrek","574 Core","Charged Bandit","Era","One Star","Horsebit Loafer","Gazelle",
    "Pegasus 40","Samba OG","Smash V2","Classic Nylon","Arishi v4","Surge 3","Authentic","Pro Leather","GG Marmont","Campus",
    "Zoom Fly 5","Adizero Boston","Softride Enzo","Nano X3","Beacon v3","Phantom 3","Slip-On","Jack Purcell","Ace Low","Handball Spezial",
  ];

  const nameMap = { Laptop: laptopNames, Mobile: mobileNames, Headphone: headphoneNames, Electronics: electronicsNames, Toys: toysNames, Fashion: fashionNames };
  const brandMap = { Laptop: laptopBrands, Mobile: mobileBrands, Headphone: headphoneBrands, Electronics: electronicsBrands, Toys: toysBrands, Fashion: fashionBrands };
  const priceRange = { Laptop: [499, 2999], Mobile: [199, 1299], Headphone: [29, 399], Electronics: [49, 1299], Toys: [19, 399], Fashion: [29, 299] };
  const descriptions = {
    Laptop: "High-performance laptop with fast processor, ample RAM, and stunning display for work and play.",
    Mobile: "Feature-packed smartphone with advanced camera system, long battery life, and smooth performance.",
    Headphone: "Premium audio experience with deep bass, clear highs, and comfortable over-ear design.",
    Electronics: "Top-quality electronic device engineered for precision, durability, and everyday convenience.",
    Toys: "Fun and engaging toy designed to spark creativity and provide hours of entertainment.",
    Fashion: "Stylish and comfortable footwear crafted with premium materials for all-day wear.",
  };

  for (const category of Object.keys(nameMap)) {
    const names = nameMap[category];
    const brands = brandMap[category];
    const [minP, maxP] = priceRange[category];
    for (let i = 0; i < 50; i++) {
      const price = (Math.random() * (maxP - minP) + minP).toFixed(2);
      const stock = Math.floor(Math.random() * 150) + 10;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
      all.push({
        name: names[i],
        brand: brands[i % brands.length],
        description: descriptions[category],
        price: parseFloat(price),
        category,
        stockQuantity: stock,
        releaseDate: `2024-${month}-${day}`,
        productAvailable: true,
        imageUrl: images[category][i % images[category].length],
        imageName: `${category.toLowerCase()}_${i + 1}.jpg`,
      });
    }
  }
  return all;
}

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function deleteProduct(id) {
  return new Promise((resolve) => {
    const req = http.request(`${BASE_URL}/product/${id}`, { method: "DELETE" }, (res) => { res.resume(); res.on("end", resolve); });
    req.on("error", resolve);
    req.end();
  });
}

function getAllProducts() {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}/products`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

function postProduct(product, imageBuffer, imageName, contentType) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("imageFile", imageBuffer, { filename: imageName, contentType });
    form.append("product", JSON.stringify({
      name: product.name, brand: product.brand, description: product.description,
      price: product.price, category: product.category, stockQuantity: product.stockQuantity,
      releaseDate: product.releaseDate, productAvailable: product.productAvailable,
    }), { contentType: "application/json" });
    const options = { hostname: "localhost", port: 8080, path: "/api/product", method: "POST", headers: form.getHeaders() };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => res.statusCode === 201 ? resolve() : reject(new Error(`${res.statusCode}: ${data}`)));
    });
    req.on("error", reject);
    form.pipe(req);
  });
}

// Cache downloaded images to avoid re-downloading same URL
const imageCache = {};

async function getImage(url) {
  if (imageCache[url]) return imageCache[url];
  const result = await fetchImage(url);
  imageCache[url] = result;
  return result;
}

async function seed() {
  console.log("Deleting existing products...");
  try {
    const existing = await getAllProducts();
    for (const p of existing) await deleteProduct(p.id);
    console.log(`Deleted ${existing.length} products.`);
  } catch (e) {
    console.log("Could not delete existing:", e.message);
  }

  const products = makeProducts();
  console.log(`Seeding ${products.length} products (50 per category)...\n`);

  let count = 0;
  for (const product of products) {
    try {
      const { buffer, contentType } = await getImage(product.imageUrl);
      await postProduct(product, buffer, product.imageName, contentType);
      count++;
      process.stdout.write(`\r  Progress: ${count}/${products.length} - [${product.category}] ${product.name}          `);
    } catch (e) {
      console.log(`\n  FAILED: ${product.name} - ${e.message}`);
    }
  }
  console.log(`\n\nDone! ${count} products added.`);
}

seed();
