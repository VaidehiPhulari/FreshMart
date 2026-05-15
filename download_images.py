import urllib.request
import json
import os

titles = {
    "apple.jpg": "File:Red_Apple.jpg",
    "onion.jpg": "File:Red_onions.jpg",
    "lentils.jpg": "File:Split_red_lentils.jpg"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

base_url = "https://commons.wikimedia.org/w/api.php?action=query&titles={}&prop=imageinfo&iiprop=url&format=json"

directories = [
    "c:/Users/Vaidehi/.gemini/antigravity/scratch/grocery-store/src/main/resources/static/images",
    "c:/Users/Vaidehi/.gemini/antigravity/scratch/grocery-store/target/classes/static/images"
]

for dir_path in directories:
    os.makedirs(dir_path, exist_ok=True)

for name, title in titles.items():
    try:
        req = urllib.request.Request(base_url.format(title.replace(' ', '%20')), headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                if 'imageinfo' in pages[page_id]:
                    image_url = pages[page_id]['imageinfo'][0]['url']
                    print(f"Found URL for {name}: {image_url}")
                    
                    # Download image
                    img_req = urllib.request.Request(image_url, headers=headers)
                    img_resp = urllib.request.urlopen(img_req).read()
                    
                    for dir_path in directories:
                        with open(os.path.join(dir_path, name), 'wb') as out_file:
                            out_file.write(img_resp)
                    print(f"Downloaded {name} successfully")
                else:
                    print(f"No imageinfo for {title}")
    except Exception as e:
        print(f"Failed {name}: {e}")
