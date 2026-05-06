# Casa do Pão - Design Updates

## Changes Made

### 1. Home Page Hero Section
- **Background**: Changed from background image to clean gradient (`#faf0dc` to `#f5e8d0`)
- **Donut Image**: Added centered product image with parallax effect (floats up and down as user scrolls)
- **Text Overlay**: "Casa do Pão" text positioned over the donut with typing animation
- **Parallax Animation**: Smooth parallax scrolling effect on the donut image
- **Placeholder Image**: A basic SVG donut is included at `src/assets/images/donut.svg`

### 2. Navbar Redesign
- **Simplified Layout**: Clean, modern navbar with minimal styling
- **Logo**: Simple text-based logo "Casa do Pão" (without the tagline)
- **Navigation**: Horizontal menu with smooth underline animation on hover
- **Cart Button**: Icon with badge counter
- **Mobile Menu**: Responsive hamburger menu with smooth animations
- **Color Scheme**: Light background with dark text

### 3. Categories Page
- **Parallax Hero**: Hero section now has parallax effect on scroll
- **Drink Category Styling**: Different visual treatment for drink categories:
  - Blue-teal color scheme (#4a7a7d) instead of brown
  - Distinct background and button styling
- **Card Design**: Added subtle background with glassmorphic effect
- **Image Parallax**: Product images in category cards have subtle parallax effect
- **Responsive Design**: Cards stack nicely on mobile devices

## Setting Up Product Images

### Home Page Donut Image
Replace the placeholder at `src/assets/images/donut.svg` with your own image:

**Option 1: Use PNG (Recommended)**
1. Place your donut/dessert PNG (without background) at: `src/assets/images/donut.png`
2. Update `src/app/pages/home/home.component.html` line 8:
   ```html
   src="assets/images/donut.png"
   ```

**Option 2: Use SVG/Image of Choice**
- Simply replace the `donut.svg` file with your image
- Update the image path in the home component HTML if needed

### For Drink Categories
If you want to add different images for drink vs dessert categories:
1. The system checks if category ID contains "drink"
2. Drinks automatically get blue-teal styling
3. Create drink images and add to assets folder

## Key Features

✅ **Parallax Effects**
- Hero donut image floats smoothly
- Header background moves with scroll
- Category cards have subtle parallax

✅ **Smooth Animations**
- Donut floating animation (3s loop)
- Typing effect on subtitle
- Scroll hint pulse animation
- Navbar scroll detection
- Card hover effects

✅ **Responsive Design**
- Mobile hamburger menu
- Cards stack on smaller screens
- Touch-friendly interface

✅ **Color Schemes**
- Dessert categories: Warm brown tones
- Drink categories: Cool blue-teal tones

## Files Modified
- `src/app/pages/home/home.component.html`
- `src/app/pages/home/home.component.scss`
- `src/app/pages/home/home.component.ts`
- `src/app/components/navbar/navbar.component.html`
- `src/app/components/navbar/navbar.component.scss`
- `src/app/pages/categories/categories.component.html`
- `src/app/pages/categories/categories.component.ts`
- `src/app/pages/categories/categories.component.scss`

## Next Steps

1. **Replace placeholder images**: Add your high-quality PNG images to `src/assets/images/`
2. **Test responsive design**: Check on mobile devices
3. **Customize colors**: Adjust color variables in your global styles if needed
4. **Add more animations**: Extend the parallax effects further if desired

## Notes
- The typing animation cycles through: "Handcrafted with Love", "Fresh Every Morning", "Made for You"
- Parallax effect is subtle and performance-optimized with `will-change: transform`
- All animations use CSS3 transforms for best performance
