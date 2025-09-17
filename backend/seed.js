const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artcraft');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '123', // In production, this should be hashed
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'Sharad',
      email: 'sharad@gmail.com',
      password: '123', // In production, this should be hashed
      role: 'user'
    });

    console.log('Admin user created:', adminUser.email);
    console.log('Regular user created:', regularUser.email);

    // Create products
    await Product.insertMany([
      {
        name: 'Acrylic Paint Set',
        description: 'Professional 12-color acrylic paint set, perfect for canvas painting',
        price: 24.99,
        category: 'Painting',
        imageUrl: '/uploads/acrylic-paint.jpg',
        stock: 50
      },
      {
        name: 'Sketch Book',
        description: 'A4 size, 100 pages, suitable for pencil and charcoal sketching',
        price: 9.99,
        category: 'Drawing',
        imageUrl: '/uploads/sketch-book.jpg',
        stock: 100
      },
      {
        name: 'Brush Set',
        description: 'Set of 10 different size brushes for watercolor and acrylic painting',
        price: 15.99,
        category: 'Painting',
        imageUrl: '/uploads/brush-set.jpg',
        stock: 30
      },
      {
        name: 'Colored Pencils',
        description: '24 premium colored pencils for professional artists',
        price: 19.99,
        category: 'Drawing',
        imageUrl: '/uploads/colored-pencils.jpg',
        stock: 45
      },
      {
        name: 'Clay Set',
        description: 'Modeling clay set with tools, perfect for sculpture',
        price: 29.99,
        category: 'Sculpture',
        imageUrl: '/uploads/clay-set.jpg',
        stock: 25
      },
      {
        name: 'Watercolor Paint Palette',
        description: 'Premium watercolor paint set with 24 vibrant colors',
        price: 32.50,
        category: 'Painting',
        imageUrl: '/uploads/watercolor-palette.jpg',
        stock: 40
      },
      {
        name: 'Craft Scissors',
        description: 'Precision craft scissors for paper and fabric cutting',
        price: 7.99,
        category: 'Tools',
        imageUrl: '/uploads/craft-scissors.jpg',
        stock: 60
      },
      {
        name: 'Glue Gun',
        description: 'Mini hot glue gun with 20 glue sticks included',
        price: 14.99,
        category: 'Tools',
        imageUrl: '/uploads/glue-gun.jpg',
        stock: 35
      },
      {
        name: 'Craft Knife',
        description: 'Precision knife set with 5 replaceable blades',
        price: 11.50,
        category: 'Tools',
        imageUrl: '/uploads/craft-knife.jpg',
        stock: 40
      },
      {
        name: 'Cutting Mat',
        description: 'A3 size self-healing cutting mat with grid lines',
        price: 17.99,
        category: 'Tools',
        imageUrl: '/uploads/cutting-mat.jpg',
        stock: 28
      },
      {
        name: 'Glitter Pack',
        description: 'Assorted 12-color fine glitter jars for decoration',
        price: 8.50,
        category: 'Decoration',
        imageUrl: '/uploads/glitter-pack.jpg',
        stock: 75
      },
      {
        name: 'Sequins Pack',
        description: 'Mixed shape sequins pack for crafts and scrapbooking',
        price: 5.99,
        category: 'Decoration',
        imageUrl: '/uploads/sequins-pack.jpg',
        stock: 90
      },
      {
        name: 'Markers Set',
        description: 'Dual-tip alcohol markers set of 36 vibrant colors',
        price: 39.99,
        category: 'Drawing',
        imageUrl: '/uploads/markers-set.jpg',
        stock: 20
      },
      {
        name: 'Fine Liners',
        description: 'Pack of 10 waterproof fine liner pens, 0.1mm to 0.8mm',
        price: 12.99,
        category: 'Drawing',
        imageUrl: '/uploads/fine-liners.jpg',
        stock: 55
      },
      {
        name: 'Craft Paper Pack',
        description: '50-sheet assorted craft paper pack, patterned and plain',
        price: 10.99,
        category: 'Paper Crafts',
        imageUrl: '/uploads/craft-paper.jpg',
        stock: 70
      },
      {
        name: 'Washi Tape Set',
        description: 'Set of 20 decorative washi tapes for journaling and crafts',
        price: 13.99,
        category: 'Decoration',
        imageUrl: '/uploads/washi-tape.jpg',
        stock: 42
      },
      {
        name: 'Air-Dry Clay',
        description: '500g air-dry clay, safe and non-toxic, ideal for beginners',
        price: 9.99,
        category: 'Sculpture',
        imageUrl: '/uploads/air-dry-clay.jpg',
        stock: 65
      },
      {
        name: 'DIY Candle Kit',
        description: 'Complete candle making kit with wax, wicks, and dyes',
        price: 27.99,
        category: 'DIY Kits',
        imageUrl: '/uploads/diy-candle-kit.jpg',
        stock: 18
      },
      {
        name: 'DIY Jewelry Kit',
        description: 'Starter kit with beads, wires, and tools for making jewelry',
        price: 22.99,
        category: 'DIY Kits',
        imageUrl: '/uploads/diy-jewelry-kit.jpg',
        stock: 30
      },
      {
        name: 'DIY Scrapbook Kit',
        description: 'Complete scrapbook set with stickers, paper, and embellishments',
        price: 19.50,
        category: 'DIY Kits',
        imageUrl: '/uploads/diy-scrapbook-kit.jpg',
        stock: 26
      }
    ]);

    const allProducts = await Product.find();
    console.log('Products created:', allProducts.length);
    console.log('Database seeded successfully!');
    console.log('\nTest Account Credentials:');
    console.log('Admin Email: admin@gmail.com');
    console.log('Admin Password: 123');
    console.log('User Email: sharad@gmail.com');
    console.log('User Password: 123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
