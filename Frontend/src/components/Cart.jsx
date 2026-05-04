import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!cart.length) { setCartItems([]); return; }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}/products`);
        const ids = res.data.map(p => p.id);
        const items = cart
          .filter(item => ids.includes(item.id))
          .map(item => ({
            ...item,
            imageUrl: item.imageType
              ? `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/product/${item.id}/image`
              : (PRODUCT_IMAGES[item.name] || `https://placehold.co/200x200/1a1a2e/eee?text=${encodeURIComponent(item.name)}`)
          }));
        setCartItems(items);
      } catch {
        setCartItems(cart.map(item => ({ ...item, imageUrl: "" })));
      }
    };
    fetchCart();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncrease = (itemId) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (item.quantity < (item.stockQuantity || 99)) return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  };

  const handleDecrease = (itemId) => {
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckoutClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please login to proceed to checkout"); navigate("/login"); return; }
    navigate("/checkout");
  };



  // Price summary values
  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const mrpTotal = cartItems.reduce((s, i) => s + parseFloat((i.price * 1.2).toFixed(2)) * i.quantity, 0);
  const discount = parseFloat((mrpTotal - totalPrice).toFixed(2));
  const deliveryCharge = totalPrice >= 499 ? 0 : 49;
  const finalTotal = (totalPrice + deliveryCharge).toFixed(2);

  if (cartItems.length === 0 && cart.length === 0) {
    return (
      <div className="fk-cart-page">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
          <div className="fk-cart-panel">
            <div className="fk-empty-cart">
              <div className="fk-empty-cart__icon">🛒</div>
              <div className="fk-empty-cart__title">Your cart is empty!</div>
              <p className="fk-empty-cart__sub">Add items to it now.</p>
              <button className="fk-shop-btn" onClick={() => navigate("/")}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fk-cart-page">
      <div className="fk-cart-wrap">
        {/* Left — Items */}
        <div>
          <div className="fk-cart-panel">
            <div className="fk-cart-title">
              My Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </div>

            {cartItems.map(item => {
              const itemMrp = (item.price * 1.2).toFixed(2);
              const itemDiscount = Math.round(((itemMrp - item.price) / itemMrp) * 100);
              return (
                <div key={item.id} className="fk-cart-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="fk-cart-item__img"
                    onError={e => { e.target.onerror = null; e.target.src = PRODUCT_IMAGES[item.name] || `https://placehold.co/200x200/1a1a2e/eee?text=${encodeURIComponent(item.name)}`; }}
                  />
                  <div className="fk-cart-item__info">
                    <div className="fk-cart-item__name">{item.name}</div>
                    <div className="fk-cart-item__brand">{item.brand}</div>
                    <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
                      <span className="fk-cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                      <span className="fk-cart-item__orig">${(itemMrp * item.quantity).toFixed(2)}</span>
                      <span className="fk-cart-item__discount">{itemDiscount}% off</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <div className="fk-qty-row">
                        <button className="fk-qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                        <span className="fk-qty-val">{item.quantity}</span>
                        <button className="fk-qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                      </div>
                      <span style={{ color: "rgba(128,128,128,0.3)" }}>|</span>
                      <button className="fk-cart-remove" onClick={() => handleRemove(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Savings notice */}
            {discount > 0 && (
              <div style={{ padding: "12px 24px", background: "#e8f5e9", borderTop: "1px solid rgba(56,142,60,0.15)", fontSize: "0.88rem", color: "#388e3c", fontWeight: 600 }}>
                🎉 You will save ${discount.toFixed(2)} on this order
              </div>
            )}
          </div>
        </div>

        {/* Right — Price Details */}
        <div>
          <div className="fk-cart-panel">
            <div className="fk-price-panel">
              <h6>Price Details</h6>
              <div className="fk-price-row">
                <span>Price ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span>${mrpTotal.toFixed(2)}</span>
              </div>
              <div className="fk-price-row fk-price-row--savings">
                <span>Discount</span>
                <span>− ${discount.toFixed(2)}</span>
              </div>
              <div className="fk-price-row">
                <span>Delivery Charges</span>
                <span style={{ color: deliveryCharge === 0 ? "#388e3c" : "inherit" }}>
                  {deliveryCharge === 0 ? "FREE" : `$${deliveryCharge}`}
                </span>
              </div>
              <div className="fk-price-total">
                <span>Total Amount</span>
                <span>${finalTotal}</span>
              </div>
              {discount > 0 && (
                <p style={{ fontSize: "0.82rem", color: "#388e3c", fontWeight: 600, marginTop: 10 }}>
                  You will save ${discount.toFixed(2)} on this order
                </p>
              )}
              <button className="fk-checkout-btn" onClick={handleCheckoutClick}>
                PLACE ORDER
              </button>

              <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid rgba(128,128,128,0.12)" }}>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="bi bi-shield-fill-check text-success"></i>
                  Safe and Secure Payments. Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
