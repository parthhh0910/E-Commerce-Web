import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const PRODUCT_IMAGES = {
  "MacBook Pro M3 14\"": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Dell XPS 15": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Sony WH-1000XM5": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "iPhone 15 Pro Max": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "LG C3 65-Inch 4K OLED TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Bose QuietComfort Earbuds II": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "PlayStation 5 Console": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Logitech MX Master 3S": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "iPad Pro 12.9-inch (M2)": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 1": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 2": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "LG Electronics Pro Gen 3": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 4": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Logitech Gaming Pro Gen 5": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 6": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 7": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 8": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 9": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 10": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 11": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Razer Accessories Pro Gen 12": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 13": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 14": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 15": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 16": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 17": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 18": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 19": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 20": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 21": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "JBL Audio Pro Gen 22": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 23": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 24": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Acer Laptop Pro Gen 25": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 26": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 27": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Microsoft Gaming Pro Gen 28": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=400&fit=crop",
  "Apple Laptop Pro Gen 29": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "Microsoft Gaming Pro Gen 30": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Xiaomi Mobile Pro Gen 31": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
  "Nintendo Gaming Pro Gen 32": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 33": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
  "Sony Audio Pro Gen 34": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 35": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "LG Electronics Pro Gen 36": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 37": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Samsung Mobile Pro Gen 38": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 39": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 40": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 41": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 42": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 43": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 44": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 45": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Microsoft Tablet Pro Gen 46": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Samsung Mobile Pro Gen 47": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 48": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 49": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Lenovo Laptop Pro Gen 50": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 51": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 52": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "HP Laptop Pro Gen 53": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 54": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 55": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Corsair Accessories Pro Gen 56": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 57": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 58": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 59": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 60": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 61": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "Logitech Gaming Pro Gen 62": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 63": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Apple Laptop Pro Gen 64": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 65": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 66": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "JBL Audio Pro Gen 67": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 68": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 69": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 70": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 71": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Sony Audio Pro Gen 72": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 73": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 74": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 75": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 76": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Lenovo Laptop Pro Gen 77": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 78": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 79": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Nintendo Gaming Pro Gen 80": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 81": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Logitech Gaming Pro Gen 82": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 83": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Corsair Accessories Pro Gen 84": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 85": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 86": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 87": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "LG Electronics Pro Gen 88": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 89": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Corsair Accessories Pro Gen 90": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 91": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 92": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 93": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Microsoft Tablet Pro Gen 94": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 95": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 96": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 97": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Sennheiser Audio Pro Gen 98": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 99": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "HP Laptop Pro Gen 100": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 101": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 102": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 103": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 104": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 105": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Razer Accessories Pro Gen 106": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 107": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 108": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 109": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 110": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 111": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 112": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "JBL Audio Pro Gen 113": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Acer Laptop Pro Gen 114": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 115": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "Apple Laptop Pro Gen 116": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 117": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 118": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 119": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 120": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 121": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 122": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Lenovo Laptop Pro Gen 123": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 124": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 125": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 126": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 127": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 128": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 129": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 130": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Logitech Accessories Pro Gen 131": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 132": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 133": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Sony Audio Pro Gen 134": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 135": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Sennheiser Audio Pro Gen 136": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 137": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 138": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 139": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 140": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "LG Electronics Pro Gen 141": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 142": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Razer Accessories Pro Gen 143": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 144": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Apple Mobile Pro Gen 145": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbc0?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 146": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "OnePlus Mobile Pro Gen 147": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=400&fit=crop",
  "Samsung Mobile Pro Gen 148": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "Sennheiser Audio Pro Gen 149": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "Sony Gaming Pro Gen 150": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 151": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Nintendo Gaming Pro Gen 152": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 153": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 154": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Bose Audio Pro Gen 155": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 156": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 157": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Panasonic Electronics Pro Gen 158": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 159": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 160": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Razer Gaming Pro Gen 161": "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&h=400&fit=crop",
  "Razer Accessories Pro Gen 162": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Acer Laptop Pro Gen 163": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Corsair Accessories Pro Gen 164": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Logitech Gaming Pro Gen 165": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Lenovo Tablet Pro Gen 166": "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=600&h=400&fit=crop",
  "Asus Laptop Pro Gen 167": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 168": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Apple Tablet Pro Gen 169": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Google Mobile Pro Gen 170": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "Apple Laptop Pro Gen 171": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
  "Samsung Tablet Pro Gen 172": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "Nintendo Gaming Pro Gen 173": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
  "Apple Tablet Pro Gen 174": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 175": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop",
  "Apple Laptop Pro Gen 176": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "LG Electronics Pro Gen 177": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "Apple Tablet Pro Gen 178": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "JBL Audio Pro Gen 179": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "Sony Mobile Pro Gen 180": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
  "Logitech Gaming Pro Gen 181": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 182": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 183": "https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=600&h=400&fit=crop",
  "Amazon Tablet Pro Gen 184": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 185": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 186": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
  "HP Laptop Pro Gen 187": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 188": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 189": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
  "MSI Laptop Pro Gen 190": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "HP Laptop Pro Gen 191": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
  "Corsair Accessories Pro Gen 192": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop",
  "Jabra Audio Pro Gen 193": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
  "Dell Laptop Pro Gen 194": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop",
  "Keychron Accessories Pro Gen 195": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=400&fit=crop",
  "Sony Electronics Pro Gen 196": "https://images.unsplash.com/photo-1550009158-9effb64fda70?w=600&h=400&fit=crop",
  "Apple Tablet Pro Gen 197": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
  "JBL Audio Pro Gen 198": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  "Samsung Electronics Pro Gen 199": "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&h=400&fit=crop",
  "Microsoft Gaming Pro Gen 200": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
};

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, user } = useContext(AppContext);
  const [addedMap, setAddedMap] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to add items to your cart!", "warning");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    addToCart(product);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    showToast(`"${product.name}" added to cart!`, "success");
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1800);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`home-toast home-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          {toast.message}
        </div>
      )}

      <div style={{ paddingTop: "120px", minHeight: "80vh", paddingBottom: "60px" }}>
        <div className="container">
          <h2 style={{ fontWeight: 800, marginBottom: "8px", color: "var(--para-clr)" }}>
            My Wishlist <span style={{ color: "#ef4444" }}>❤️</span>
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#888", background: "var(--card-bg-clr)", borderRadius: "16px", border: "1px solid rgba(128,128,128,0.1)" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🤍</div>
              <h4 style={{ color: "var(--para-clr)" }}>Your wishlist is empty</h4>
              <p style={{ marginBottom: "24px" }}>Save items you love to view them later.</p>
              <button className="co-btn co-btn--primary" onClick={() => navigate("/")}>Browse Products</button>
            </div>
          ) : (
            <div className="home-product-grid" style={{ paddingTop: 0 }}>
              {wishlist.map((product, idx) => {
                const { id, brand, name, price, productAvailable, stockQuantity } = product;
                const isAdded = addedMap[id];
                const mrp = (price * 1.22).toFixed(2);
                const discount = Math.round(((mrp - price) / mrp) * 100);

                return (
                  <div className="home-card" key={id} style={{ animationDelay: `${idx * 0.04}s` }}>
                    <button
                      className="wishlist-btn wishlist-btn--active"
                      onClick={(e) => handleToggleWishlist(e, product)}
                      title="Remove from wishlist"
                    >
                      ❤️
                    </button>

                    <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
                      <div className="home-card__img-wrap">
                        <img
                          src={PRODUCT_IMAGES[name] || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${id}/image`}
                          alt={name}
                          className="home-card__img"
                          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1a1a2e/eee?text=${encodeURIComponent(name)}`; }}
                        />
                      </div>

                      <div className="home-card__body d-flex flex-column">
                        <p className="home-card__brand text-muted mb-1">{brand}</p>
                        <h5 className="home-card__name mb-1">{name}</h5>

                        <div className="home-card__rating mb-1" style={{ fontSize: "0.82rem" }}>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-half text-warning"></i>
                          <span className="ms-1 text-muted">(1.2k)</span>
                        </div>

                        <div className="home-card__footer mt-auto pt-2 border-top border-opacity-10">
                          <div>
                            <span className="home-card__price fw-bolder">${price}</span>
                            <span className="home-card__mrp">${mrp}</span>
                            <span className="home-card__discount">{discount}% off</span>
                          </div>
                          <button
                            className={`home-card__btn ${isAdded ? "home-card__btn--added shadow-none" : "shadow-sm"} ${!productAvailable ? "home-card__btn--disabled" : ""}`}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable}
                          >
                            {isAdded ? "✓ Added" : <><i className="bi bi-cart-plus me-1"></i>Add</>}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
