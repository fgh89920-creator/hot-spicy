# Hot Spicy - Copy generated food images to public/images/
$srcDir = "C:\Users\Mohammed\.gemini\antigravity\brain\58889fe1-415b-42c1-93b2-67808ea0b50c"
$destDir = "c:\Users\Mohammed\.gemini\antigravity\scratch\hot-spicy\public\images"

# Create destination directory
New-Item -ItemType Directory -Force $destDir | Out-Null

# Copy product images
Copy-Item "$srcDir\shawarma_hero_1779257627438.png" "$destDir\shawarma.png"
Copy-Item "$srcDir\chicken_platter_gold_1779256939387.png" "$destDir\broast.png"
Copy-Item "$srcDir\pizza_dark_dramatic_1779256910030.png" "$destDir\pizza.png"
Copy-Item "$srcDir\burger_hero_1779257657928.png" "$destDir\burger.png"
Copy-Item "$srcDir\juice_hero_1779257677305.png" "$destDir\juice.png"

# Copy extra assets
Copy-Item "$srcDir\pizza_white_bg_1779256891295.png" "$destDir\pizza-white.png"
Copy-Item "$srcDir\pizza_exploded_layers_1779256924761.png" "$destDir\pizza-exploded.png"
Copy-Item "$srcDir\single_chicken_wing_1779256979399.png" "$destDir\chicken-wing.png"
Copy-Item "$srcDir\falling_fries_1779256993831.png" "$destDir\falling-fries.png"
Copy-Item "$srcDir\plate_fries_base_1779256959984.png" "$destDir\plate-fries.png"

Write-Host "Done! All 10 images copied to public/images/" -ForegroundColor Green
Get-ChildItem $destDir | Format-Table Name, Length
