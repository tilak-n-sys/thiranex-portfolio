# NovaCart — Full-Stack Deployment & Project Architecture

## Assignment
Build, optimize and deploy a comprehensive Web Development Capstone Project demonstrating professional-grade web development capabilities.

## Included requirements
- Modular frontend architecture
- Client-side routing
- Responsive UI
- Product catalog
- REST API integration
- Search, category filtering and sorting
- Product detail pages
- Persistent cart state using localStorage
- Optimized/lazy-loaded product images
- Serverless API endpoint at `/api/products`
- Vercel deployment configuration
- Production-ready public URL after deployment

## Project structure
```text
NovaCart/
├── index.html
├── styles.css
├── app.js
├── vercel.json
├── README.md
└── api/
    └── products.js
```

## Deployment
Recommended platform: Vercel.

1. Create a public GitHub repository.
2. Upload all files/folders from this project (do not upload only the ZIP).
3. Import the repository into Vercel.
4. Deploy with the default settings.
5. Open the generated public URL.
6. Verify `/api/products` and the shopping features.
7. Submit the Vercel public URL for review.

## Functional test checklist
- Home page loads
- Products page loads
- REST API supplies products when deployed
- Search works
- Category filter works
- Sorting works
- Product detail route works
- Add to cart works
- Quantity changes work
- Remove works
- Cart persists after browser refresh
- Checkout clears the demo cart
- Mobile layout is responsive

## Notes
The frontend contains a local fallback dataset so the interface still renders if the API is unavailable during local testing. On Vercel, the application fetches the serverless REST endpoint at `/api/products`.
