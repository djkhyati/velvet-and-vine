const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const sampleProducts = [
    {
        name: 'Silk Blend Midi Dress',
        description: 'Elegant emerald green silk-blend midi dress with a fulid dreape.',
        price: 89.99,
        category: 'Clothing',
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        stock: 15
    },
    {
        name: "Tailored Wool Coat",
        description: "Classic oversized camel coat crafted from a premium wool blend.",
        price: 159.99,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500",
        stock: 8
    },
    {
        name: "Minimalist Leather Tote",
        description: "Structured everyday leather tote bag in rich black.",
        price: 119.99,
        category: "Bags",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        stock: 12
    },
    {
        name: "Pointed Toe Leather Boots",
        description: "Sleek ankle boots with a comfortable block heel.",
        price: 139.99,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
        stock: 10
    }
];
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected for seeding...');
        await Product.deleteMany({});
        await Product.insertMany(sampleProducts);
        console.log('Sample products seeded successfully.');
        process.exit();
    })
    .catch((error) => {
        console.error('Seeding error:', error);
        process.exit(1);
    });
    